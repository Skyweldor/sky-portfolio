import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobeMobileMenu from '../components/common/GlobeMobileMenu';
import { useTransition } from '../context/TransitionContext';
import './GlobeLanding.css';

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

// Additional runtime styles for dynamically created elements (CSS2D labels)
// Main styles are in GlobeLanding.css which is imported at the top
const globeStyles = `
  .css2d-label {
    color: #00ddff;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(0, 221, 255, 0.7);
    white-space: nowrap;
    transition: all 0.2s ease;
    font-family: "IBM Plex Mono", "Courier New", monospace !important;
  }
`;

export default function GlobeLanding() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const initialized = useRef(false);

  // Detect mobile/tablet for conditional menu rendering
  const [isMobileDevice] = useState(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });

  // Loading state for phased progress
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    hidden: false, // Completely remove from DOM after fade
    phase: 'init',
    progress: 0,
    text: 'Initializing Systems...'
  });

  // Global transition context for navigation
  const { startTransition } = useTransition();
  const startTransitionRef = useRef(startTransition);

  // Handle navigation with transition overlay
  const handleNavigate = useCallback((url) => {
    if (!url || url === '#') return;

    // Show global transition overlay
    startTransitionRef.current('Navigating...');

    // Navigate after brief delay for transition to appear
    setTimeout(() => {
      navigate(url);
    }, 600);
  }, [navigate]);

  // Keep ref updated for useEffect to access
  startTransitionRef.current = startTransition;

  useEffect(() => {
    // Loading phases defined inside useEffect to avoid dependency warning
    const LOADING_PHASES = {
      init: { progress: 0, text: 'Initializing Systems...' },
      modules: { progress: 15, text: 'Loading Modules...' },
      scene: { progress: 30, text: 'Constructing Environment...' },
      globe: { progress: 45, text: 'Generating Globe Mesh...' },
      labels: { progress: 60, text: 'Loading Interface...' },
      font: { progress: 75, text: 'Downloading Typography...' },
      particles: { progress: 85, text: 'Spawning Particles...' },
      bloom: { progress: 95, text: 'Applying Effects...' },
      ready: { progress: 100, text: 'System Online' }
    };

    const updateLoadingPhase = (phase) => {
      const phaseData = LOADING_PHASES[phase];
      if (phaseData) {
        setLoadingState(prev => ({
          ...prev,
          phase,
          progress: phaseData.progress,
          text: phaseData.text
        }));
      }
    };
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

    // Custom navigation handler that uses React Router with transition overlay
    const handleNavigation = (url) => {
      if (!url || url === '#') return;

      // Use the global transition context
      if (startTransitionRef.current) {
        startTransitionRef.current('Navigating...');
      }

      // Navigate after transition appears
      setTimeout(() => {
        navigate(url);
      }, 600);
    };

    const loadGlobe = async () => {
      try {
        // Dynamic imports for Three.js and its modules
        updateLoadingPhase('modules');
        const THREE = await import('three');
        const { FontLoader } = await import('three/examples/jsm/loaders/FontLoader');
        const { TextGeometry } = await import('three/examples/jsm/geometries/TextGeometry');
        const { CSS2DRenderer, CSS2DObject } = await import('three/examples/jsm/renderers/CSS2DRenderer');
        const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer');
        const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass');
        const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass');
        const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass');

        updateLoadingPhase('scene');
        const container = containerRef.current;
        if (!container) return;

        const config = GLOBE_CONFIG;
        const rotationConfig = config.rotation;

        // Device detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = isMobile && Math.min(window.innerWidth, window.innerHeight) > 480;

        // Enhanced device capability detection
        const detectQualityTier = () => {
          const deviceMemory = navigator.deviceMemory || 4;
          const hardwareConcurrency = navigator.hardwareConcurrency || 4;
          const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
          const connectionSpeed = connection?.effectiveType || '4g';

          // GPU capability via WebGL
          let gpuTier = 'high';
          try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
              const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
              const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
              const lowEndGPUs = ['Mali-4', 'Adreno 3', 'PowerVR SGX', 'Intel HD Graphics 4'];
              const midEndGPUs = ['Mali-T', 'Adreno 4', 'Adreno 5', 'Intel HD Graphics 5', 'Intel UHD'];
              if (lowEndGPUs.some(gpu => renderer.includes(gpu))) {
                gpuTier = 'low';
              } else if (midEndGPUs.some(gpu => renderer.includes(gpu))) {
                gpuTier = 'medium';
              }
            }
          } catch (e) {
            gpuTier = 'medium';
          }

          // Scoring system
          let score = 100;
          if (isMobile) score -= 20;
          if (deviceMemory < 4) score -= 30;
          if (hardwareConcurrency < 4) score -= 20;
          if (connectionSpeed === 'slow-2g' || connectionSpeed === '2g') score -= 15;
          if (connectionSpeed === '3g') score -= 5;
          if (gpuTier === 'low') score -= 25;
          if (gpuTier === 'medium') score -= 10;
          if (window.devicePixelRatio < 1.5) score -= 10;

          if (score >= 70) return 'high';
          if (score >= 40) return 'medium';
          return 'low';
        };

        const qualityTier = detectQualityTier();

        // Quality settings by tier (bloom always enabled - mission critical)
        const QUALITY_SETTINGS = {
          high: {
            segmentCount: 64,
            particleCount: 300,
            useAntialias: true,
            pixelRatio: Math.min(window.devicePixelRatio, 2),
            bloomStrength: 0.7,
            bloomRadius: 0.2
          },
          medium: {
            segmentCount: 48,
            particleCount: 200,
            useAntialias: true,
            pixelRatio: Math.min(window.devicePixelRatio, 1.5),
            bloomStrength: 0.5,
            bloomRadius: 0.15
          },
          low: {
            segmentCount: 32,
            particleCount: 100,
            useAntialias: false,
            pixelRatio: 1,
            bloomStrength: 0.3,
            bloomRadius: 0.1
          }
        };

        const quality = QUALITY_SETTINGS[qualityTier];
        const segmentCount = quality.segmentCount;
        const useAntialias = quality.useAntialias;
        const particleCount = quality.particleCount;

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
        renderer.setPixelRatio(quality.pixelRatio);
        container.appendChild(renderer.domElement);

        // CSS2D Renderer
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.left = '0';
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
        updateLoadingPhase('globe');
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

        // Only show floating CSS2D labels on desktop (mobile/tablet uses hamburger menu)
        updateLoadingPhase('labels');
        const showFloatingLabels = !isMobile && !isTablet;

        if (showFloatingLabels) {
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
          leftContainer.position.set(-5.5, 0, 0);
          scene.add(leftContainer);

          const rightContainer = new THREE.Object3D();
          rightContainer.position.set(5.5, 0, 0);
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
        }

        // Load font and create 3D text
        updateLoadingPhase('font');
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
          enableBloom(wireMesh, 1.8);  // Text glows

          equatorTextGroup.rotation.copy(globeGroup.rotation);
          equatorTextGroup.rotation.y += Math.PI * -0.1;
        });

        // Particles
        updateLoadingPhase('particles');
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
        updateLoadingPhase('bloom');
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 1.0;

        // Bloom parameters - use quality tier settings (bloom always enabled)
        const bloomParams = {
          strength: quality.bloomStrength,
          radius: quality.bloomRadius,
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

        // Interaction - only enable drag-to-rotate on desktop
        let isDragging = false, prevX = 0, prevY = 0, rotX = 0, rotY = 0, autoRotate = true;
        const enableDragRotation = !isMobile && !isTablet;

        if (enableDragRotation) {
          container.onmousedown = (e) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; autoRotate = false; };
          document.onmousemove = (e) => { if (isDragging) { rotX = (e.clientY - prevY) * 0.0005; rotY = (e.clientX - prevX) * 0.0005; prevX = e.clientX; prevY = e.clientY; }};
          document.onmouseup = () => { if (isDragging) { isDragging = false; setTimeout(() => autoRotate = true, 3000); }};
        } else {
          // Remove grab cursor on touch devices
          container.style.cursor = 'default';
        }

        // Touch gestures for mobile/tablet (pinch-to-zoom, double-tap reset)
        if (isMobile || isTablet) {
          let initialPinchDistance = null;
          let currentZoom = camera.position.z;
          const MIN_ZOOM = 4;
          const MAX_ZOOM = 20;
          let lastTap = 0;
          const DOUBLE_TAP_DELAY = 300;

          const getDistance = (touch1, touch2) => {
            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
          };

          const resetCameraView = () => {
            const targetZ = isMobile && !isTablet ? 15 : isTablet ? 12 : 6;
            const targetY = isMobile && !isTablet ? 2.0 : isTablet ? 1.0 : 0.5;
            const startZ = camera.position.z;
            const startY = camera.position.y;
            const duration = 500;
            const startTime = performance.now();

            const animateReset = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

              camera.position.z = startZ + (targetZ - startZ) * eased;
              camera.position.y = startY + (targetY - startY) * eased;

              if (progress < 1) {
                requestAnimationFrame(animateReset);
              } else {
                currentZoom = camera.position.z;
              }
            };

            requestAnimationFrame(animateReset);

            // Haptic feedback
            if (navigator.vibrate) {
              navigator.vibrate([50, 50, 50]);
            }
          };

          // Pinch-to-zoom
          container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
              initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
              e.preventDefault();
            }
          }, { passive: false });

          container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialPinchDistance !== null) {
              const currentDistance = getDistance(e.touches[0], e.touches[1]);
              const scale = initialPinchDistance / currentDistance;

              let newZoom = currentZoom * scale;
              newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

              camera.position.z = newZoom;
              e.preventDefault();
            }
          }, { passive: false });

          container.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
              initialPinchDistance = null;
              currentZoom = camera.position.z;
            }

            // Double-tap detection
            if (e.touches.length === 0 && e.changedTouches.length === 1) {
              const currentTime = new Date().getTime();
              const tapLength = currentTime - lastTap;

              if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
                resetCameraView();
                e.preventDefault();
              }
              lastTap = currentTime;
            }
          });
        }

        // Resize and orientation handling
        let lastWidth = window.innerWidth;

        const onResize = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          const isLandscape = width > height;
          const isTabletLandscape = isTablet && isLandscape;
          const significantChange = Math.abs(width - lastWidth) > 100;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          labelRenderer.setSize(width, height);
          bloomComposer.setSize(width, height);
          finalComposer.setSize(width, height);

          // Tablet landscape: shift globe slightly and adjust camera
          if (isTabletLandscape) {
            globeGroup.position.x = -1;
            camera.position.set(0, 0.8, 10);
          } else if (isTablet) {
            globeGroup.position.x = 0;
            camera.position.set(0, 1.0, 12);
          }

          // Detect iPad Split View or significant width change
          if (significantChange && isTablet) {
            const isSplitView = width < 700;
            // Menu handles navigation in split view - globe stays centered
            if (isSplitView) {
              globeGroup.position.x = 0;
            }
          }

          lastWidth = width;
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', () => setTimeout(onResize, 100));

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

        // Show "ready" briefly then fade out loading overlay
        updateLoadingPhase('ready');
        setTimeout(() => {
          setLoadingState(prev => ({ ...prev, isLoading: false }));
          // After fade animation completes (500ms), hide from DOM entirely
          setTimeout(() => {
            setLoadingState(prev => ({ ...prev, hidden: true }));
          }, 600);
        }, 500);

      } catch (err) {
        console.error('Globe init error:', err);
        setLoadingState(prev => ({
          ...prev,
          text: 'Error: ' + err.message,
          progress: 0
        }));
      }
    };

    loadGlobe();

    return () => {
      styleEl.remove();
      fontLink.remove();
    };
  }, [navigate]);


  return (
    <div className="globe-page">
      <div id="background-cover" />

      {/* Full-Screen Loading Overlay with Neon Bloom */}
      {!loadingState.hidden && (
        <div className={`loading-overlay ${!loadingState.isLoading ? 'fade-out' : ''}`}>
          {/* Perspective grid floor */}
          <div className="loading-grid" />

          <div className="pda-loading">
            <div className="header">[ SYNTHCITY DIGILABS ]</div>

            {/* Multi-ring spinner with glowing core */}
            <div className="spinner-container">
              <div className="spinner-outer" />
              <div className="spinner" />
              <div className="spinner-core" />
            </div>

            <div className="status">{loadingState.text}</div>

            <div className="progress-wrapper">
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${loadingState.progress}%` }} />
              </div>
              <div className="progress-text">{loadingState.progress}%</div>
            </div>

            <div className="footer">{'// INITIALIZING //'}</div>
          </div>
        </div>
      )}

      <div ref={containerRef} id="globe-container" />
      {isMobileDevice && <GlobeMobileMenu onNavigate={handleNavigate} />}
    </div>
  );
}
