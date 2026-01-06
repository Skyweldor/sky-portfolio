import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Globe Landing Page - Using dynamic imports for Three.js modules
 */

// Updated configuration for our routes
const GLOBE_CONFIG = {
  // Top navigation - matching original labels
  navigationLinks: {
    'Home': '/',
    'Skills': '/portfolio',
    'Projects': '/portfolio'
  },
  serviceLinks: {
    'Game Development': '/portfolio',
    'Quantitative Finance': '#',
    'Tutoring': '#',
    'Make-Up/Skincare E-Commerce': '/makeup',
    'Stickers E-Commerce': '/stickers'
  },
  debug: false,
  rotation: {
    globeSpeed: -0.0003,
    textSpeed: 0.0006,
    textRotateOpposite: false,
    particleSpeed: -0.0002
  }
};

// CSS styles inline (font loaded via <link> element for reliability)
const globeStyles = `
  .globe-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #020924;
    font-family: "IBM Plex Mono", "Courier New", Courier, monospace;
  }

  .globe-page * {
    box-sizing: border-box;
  }

  #globe-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    animation: floatAnimation 10s ease-in-out infinite;
  }

  @keyframes floatAnimation {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  #globe-container canvas {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    outline: none;
    cursor: grab;
  }

  #background-cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #020924;
    z-index: 1;
  }

  .css2d-label {
    color: #00ddff;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(0, 221, 255, 0.7);
    white-space: nowrap;
    transition: all 0.2s ease;
    font-family: "IBM Plex Mono", "Courier New", monospace !important;
  }

  #loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #00ddff;
    font-size: 1.2rem;
    text-shadow: 0 0 10px rgba(0, 221, 255, 0.7);
    z-index: 100;
  }

  #loading-indicator:before {
    content: "";
    display: block;
    width: 40px;
    height: 40px;
    margin: 0 auto 20px;
    border: 2px solid #00ddff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .page-exit {
    animation: fadeOut 0.5s ease-in forwards;
  }

  @keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  .aesthetic-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    background: rgba(0, 10, 30, 0.8);
    border: 1px solid rgba(0, 221, 255, 0.4);
    border-radius: 8px;
    padding: 10px 16px;
    color: #00ddff;
    font-family: "IBM Plex Mono", monospace;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-shadow: 0 0 8px rgba(0, 221, 255, 0.5);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .aesthetic-toggle:hover {
    background: rgba(0, 30, 60, 0.9);
    border-color: rgba(0, 221, 255, 0.7);
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 221, 255, 0.3);
  }

  .aesthetic-toggle .icon {
    font-size: 16px;
  }

  .aesthetic-toggle.dark-mode {
    background: rgba(0, 5, 15, 0.9);
    border-color: rgba(0, 150, 180, 0.4);
    color: #0099aa;
    text-shadow: 0 0 5px rgba(0, 150, 180, 0.3);
  }

  .aesthetic-toggle.dark-mode:hover {
    border-color: rgba(0, 150, 180, 0.6);
    box-shadow: 0 0 15px rgba(0, 150, 180, 0.2);
  }

  /* Debug Panel */
  .debug-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background: rgba(0, 10, 30, 0.95);
    border: 1px solid rgba(0, 221, 255, 0.4);
    border-radius: 8px;
    padding: 16px;
    color: #00ddff;
    font-family: "IBM Plex Mono", monospace;
    font-size: 11px;
    width: 280px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .debug-panel h3 {
    margin: 0 0 12px 0;
    font-size: 14px;
    border-bottom: 1px solid rgba(0, 221, 255, 0.3);
    padding-bottom: 8px;
  }

  .debug-panel .slider-group {
    margin-bottom: 10px;
  }

  .debug-panel label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .debug-panel input[type="range"] {
    width: 100%;
    height: 4px;
    background: rgba(0, 221, 255, 0.2);
    border-radius: 2px;
    outline: none;
    -webkit-appearance: none;
  }

  .debug-panel input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #00ddff;
    border-radius: 50%;
    cursor: pointer;
  }

  .debug-panel .copy-btn {
    width: 100%;
    margin-top: 12px;
    padding: 8px;
    background: rgba(0, 221, 255, 0.2);
    border: 1px solid rgba(0, 221, 255, 0.5);
    border-radius: 4px;
    color: #00ddff;
    font-family: inherit;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .debug-panel .copy-btn:hover {
    background: rgba(0, 221, 255, 0.3);
  }

  .debug-panel .copy-btn.copied {
    background: rgba(0, 255, 100, 0.3);
    border-color: rgba(0, 255, 100, 0.5);
    color: #00ff64;
  }

  .debug-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999;
    background: rgba(0, 10, 30, 0.8);
    border: 1px solid rgba(0, 221, 255, 0.4);
    border-radius: 4px;
    padding: 6px 12px;
    color: #00ddff;
    font-family: "IBM Plex Mono", monospace;
    font-size: 11px;
    cursor: pointer;
  }
`;

