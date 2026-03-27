import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useModelDebug } from './ModelDebugPanel';
import styles from './PokemonModelViewer.module.css';

/* ── Type → rim-light colour map ── */
const TYPE_RIM_COLORS = {
  water: '#5b8cff',
  bug: '#8bc34a',
  poison: '#ab47bc',
  psychic: '#ff6090',
  fairy: '#f48fb1',
  normal: '#9e9e9e',
  flying: '#80d8ff',
  rock: '#a1887f',
  ground: '#d4a574',
  grass: '#66bb6a',
};

/* ============================================================
   CameraSync — updates camera when debug values change
   ============================================================ */
function CameraSync({ cameraX, cameraY, cameraZ, fov }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, cameraX, cameraY, cameraZ, fov]);
  return null;
}

/* ============================================================
   Inner scene component — runs inside the Canvas / R3F context
   ============================================================ */
function PokemonModel({ modelPath, modelFile, mtlFile, onLoaded, onError, scale, rotateSpeed }) {
  const groupRef = useRef();
  const [object, setObject] = useState(null);

  /* Load MTL → OBJ chain */
  useEffect(() => {
    let cancelled = false;

    const mtlUrl = encodeURI(`${modelPath}${mtlFile}`);
    const objUrl = encodeURI(`${modelPath}${modelFile}`);

    const mtlLoader = new MTLLoader();
    mtlLoader.setResourcePath(encodeURI(modelPath));

    mtlLoader.load(
      mtlUrl,
      (materials) => {
        if (cancelled) return;
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load(
          objUrl,
          (obj) => {
            if (cancelled) return;

            /* Centre the model based on its bounding box */
            const box = new THREE.Box3().setFromObject(obj);
            const center = box.getCenter(new THREE.Vector3());
            obj.position.sub(center);

            setObject(obj);
            onLoaded();
          },
          undefined,
          (err) => {
            if (!cancelled) {
              console.error('OBJ load error:', err);
              onError();
            }
          },
        );
      },
      undefined,
      (err) => {
        if (!cancelled) {
          console.error('MTL load error:', err);
          onError();
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [modelPath, modelFile, mtlFile, onLoaded, onError]);

  /* Dispose Three.js resources on unmount */
  useEffect(() => {
    return () => {
      if (object) {
        object.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => {
                m.map?.dispose();
                m.dispose();
              });
            } else if (child.material) {
              child.material.map?.dispose();
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [object]);

  /* Slow auto-rotation */
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotateSpeed;
    }
  });

  if (!object) return null;

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <primitive object={object} />
    </group>
  );
}

/* ============================================================
   Public component
   ============================================================ */
const PokemonModelViewer = ({ modelPath, modelFile, mtlFile, primaryType }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { settings, active } = useModelDebug();

  /* Stabilise callbacks so they don't trigger re-loads */
  const handleLoaded = useMemo(() => () => setLoading(false), []);
  const handleError = useMemo(
    () => () => {
      setLoading(false);
      setError(true);
    },
    [],
  );

  const rimColor = TYPE_RIM_COLORS[primaryType] || '#9e9e9e';

  // Use debug settings if panel is active, otherwise defaults
  const h = active ? settings.height : 240;
  const camPos = active ? [settings.cameraX, settings.cameraY, settings.cameraZ] : [0, 1.5, 3];
  const fov = active ? settings.fov : 60;
  const scale = active ? settings.modelScale : 0.65;
  const rotSpeed = active ? settings.rotateSpeed : 0.35;
  const ambInt = active ? settings.ambientIntensity : 0.4;
  const dirInt = active ? settings.dirIntensity : 0.9;
  const dirPos = active ? [settings.dirX, settings.dirY, settings.dirZ] : [3, 4, 2];
  const rimInt = active ? settings.rimIntensity : 1.2;
  const rimPos = active ? [settings.rimX, settings.rimY, settings.rimZ] : [-2, 1, -2];
  const zoom = active ? settings.enableZoom : false;
  const minP = active ? (settings.minPolar * Math.PI) / 180 : Math.PI / 2;
  const maxP = active ? (settings.maxPolar * Math.PI) / 180 : Math.PI / 2;
  const bg = active ? settings.bgColor : '#000a19';

  return (
    <div className={styles.viewerContainer}>
      {/* Loading indicator */}
      {loading && !error && (
        <div className={styles.loadingOverlay}>
          <span className={styles.loadingText}>LOADING...</span>
        </div>
      )}

      {/* Error indicator */}
      {error && (
        <div className={styles.errorOverlay}>
          <span className={styles.errorText}>MODEL_ERROR</span>
        </div>
      )}

      <Canvas
        className={styles.canvas}
        camera={{ position: camPos, fov }}
        style={{ background: bg, height: `${h}px` }}
      >
        {/* Sync camera when debug values change */}
        {active && (
          <CameraSync
            cameraX={settings.cameraX}
            cameraY={settings.cameraY}
            cameraZ={settings.cameraZ}
            fov={settings.fov}
          />
        )}

        {/* Lighting */}
        <ambientLight intensity={ambInt} />
        <directionalLight position={dirPos} intensity={dirInt} />
        <pointLight position={rimPos} color={rimColor} intensity={rimInt} />

        {/* Model */}
        <PokemonModel
          modelPath={modelPath}
          modelFile={modelFile}
          mtlFile={mtlFile}
          onLoaded={handleLoaded}
          onError={handleError}
          scale={scale}
          rotateSpeed={rotSpeed}
        />

        {/* Controls */}
        <OrbitControls
          enableZoom={zoom}
          enablePan={false}
          minPolarAngle={minP}
          maxPolarAngle={maxP}
        />
      </Canvas>
    </div>
  );
};

export default PokemonModelViewer;
