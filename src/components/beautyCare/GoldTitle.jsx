// GoldTitle.jsx — 3D PBR gold text with debug controls
// Technique: dark base color + high envMapIntensity + tight key light
// = only direct specular reflections survive as bright gold
import React, { useRef, useEffect, useState, useCallback } from 'react';
import './css/GoldTitle.css';

const PRESETS = {
  base: {
    'near-black': 0x1a0e00,
    'dark-brown': 0x3d2200,
    'medium':     0x5a3d10,
  },
  roughness: {
    'mirror':   0.15,
    'polished': 0.3,
    'satin':    0.5,
  },
  env: {
    dark:   { bg: 0x010100, key: 0xfff8e0, fill: 0x0a0800, exposure: 0.9, intensity: 4.5 },
    medium: { bg: 0x080604, key: 0xfff5e0, fill: 0x1a1208, exposure: 1.0, intensity: 3.0 },
    bright: { bg: 0x111111, key: 0xfff5e0, fill: 0x2a2018, exposure: 1.1, intensity: 2.0 },
  },
};

const GoldTitle = ({ text = 'ELEVATE' }) => {
  const containerRef = useRef(null);
  const stateRef = useRef(null);
  const [showDebug, setShowDebug] = useState(true);
  const [active, setActive] = useState({ base: 'medium', roughness: 'mirror', env: 'bright' });
  const [geo, setGeo] = useState({ scale: 1.0, camZ: 10, textSize: 0.75, depth: 0.02 });
  const [diag, setDiag] = useState({ wireframe: false, flat: false, bevel: true, frontOnly: true });

  // Toggle debug panel with backtick key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '`') setShowDebug(prev => !prev);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Three.js setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId;
    let disposed = false;

    const init = async () => {
      // Nuke any stale canvases from StrictMode double-mount or HMR
      const staleCanvases = container.querySelectorAll('canvas');
      if (staleCanvases.length > 0) {
        console.warn('[GoldTitle] Removing', staleCanvases.length, 'stale canvas(es)');
        staleCanvases.forEach(c => container.removeChild(c));
      }

      const THREE = await import('three');
      const { FontLoader } = await import('three/examples/jsm/loaders/FontLoader');
      const { TextGeometry } = await import('three/examples/jsm/geometries/TextGeometry');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment');

      if (disposed) return;

      const w = container.clientWidth;
      const h = container.clientHeight || 220;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
      camera.position.set(0, 0, 10);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      if (THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      }
      container.appendChild(renderer.domElement);
      console.log('[GoldTitle] Canvas count after append:', container.querySelectorAll('canvas').length);

      // --- Environment map (RoomEnvironment — reliable studio lighting for PBR) ---
      const pmremGen = new THREE.PMREMGenerator(renderer);
      const envMap = pmremGen.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envMap;
      pmremGen.dispose();

      // --- Material: gold PBR (medium base + bright env for visibility on light bg) ---
      const mat = new THREE.MeshStandardMaterial({
        color: 0x5a3d10,
        metalness: 1.0,
        roughness: 0.15,
        envMap: envMap,
        envMapIntensity: 2.0,
      });

      // Diagnostic flat material — solid red, no lighting, shows raw geometry
      const diagMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

      // Warm directional lights for gold tone
      const dLight = new THREE.DirectionalLight(0xfff0d0, 1.5);
      dLight.position.set(3, 5, 4);
      scene.add(dLight);

      const dLight2 = new THREE.DirectionalLight(0xffe8c0, 0.8);
      dLight2.position.set(-3, -1, 3);
      scene.add(dLight2);

      scene.add(new THREE.AmbientLight(0x030201, 0.3));

      // --- Load font + create text geometry ---
      let textMesh = null;

      const addMeshToScene = (geo) => {
        geo.computeBoundingBox();
        const bb = geo.boundingBox;
        geo.translate(
          -(bb.max.x + bb.min.x) / 2,
          -(bb.max.y + bb.min.y) / 2,
          -(bb.max.z + bb.min.z) / 2
        );
        textMesh = new THREE.Mesh(geo, mat);
        scene.add(textMesh);
        if (stateRef.current) stateRef.current.textMesh = textMesh;
      };

      // Helper: build text geometry via ExtrudeGeometry directly
      // (bypasses TextGeometry which ignores our depth parameter — always uses 50)
      const buildTextGeo = (font, size, depth, bevel) => {
        const shapes = font.generateShapes(text, size);
        const geo = new THREE.ExtrudeGeometry(shapes, {
          depth: depth,
          curveSegments: 24,
          bevelEnabled: bevel,
          bevelThickness: bevel ? 0.03 : 0,
          bevelSize: bevel ? 0.02 : 0,
          bevelSegments: bevel ? 8 : 0,
        });
        console.log('[GoldTitle] ExtrudeGeometry depth=%s, bbox before center:', depth);
        geo.computeBoundingBox();
        const bb = geo.boundingBox;
        console.log('[GoldTitle]   Z:', bb.min.z.toFixed(3), '→', bb.max.z.toFixed(3));
        return geo;
      };

      const loader = new FontLoader();
      loader.load(
        'https://threejs.org/examples/fonts/optimer_bold.typeface.json',
        (font) => {
          if (disposed) return;
          if (stateRef.current) stateRef.current._font = font;
          const geo = buildTextGeo(font, 0.75, 0.02, true);
          addMeshToScene(geo);
        },
        undefined,
        (err) => {
          // Font failed — fall back to a torus knot so the gold material is still visible
          console.warn('GoldTitle: font load failed, using fallback shape', err);
          if (disposed) return;
          addMeshToScene(new THREE.TorusKnotGeometry(0.8, 0.25, 128, 32));
        }
      );

      // --- Mouse tracking ---
      let mouseX = 0, mouseY = 0;
      let rotY = 0, rotX = 0;

      const onMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      container.addEventListener('mousemove', onMouseMove);

      // --- Store refs for debug ---
      stateRef.current = { mat, diagMat, renderer, textMesh, camera, scene, THREE, text, addMeshToScene, buildTextGeo, _FontLoader: FontLoader, _TextGeometry: TextGeometry, _font: null };

      // --- Animation loop ---
      const animate = () => {
        animId = requestAnimationFrame(animate);
        if (textMesh) {
          const targetY = mouseX * 0.3;
          const targetX = -mouseY * 0.15;
          rotY += (targetY - rotY) * 0.04;
          rotX += (targetX - rotX) * 0.04;
          textMesh.rotation.y = rotY;
          textMesh.rotation.x = rotX;
        }
        renderer.render(scene, camera);
      };
      animate();

      // --- Resize ---
      const onResize = () => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', onResize);

      // Cleanup ref
      stateRef.current._cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        container.removeEventListener('mousemove', onMouseMove);
        renderer.dispose();
        mat.dispose();
        diagMat.dispose();
        if (textMesh) textMesh.geometry.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    };

    init();

    return () => {
      disposed = true;
      if (animId) cancelAnimationFrame(animId);
      if (stateRef.current?._cleanup) stateRef.current._cleanup();
    };
  }, [text]);

  // --- Debug handlers ---
  const handleBase = useCallback((key) => {
    if (!stateRef.current) return;
    stateRef.current.mat.color.setHex(PRESETS.base[key]);
    setActive(prev => ({ ...prev, base: key }));
  }, []);

  const handleRoughness = useCallback((key) => {
    if (!stateRef.current) return;
    stateRef.current.mat.roughness = PRESETS.roughness[key];
    setActive(prev => ({ ...prev, roughness: key }));
  }, []);

  const handleEnv = useCallback((key) => {
    if (!stateRef.current) return;
    const p = PRESETS.env[key];
    stateRef.current.renderer.toneMappingExposure = p.exposure;
    stateRef.current.mat.envMapIntensity = p.intensity;
    setActive(prev => ({ ...prev, env: key }));
  }, []);

  const handleScale = useCallback((val) => {
    const v = parseFloat(val);
    if (!stateRef.current?.textMesh) return;
    stateRef.current.textMesh.scale.setScalar(v);
    setGeo(prev => ({ ...prev, scale: v }));
  }, []);

  const handleCamZ = useCallback((val) => {
    const v = parseFloat(val);
    if (!stateRef.current?.camera) return;
    stateRef.current.camera.position.z = v;
    setGeo(prev => ({ ...prev, camZ: v }));
  }, []);

  const handleTextSize = useCallback((val) => {
    const v = parseFloat(val);
    const st = stateRef.current;
    if (!st?.textMesh || !st._font || !st.buildTextGeo) return;
    setGeo(prev => {
      const oldGeo = st.textMesh.geometry;
      const newGeo = st.buildTextGeo(st._font, v, prev.depth, true);
      newGeo.computeBoundingBox();
      const bb = newGeo.boundingBox;
      newGeo.translate(
        -(bb.max.x + bb.min.x) / 2,
        -(bb.max.y + bb.min.y) / 2,
        -(bb.max.z + bb.min.z) / 2
      );
      st.textMesh.geometry = newGeo;
      oldGeo.dispose();
      return { ...prev, textSize: v };
    });
  }, []);

  const handleDepth = useCallback((val) => {
    const v = parseFloat(val);
    const st = stateRef.current;
    if (!st?.textMesh || !st._font || !st.buildTextGeo) {
      console.warn('[GoldTitle] handleDepth bail:', !st?.textMesh ? 'no mesh' : !st._font ? 'no font' : 'no builder');
      return;
    }
    setGeo(prev => {
      console.log('[GoldTitle] handleDepth: depth %s → %s', prev.depth, v);
      const oldGeo = st.textMesh.geometry;
      const newGeo = st.buildTextGeo(st._font, prev.textSize, v, true);
      newGeo.computeBoundingBox();
      const bb = newGeo.boundingBox;
      newGeo.translate(
        -(bb.max.x + bb.min.x) / 2,
        -(bb.max.y + bb.min.y) / 2,
        -(bb.max.z + bb.min.z) / 2
      );
      st.textMesh.geometry = newGeo;
      oldGeo.dispose();
      return { ...prev, depth: v };
    });
  }, []);

  // --- Diagnostic handlers ---
  const handleWireframe = useCallback(() => {
    const st = stateRef.current;
    if (!st?.mat) return;
    setDiag(prev => {
      const next = !prev.wireframe;
      st.mat.wireframe = next;
      st.diagMat.wireframe = next;
      return { ...prev, wireframe: next };
    });
  }, []);

  const handleFlat = useCallback(() => {
    const st = stateRef.current;
    if (!st?.textMesh) return;
    setDiag(prev => {
      const next = !prev.flat;
      st.textMesh.material = next ? st.diagMat : st.mat;
      return { ...prev, flat: next };
    });
  }, []);

  const handleFrontOnly = useCallback(() => {
    const st = stateRef.current;
    if (!st?.mat || !st?.THREE) return;
    setDiag(prev => {
      const next = !prev.frontOnly;
      const side = next ? st.THREE.FrontSide : st.THREE.DoubleSide;
      st.mat.side = side;
      st.diagMat.side = side;
      return { ...prev, frontOnly: next };
    });
  }, []);

  const handleBevel = useCallback(() => {
    const st = stateRef.current;
    if (!st?.textMesh || !st._font || !st.buildTextGeo) return;
    setDiag(prev => {
      setGeo(geoPrev => {
        const next = !prev.bevel;
        const oldGeo = st.textMesh.geometry;
        const newGeo = st.buildTextGeo(st._font, geoPrev.textSize, geoPrev.depth, next);
        newGeo.computeBoundingBox();
        const bb = newGeo.boundingBox;
        newGeo.translate(
          -(bb.max.x + bb.min.x) / 2,
          -(bb.max.y + bb.min.y) / 2,
          -(bb.max.z + bb.min.z) / 2
        );
        st.textMesh.geometry = newGeo;
        oldGeo.dispose();
        console.log('[GoldTitle] bevel=%s, bbox Z:', next, bb.min.z.toFixed(3), '→', bb.max.z.toFixed(3));
        return geoPrev;
      });
      return { ...prev, bevel: !prev.bevel };
    });
  }, []);

  return (
    <div className="gold-title-wrapper">
      <div className="gold-title-canvas" ref={containerRef} />
      {showDebug && (
        <div className="gold-debug-panel gold-debug-fixed" role="dialog" aria-label="3D Gold debug controls">
          <div className="gold-debug-header">
            <span>3D Gold Debug</span>
            <button onClick={() => setShowDebug(false)} aria-label="Close debug panel">&times;</button>
          </div>
          <div className="gold-debug-group">
            <span className="gold-debug-label">Base</span>
            {Object.keys(PRESETS.base).map(k => (
              <button key={k} className={`gold-debug-btn ${active.base === k ? 'active' : ''}`}
                onClick={() => handleBase(k)}>{k}</button>
            ))}
          </div>
          <div className="gold-debug-group">
            <span className="gold-debug-label">Finish</span>
            {Object.keys(PRESETS.roughness).map(k => (
              <button key={k} className={`gold-debug-btn ${active.roughness === k ? 'active' : ''}`}
                onClick={() => handleRoughness(k)}>{k}</button>
            ))}
          </div>
          <div className="gold-debug-group">
            <span className="gold-debug-label">Env</span>
            {Object.keys(PRESETS.env).map(k => (
              <button key={k} className={`gold-debug-btn ${active.env === k ? 'active' : ''}`}
                onClick={() => handleEnv(k)}>{k}</button>
            ))}
          </div>
          <div className="gold-debug-divider" />
          <div className="gold-debug-group">
            <span className="gold-debug-label">Scale</span>
            <input type="range" className="gold-debug-slider" min="0.3" max="3" step="0.05"
              value={geo.scale} onChange={e => handleScale(e.target.value)} />
            <span className="gold-debug-value">{geo.scale.toFixed(2)}</span>
          </div>
          <div className="gold-debug-group">
            <span className="gold-debug-label">Cam Z</span>
            <input type="range" className="gold-debug-slider" min="2" max="15" step="0.25"
              value={geo.camZ} onChange={e => handleCamZ(e.target.value)} />
            <span className="gold-debug-value">{geo.camZ.toFixed(1)}</span>
          </div>
          <div className="gold-debug-group">
            <span className="gold-debug-label">Size</span>
            <input type="range" className="gold-debug-slider" min="0.2" max="2" step="0.05"
              value={geo.textSize} onChange={e => handleTextSize(e.target.value)} />
            <span className="gold-debug-value">{geo.textSize.toFixed(2)}</span>
          </div>
          <div className="gold-debug-group">
            <span className="gold-debug-label">Depth</span>
            <input type="range" className="gold-debug-slider" min="0.02" max="0.8" step="0.02"
              value={geo.depth} onChange={e => handleDepth(e.target.value)} />
            <span className="gold-debug-value">{geo.depth.toFixed(2)}</span>
          </div>
          <div className="gold-debug-divider" />
          <div className="gold-debug-group">
            <span className="gold-debug-label">Diag</span>
            <button className={`gold-debug-btn ${diag.wireframe ? 'active' : ''}`}
              onClick={handleWireframe}>wireframe</button>
            <button className={`gold-debug-btn ${diag.flat ? 'active' : ''}`}
              onClick={handleFlat}>flat red</button>
            <button className={`gold-debug-btn ${diag.bevel ? 'active' : ''}`}
              onClick={handleBevel}>bevel</button>
            <button className={`gold-debug-btn ${diag.frontOnly ? 'active' : ''}`}
              onClick={handleFrontOnly}>front-only</button>
          </div>
          <div className="gold-debug-hint">Press <kbd>`</kbd> to toggle</div>
        </div>
      )}
    </div>
  );
};

export default GoldTitle;