export default function GlobeLanding() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const initialized = useRef(false);
  const aestheticRef = useRef({ isDarkMode: false, toggle: null });
  const debugRef = useRef({ updateParam: null });
  const [showDebug, setShowDebug] = React.useState(false);
  const [debugValues, setDebugValues] = React.useState({
    exposure: 0.9,
    bloomStrength: 0.7,
    bloomRadius: 0.2,
    bloomThreshold: 0.2,
    bloomIntensity: 1.3,
    textOpacity: 0.1,
    wireframeOpacity: 0.6,
    particleOpacity: 0.7,
    globeOpacity: 0.9
  });

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Load IBM Plex Mono font via link element (more reliable than @import in dynamic styles)
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = globeStyles;
    document.head.appendChild(styleEl);

    // Custom navigation handler that uses React Router
    const handleNavigation = (url) => {
      if (!url || url === '#') return;
      document.body.classList.add('page-exit');
      setTimeout(() => {
        document.body.classList.remove('page-exit');
        navigate(url);
      }, 500);
    };

    const loadGlobe = async () => {
      try {
        // Dynamic imports for Three.js and its modules
        const THREE = await import('three');
        const { FontLoader } = await import('three/examples/jsm/loaders/FontLoader');
        const { TextGeometry } = await import('three/examples/jsm/geometries/TextGeometry');
        const { CSS2DRenderer, CSS2DObject } = await import('three/examples/jsm/renderers/CSS2DRenderer');
        const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer');
        const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass');
        const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass');
        const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass');

        const container = containerRef.current;
        if (!container) return;

        const config = GLOBE_CONFIG;
        const rotationConfig = config.rotation;

        // Device detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = isMobile && Math.min(window.innerWidth, window.innerHeight) > 480;
        const isLowEndDevice = isMobile || (window.devicePixelRatio < 2 && window.innerWidth < 768);
        const segmentCount = isLowEndDevice ? 32 : 64;
        const useAntialias = !isLowEndDevice;
        const particleCount = isLowEndDevice ? 100 : 300;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020924);

        // Bloom layer for selective bloom
        const BLOOM_LAYER = 1;
        const bloomLayer = new THREE.Layers();
        bloomLayer.set(BLOOM_LAYER);

        // Materials cache for selective bloom
        const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const materials = {};

        // Enable bloom on object
        const enableBloom = (obj, strength = 1) => {
          if (!obj) return;
          obj.layers.enable(BLOOM_LAYER);
          obj.userData = obj.userData || {};
          obj.userData.bloomIntensity = strength;
          if (obj.children) {
            obj.children.forEach(child => enableBloom(child, strength));
          }
        };

        // Disable bloom on object (won't glow)
        const disableBloom = (obj) => {
          if (!obj) return;
          obj.layers.disable(BLOOM_LAYER);
          if (obj.children) {
            obj.children.forEach(child => disableBloom(child));
          }
        };

        // Darken non-bloomed objects before bloom pass
        const darkenNonBloomed = (obj) => {
          if (obj.isMesh || obj.isLine || obj.isPoints) {
            if (!bloomLayer.test(obj.layers)) {
              materials[obj.uuid] = obj.material;
              obj.material = darkMaterial;
            }
          }
        };

        // Restore materials after bloom pass
        const restoreMaterial = (obj) => {
          if (materials[obj.uuid]) {
            obj.material = materials[obj.uuid];
            delete materials[obj.uuid];
          }
        };

        // Camera
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        if (isMobile && !isTablet) {
          camera.position.set(0, 2.0, 15);
        } else if (isTablet) {
          camera.position.set(0, 1.0, 12);
        } else {
          camera.position.set(0, 0.5, 6);
        }
        camera.lookAt(0, 0, 0);

        // WebGL Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: useAntialias });
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (!isLowEndDevice) renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // CSS2D Renderer
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(labelRenderer.domElement);

        // Lights - darker aesthetic
        scene.add(new THREE.AmbientLight(0xffffff, 0.25));
        const pointLight = new THREE.PointLight(0x00ddff, 0.6);
        pointLight.position.set(5, 3, 5);
        scene.add(pointLight);
        const blueGlow = new THREE.PointLight(0x00ddff, 0.4);
        blueGlow.position.set(-5, -3, 5);
        scene.add(blueGlow);

        // Floor Grid
        const floorGrid = new THREE.GridHelper(20, 20, 0x00ddff, 0x005588);
        floorGrid.position.y = isMobile ? -2.0 : -3.0;
        scene.add(floorGrid);
        enableBloom(floorGrid, 0.7);

        // Globe Group
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // Globe sphere
        const globeMesh = new THREE.Mesh(
          new THREE.SphereGeometry(2, segmentCount, segmentCount),
          new THREE.MeshPhongMaterial({ color: 0x000030, transparent: true, opacity: 1, emissive: 0x000010 })
        );
        globeGroup.add(globeMesh);

        // Grid lines on globe
        const gridLines = new THREE.Object3D();
        for (let i = 0; i < 24; i++) {
          const line = new THREE.LineLoop(
            new THREE.CircleGeometry(2, 64),
            new THREE.LineBasicMaterial({ color: 0x00ddff, transparent: true, opacity: 0.1 })
          );
          line.rotation.y = Math.PI / 2;
          line.rotation.z = i * (Math.PI / 12);
          gridLines.add(line);
        }
        for (let i = -8; i <= 8; i += 2) {
          const r = 2 * Math.cos(i * (Math.PI / 18));
          const lat = new THREE.LineLoop(
            new THREE.CircleGeometry(r, 64),
            new THREE.LineBasicMaterial({ color: 0x00ddff, transparent: true, opacity: 0.1 })
          );
          lat.rotation.x = Math.PI / 2;
          lat.position.y = 2 * Math.sin(i * (Math.PI / 18));
          gridLines.add(lat);
        }
        globeGroup.add(gridLines);
        enableBloom(gridLines, 0.8);

        // Wireframe overlay - vibrant aesthetic
        const wireframe = new THREE.Mesh(
          new THREE.SphereGeometry(2.01, segmentCount, segmentCount),
          new THREE.MeshBasicMaterial({ color: 0x00ddff, wireframe: true, transparent: true, opacity: 0.6 })
        );
        globeGroup.add(wireframe);
        enableBloom(wireframe, 1.5);

        // Equatorial ring (invisible but used in original)
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(2.5, 2.6, 64),
          new THREE.MeshBasicMaterial({ color: 0x00ddff, transparent: true, opacity: 0, side: THREE.DoubleSide })
        );
        ring.rotation.x = Math.PI / 2;
        globeGroup.add(ring);
        enableBloom(ring, 1.5);

        // Inner glow
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(1.9, segmentCount, segmentCount),
          new THREE.MeshBasicMaterial({ color: 0x00ddff, transparent: true, opacity: 0.05 })
        );
        globeGroup.add(glow);
        enableBloom(glow, 1.0);

        globeGroup.rotation.x = Math.PI * 0.06;
        globeGroup.rotation.y = Math.PI * 0.5;

        // Equator text group
        const equatorTextGroup = new THREE.Group();
        scene.add(equatorTextGroup);

        // Navigation links
        const navContainer = new THREE.Object3D();
        navContainer.position.set(0, 2.5, 0);
        scene.add(navContainer);

        Object.entries(config.navigationLinks).forEach(([text, url], index) => {
          const anchor = new THREE.Object3D();
          anchor.position.x = (index - 1) * 3.0;
          navContainer.add(anchor);

          const div = document.createElement('div');
          div.className = 'css2d-label';
          div.textContent = text;
          div.style.cssText = 'font-family:"IBM Plex Mono","Courier New",monospace;color:#00ddff;font-size:18px;padding:4px 20px;background:rgba(0,10,30,0.7);border-radius:4px;border:1px solid rgba(0,221,255,0.3);pointer-events:auto;cursor:pointer;text-shadow:0 0 10px rgba(0,221,255,0.9);transition:all 0.2s ease;';
          div.style.setProperty('font-weight', '700', 'important');

          div.onmouseenter = () => { div.style.background = 'rgba(0,30,60,0.9)'; div.style.transform = 'scale(1.1)'; };
          div.onmouseleave = () => { div.style.background = 'rgba(0,10,30,0.7)'; div.style.transform = 'scale(1)'; };
          div.onclick = () => handleNavigation(url);

          anchor.add(new CSS2DObject(div));
        });

        // Service label containers
        const leftContainer = new THREE.Object3D();
        leftContainer.position.set(isMobile ? -3 : -5.5, isMobile ? -1.5 : 0, 0);
        scene.add(leftContainer);

        const rightContainer = new THREE.Object3D();
        rightContainer.position.set(isMobile ? 3 : 5.5, isMobile ? -1.5 : 0, 0);
        scene.add(rightContainer);

        // Service labels
        const services = [
          { text: "Game Development", side: "left" },
          { text: "Quantitative Finance", side: "left" },
          { text: "Tutoring", side: "left" },
          { text: "Make-Up/Skincare E-Commerce", side: "right" },
          { text: "Stickers E-Commerce", side: "right" }
        ];

        const leftItems = services.filter(s => s.side === 'left');
        const rightItems = services.filter(s => s.side === 'right');

        const createLabel = (item, idx, parent) => {
          const anchor = new THREE.Object3D();
          anchor.position.y = 1.2 * (1 - idx);
          parent.add(anchor);

          const url = config.serviceLinks[item.text] || '#';
          const disabled = !url || url === '#';

          const div = document.createElement('div');
          div.className = 'css2d-label';
          div.textContent = item.text;
          div.style.cssText = `font-family:"IBM Plex Mono","Courier New",monospace;color:${disabled ? '#446688' : '#00ddff'};font-size:16px;padding:4px 12px;background:rgba(0,10,30,0.7);border-radius:4px;border:1px solid ${disabled ? 'rgba(68,102,136,0.3)' : 'rgba(0,221,255,0.3)'};pointer-events:auto;cursor:${disabled ? 'default' : 'pointer'};text-shadow:0 0 8px ${disabled ? 'rgba(68,102,136,0.5)' : 'rgba(0,221,255,0.7)'};transition:all 0.2s ease;`;
          div.style.setProperty('font-weight', '700', 'important');

          if (!disabled) {
            div.onmouseenter = () => { div.style.background = 'rgba(0,30,60,0.85)'; div.style.transform = 'scale(1.1)'; };
            div.onmouseleave = () => { div.style.background = 'rgba(0,10,30,0.7)'; div.style.transform = 'scale(1)'; };
            div.onclick = () => handleNavigation(url);
          }

          anchor.add(new CSS2DObject(div));
        };

        leftItems.forEach((item, i) => createLabel(item, i, leftContainer));
        rightItems.forEach((item, i) => createLabel(item, i, rightContainer));

        // Load font and create 3D text
        const fontLoader = new FontLoader();
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
          const text = "[ SYNTHCITY DIGILABS[]SYNTHCITY DIGILABS ]";
          const radius = 2.80;

          const textGeom = new TextGeometry(text, {
            font, size: 0.5, height: 0.25, curveSegments: 8,
            bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.05, bevelSegments: 5
          });

          textGeom.computeBoundingBox();
          const bbox = textGeom.boundingBox;
          const textWidth = bbox.max.x - bbox.min.x;
          const arcAngle = Math.PI * 2.055;

          textGeom.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, -1));

          const pos = textGeom.getAttribute('position');
          const v = new THREE.Vector3();
          for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            const alpha = 1 - ((v.x - bbox.min.x) / textWidth);
            const angle = -arcAngle / 2 + alpha * arcAngle;
            pos.setXYZ(i, radius * Math.cos(angle), v.y, radius * Math.sin(angle));
          }
          textGeom.computeVertexNormals();

          // Fill material (invisible but provides depth for softer look)
          const fillMat = new THREE.MeshBasicMaterial({
            color: 0x00ddff, transparent: true, opacity: 0,
            side: THREE.DoubleSide, depthWrite: false, depthTest: true
          });

          // Wireframe material (visible) - vibrant aesthetic default
          const wireMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.1,
            side: THREE.DoubleSide, depthWrite: false, depthTest: true
          });

          // Add both meshes like the original (fill first, then wireframe)
          const fillMesh = new THREE.Mesh(textGeom, fillMat);
          const wireMesh = new THREE.Mesh(textGeom.clone(), wireMat);
          equatorTextGroup.add(fillMesh);
          equatorTextGroup.add(wireMesh);
          enableBloom(wireMesh, 1.8);  // Text glows in magical mode

          // Store references for aesthetic switching
          adjustableMaterials.wireMat = wireMat;
          adjustableMaterials.wireMesh = wireMesh;

          equatorTextGroup.rotation.copy(globeGroup.rotation);
          equatorTextGroup.rotation.y += Math.PI * -0.1;
        });

        // Particles
        const particleGeom = new THREE.BufferGeometry();
        const count = Math.floor(particleCount * (isMobile ? 1.5 : 1));
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
          const r = 2 + Math.random() * 3.25;
          const phi = Math.acos(Math.random() * 2 - 1);
          const theta = Math.random() * Math.PI * 2;
          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.cos(phi);
          positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
          scales[i] = 0.5 + Math.random() * 1.5;
          speeds[i] = 0.3 + Math.random() * 1.7;
        }

        particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeom.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        particleGeom.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

        const particles = new THREE.Points(particleGeom, new THREE.PointsMaterial({
          size: 0.05, color: 0x00ddff, transparent: true, opacity: 0.7  // Vibrant aesthetic
        }));
        scene.add(particles);
        enableBloom(particles, 1.4);

        // Selective bloom setup with two composers
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 1.0;

        // Bloom parameters - final tuned values
        const bloomParams = {
          strength: 0.7,
          radius: 0.2,
          threshold: 0.2
        };

        // Bloom composer - renders only bloomed objects
        const bloomComposer = new EffectComposer(renderer);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          bloomParams.strength,
          bloomParams.radius,
          bloomParams.threshold
        );
        bloomComposer.addPass(bloomPass);

        // Additive blend shader - combines bloom with base scene (with intensity multiplier and exposure)
        // Note: bloomTexture must be set AFTER creating ShaderPass to avoid cloning error
        const additiveBlendShader = {
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: null },
            bloomIntensity: { value: 1.3 },
            exposure: { value: 0.9 }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;
            uniform float bloomIntensity;
            uniform float exposure;
            varying vec2 vUv;
            void main() {
              vec4 base = texture2D(baseTexture, vUv);
              vec4 bloom = texture2D(bloomTexture, vUv) * bloomIntensity;
              vec4 combined = base + bloom;
              // Apply exposure (simple multiply, then tone map to prevent clipping)
              combined.rgb *= exposure;
              // Simple Reinhard tone mapping to prevent oversaturation
              combined.rgb = combined.rgb / (1.0 + combined.rgb);
              gl_FragColor = combined;
            }
          `
        };

        // Final composer - renders base scene and blends bloom
        const finalComposer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        finalComposer.addPass(renderPass);
        const blendPass = new ShaderPass(additiveBlendShader, 'baseTexture');
        blendPass.needsSwap = true;
        finalComposer.addPass(blendPass);

        // Set bloom texture AFTER creating ShaderPass (avoids clone error)
        blendPass.uniforms.bloomTexture.value = bloomComposer.renderTarget2.texture;

        // Aesthetic presets - final tuned values
        const aesthetics = {
          magical: {
            exposure: 0.9,
            bloomStrength: 0.7,
            bloomRadius: 0.2,
            bloomThreshold: 0.2,
            bloomIntensity: 1.3,
            textOpacity: 0.1,
            textBloom: true,
            wireframeOpacity: 0.6,
            particleOpacity: 0.7,
            globeOpacity: 0.9
          },
          dark: {
            exposure: 0.5,
            bloomStrength: 0.3,
            bloomRadius: 0.4,
            bloomThreshold: 0.4,
            bloomIntensity: 0.6,
            textOpacity: 0.05,
            textBloom: false,
            wireframeOpacity: 0.25,
            particleOpacity: 0.4,
            globeOpacity: 1.0
          }
        };

        // Materials that can be adjusted (will be populated after text loads)
        const adjustableMaterials = {
          wireMat: null,
          wireMesh: null,
          wireframe: wireframe,
          particles: particles,
          globeMesh: globeMesh,
          blendPass: blendPass
        };

        // Apply aesthetic preset
        const applyAesthetic = (preset) => {
          const settings = aesthetics[preset];

          // Update bloom
          bloomPass.strength = settings.bloomStrength;
          bloomPass.radius = settings.bloomRadius;
          bloomPass.threshold = settings.bloomThreshold;

          // Update exposure and bloom intensity in shader
          if (blendPass.uniforms) {
            if (blendPass.uniforms.bloomIntensity) {
              blendPass.uniforms.bloomIntensity.value = settings.bloomIntensity;
            }
            if (blendPass.uniforms.exposure) {
              blendPass.uniforms.exposure.value = settings.exposure;
            }
          }

          // Update wireframe
          wireframe.material.opacity = settings.wireframeOpacity;

          // Update particles
          particles.material.opacity = settings.particleOpacity;

          // Update globe
          globeMesh.material.opacity = settings.globeOpacity;

          // Update text if loaded
          if (adjustableMaterials.wireMat) {
            adjustableMaterials.wireMat.opacity = settings.textOpacity;
          }
          if (adjustableMaterials.wireMesh) {
            if (settings.textBloom) {
              enableBloom(adjustableMaterials.wireMesh, 1.8);
            } else {
              disableBloom(adjustableMaterials.wireMesh);
            }
          }
        };

        // Toggle function
        const toggleAesthetic = () => {
          aestheticRef.current.isDarkMode = !aestheticRef.current.isDarkMode;
          applyAesthetic(aestheticRef.current.isDarkMode ? 'dark' : 'magical');

          // Update button appearance
          const btn = document.getElementById('aesthetic-toggle-btn');
          if (btn) {
            if (aestheticRef.current.isDarkMode) {
              btn.classList.add('dark-mode');
              btn.innerHTML = '<span class="icon">&#9790;</span> Dark Mode';
            } else {
              btn.classList.remove('dark-mode');
              btn.innerHTML = '<span class="icon">&#10024;</span> Magical';
            }
          }
        };

        // Store toggle function in ref so button can access it
        aestheticRef.current.toggle = toggleAesthetic;

        // Debug: Live parameter update function
        debugRef.current.updateParam = (param, value) => {
          switch (param) {
            case 'exposure':
              if (blendPass.uniforms?.exposure) {
                blendPass.uniforms.exposure.value = value;
              }
              break;
            case 'bloomStrength':
              bloomPass.strength = value;
              break;
            case 'bloomRadius':
              bloomPass.radius = value;
              break;
            case 'bloomThreshold':
              bloomPass.threshold = value;
              break;
            case 'bloomIntensity':
              if (blendPass.uniforms?.bloomIntensity) {
                blendPass.uniforms.bloomIntensity.value = value;
              }
              break;
            case 'textOpacity':
              if (adjustableMaterials.wireMat) {
                adjustableMaterials.wireMat.opacity = value;
              }
              break;
            case 'wireframeOpacity':
              wireframe.material.opacity = value;
              break;
            case 'particleOpacity':
              particles.material.opacity = value;
              break;
            case 'globeOpacity':
              globeMesh.material.opacity = value;
              break;
          }
        };

        // Interaction
        let isDragging = false, prevX = 0, prevY = 0, rotX = 0, rotY = 0, autoRotate = true;

        container.onmousedown = (e) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; autoRotate = false; };
        document.onmousemove = (e) => { if (isDragging) { rotX = (e.clientY - prevY) * 0.0005; rotY = (e.clientX - prevX) * 0.0005; prevX = e.clientX; prevY = e.clientY; }};
        document.onmouseup = () => { if (isDragging) { isDragging = false; setTimeout(() => autoRotate = true, 3000); }};

        // Touch events
        container.ontouchstart = (e) => {
          if (e.touches.length === 1) {
            isDragging = true;
            prevX = e.touches[0].clientX;
            prevY = e.touches[0].clientY;
            autoRotate = false;
          }
        };
        container.ontouchmove = (e) => {
          if (isDragging && e.touches.length === 1) {
            rotX = (e.touches[0].clientY - prevY) * 0.0005;
            rotY = (e.touches[0].clientX - prevX) * 0.0005;
            prevX = e.touches[0].clientX;
            prevY = e.touches[0].clientY;
          }
        };
        container.ontouchend = () => { if (isDragging) { isDragging = false; setTimeout(() => autoRotate = true, 3000); }};

        // Resize
        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          labelRenderer.setSize(window.innerWidth, window.innerHeight);
          bloomComposer.setSize(window.innerWidth, window.innerHeight);
          finalComposer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        // Animation
        let time = 0;
        const animate = () => {
          requestAnimationFrame(animate);
          time += 0.01;

          // Particle twinkle
          const scaleAttr = particleGeom.getAttribute('scale');
          const speedAttr = particleGeom.getAttribute('speed');
          for (let i = 0; i < count; i++) {
            scaleAttr.array[i] = 0.5 + (Math.sin(time * speedAttr.array[i]) * 0.5 + 0.5) * 1.5;
          }
          scaleAttr.needsUpdate = true;

          if (autoRotate) {
            globeGroup.rotation.y -= rotationConfig.globeSpeed;
            equatorTextGroup.rotation.y -= rotationConfig.textSpeed;
            particles.rotation.y += rotationConfig.particleSpeed;
          } else {
            globeGroup.rotation.x += rotX;
            globeGroup.rotation.y += rotY;
            equatorTextGroup.rotation.x = globeGroup.rotation.x;
            equatorTextGroup.rotation.y = globeGroup.rotation.y;
            particles.rotation.x = globeGroup.rotation.x;
            particles.rotation.y = globeGroup.rotation.y;
            if (!isDragging) { rotX *= 0.95; rotY *= 0.95; }
          }

          // Selective bloom rendering
          // 1. Darken non-bloomed objects
          scene.traverse(darkenNonBloomed);
          // 2. Render bloom pass
          bloomComposer.render();
          // 3. Restore materials
          scene.traverse(restoreMaterial);
          // 4. Render final pass with bloom overlay
          finalComposer.render();

          labelRenderer.render(scene, camera);
        };

        animate();

        // Hide loading
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.style.display = 'none';

      } catch (err) {
        console.error('Globe init error:', err);
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.textContent = 'Error: ' + err.message;
      }
    };

    loadGlobe();

    return () => {
      styleEl.remove();
      fontLink.remove();
    };
  }, [navigate]);

  const handleSliderChange = (param, value) => {
    const numValue = parseFloat(value);
    setDebugValues(prev => ({ ...prev, [param]: numValue }));
    if (debugRef.current.updateParam) {
      debugRef.current.updateParam(param, numValue);
    }
  };

  const copyValues = () => {
    const output = `// Paste these values into the aesthetic preset:
{
  exposure: ${debugValues.exposure},
  bloomStrength: ${debugValues.bloomStrength},
  bloomRadius: ${debugValues.bloomRadius},
  bloomThreshold: ${debugValues.bloomThreshold},
  bloomIntensity: ${debugValues.bloomIntensity},
  textOpacity: ${debugValues.textOpacity},
  textBloom: true,
  wireframeOpacity: ${debugValues.wireframeOpacity},
  particleOpacity: ${debugValues.particleOpacity},
  globeOpacity: ${debugValues.globeOpacity}
}`;
    navigator.clipboard.writeText(output);
    const btn = document.getElementById('copy-values-btn');
    if (btn) {
      btn.classList.add('copied');
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = 'Copy Values';
      }, 2000);
    }
  };

  const sliderConfig = [
    { key: 'exposure', label: 'Exposure', min: 0.5, max: 2, step: 0.05 },
    { key: 'bloomStrength', label: 'Bloom Strength', min: 0, max: 3, step: 0.1 },
    { key: 'bloomRadius', label: 'Bloom Radius', min: 0, max: 2, step: 0.1 },
    { key: 'bloomThreshold', label: 'Bloom Threshold', min: 0, max: 1, step: 0.05 },
    { key: 'bloomIntensity', label: 'Bloom Intensity', min: 0, max: 3, step: 0.1 },
    { key: 'textOpacity', label: 'Text Opacity', min: 0, max: 1, step: 0.05 },
    { key: 'wireframeOpacity', label: 'Wireframe Opacity', min: 0, max: 1, step: 0.05 },
    { key: 'particleOpacity', label: 'Particle Opacity', min: 0, max: 1, step: 0.05 },
    { key: 'globeOpacity', label: 'Globe Opacity', min: 0, max: 1, step: 0.05 },
  ];

  return (
    <div className="globe-page">
      <div id="background-cover" />
      <div id="loading-indicator">Loading 3D Globe...</div>
      <div ref={containerRef} id="globe-container" />

      {/* Debug Panel */}
      {showDebug && (
        <div className="debug-panel">
          <h3>Bloom Debug Panel</h3>
          {sliderConfig.map(({ key, label, min, max, step }) => (
            <div key={key} className="slider-group">
              <label>
                <span>{label}</span>
                <span>{debugValues[key].toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={debugValues[key]}
                onChange={(e) => handleSliderChange(key, e.target.value)}
              />
            </div>
          ))}
          <button id="copy-values-btn" className="copy-btn" onClick={copyValues}>
            Copy Values
          </button>
          <button
            className="copy-btn"
            style={{ marginTop: '8px' }}
            onClick={() => setShowDebug(false)}
          >
            Hide Panel
          </button>
        </div>
      )}

      {!showDebug && (
        <button className="debug-toggle" onClick={() => setShowDebug(true)}>
          Show Debug
        </button>
      )}

      <button
        id="aesthetic-toggle-btn"
        className="aesthetic-toggle"
        onClick={() => aestheticRef.current.toggle && aestheticRef.current.toggle()}
      >
        <span className="icon">&#10024;</span> Magical
      </button>
    </div>
  );
}
