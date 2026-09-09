import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobeMobileMenu from '../components/common/GlobeMobileMenu';
import { useTransition } from '../context/TransitionContext';
import { SUBSITE_NAV } from '../data/subsiteNavConfig';
import { ROUTES } from '../config/routes';
import './GlobeLanding.css';

/**
 * Globe Landing Page - Using dynamic imports for Three.js modules
 */

// Outer radius of the composition in world units: the globe (2.0), the text ring
// riding at 2.80, and the glyph depth on top of it. Everything that has to stay
// on-screen lives inside this sphere, so it is what the camera framing solves for.
const CONTENT_RADIUS = 3.1;

// The desktop framing. The responsive solve only ever pulls FURTHER back than this,
// so any window wide enough looks exactly as designed.
const BASE_CAMERA_Z = 6;

// Inset from the viewport edge to a label column's outer edge. Proportional to the
// width so the breathing room reads the same at any size, clamped so it neither
// collapses on a narrow window nor drifts absurdly wide on an ultrawide one.
const labelEdgePad = (viewportWidth) => Math.min(112, Math.max(28, viewportWidth * 0.062));

// CSS px between a label column's inner edge and the globe silhouette.
const LABEL_GLOBE_CLEARANCE = 16;

// Narrowest column we will still render labels into. Checked against the room the
// column actually gets, not against a viewport width -- so browser zoom, which
// shrinks the viewport in CSS px without changing the composition at all, cannot
// trip it.
const MIN_LABEL_GUTTER = 150;


// Updated configuration for our routes
const GLOBE_CONFIG = {
  // `status: 'active'` is the only state that navigates. Everything else renders
  // desaturated and inert — the route stays registered so direct URLs still work
  // for QA, we're only gating the globe's discovery path.
  serviceLinks: {
    'Game Development':            { href: ROUTES.interactive, status: 'active' },
    'Quantitative Finance':        { href: '#',          status: 'coming-soon' },
    'Tutoring':                    { href: '#',          status: 'coming-soon' },
    'Make-Up/Skincare E-Commerce': { href: ROUTES.makeup,      status: 'coming-soon' },
    'Stickers E-Commerce':         { href: ROUTES.stickers,    status: 'coming-soon' }
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
  const navigateRef = useRef(navigate);

  // Touch devices always get the menu. Desktop gets it too once the label columns
  // run out of room — otherwise a narrowed desktop browser has no navigation at all.
  // `labelsFit` is reported by the scene's layout solve (applyResponsiveLayout),
  // which measures the gutter instead of guessing from a width breakpoint.
  const [isTouchDevice] = useState(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });
  const [labelsFit, setLabelsFit] = useState(true);
  const showMobileMenu = isTouchDevice || !labelsFit;

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
  const handleNavigate = useCallback((url, navState) => {
    if (!url || url === '#') return;

    // Show global transition overlay
    startTransitionRef.current('Navigating...');

    // Navigate after brief delay for transition to appear
    setTimeout(() => {
      navigate(url, navState ? { state: navState } : undefined);
    }, 600);
  }, [navigate]);

  // Keep refs updated so the effect can reach the latest values without
  // listing them as dependencies and tearing the globe down on every change.
  startTransitionRef.current = startTransition;
  navigateRef.current = navigate;

  useEffect(() => {
    // Loading phases defined inside useEffect to avoid dependency warning
    const LOADING_PHASES = {
      init: { progress: 0, text: 'Connecting...' },
      modules: { progress: 15, text: 'Connecting...' },
      scene: { progress: 30, text: 'Connecting...' },
      globe: { progress: 45, text: 'Connecting...' },
      labels: { progress: 60, text: 'Connecting...' },
      font: { progress: 75, text: 'Connecting...' },
      particles: { progress: 85, text: 'Connecting...' },
      bloom: { progress: 95, text: 'Connecting...' },
      ready: { progress: 100, text: 'Ready' }
    };

    const updateLoadingPhase = (phase) => {
      const phaseData = LOADING_PHASES[phase];
      if (!phaseData) return;

      // For the final phase, advance the bar first and delay the text swap
      // until the stepped fill animation finishes (~0.55s), so "Ready" only
      // appears once the bar actually reaches its apex.
      if (phase === 'ready') {
        setLoadingState(prev => ({ ...prev, phase, progress: phaseData.progress }));
        setTimeout(() => {
          setLoadingState(prev => ({ ...prev, text: phaseData.text }));
        }, 600);
        return;
      }

      setLoadingState(prev => ({
        ...prev,
        phase,
        progress: phaseData.progress,
        text: phaseData.text
      }));
    };

    // Load IBM Plex Mono + VT323 (retro terminal font for loader status)
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=VT323&display=swap';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = globeStyles;
    document.head.appendChild(styleEl);

    // Custom navigation handler that uses React Router with transition overlay
    const handleNavigation = (url, navState) => {
      if (!url || url === '#') return;

      // Use the global transition context
      if (startTransitionRef.current) {
        startTransitionRef.current('Navigating...');
      }

      // Navigate after transition appears
      setTimeout(() => {
        navigateRef.current(url, navState ? { state: navState } : undefined);
      }, 600);
    };

    // Three.js resources are built asynchronously inside loadGlobe, so the
    // cleanup below can't close over them directly — it reads them from here
    // once they exist. `cancelled` aborts init that is still in flight.
    let cancelled = false;
    const resources = {
      frameId: null,
      renderer: null,
      labelRenderer: null,
      scene: null,
      darkMaterial: null,
      composers: [],
      onResize: null,
      onOrientationChange: null
    };

    // Idempotent — unmount can land either side of init finishing, so this
    // runs from both the effect cleanup and the tail of loadGlobe.
    const teardown = () => {
      // Drag handlers were assigned as document properties, so they outlive
      // this component unless explicitly cleared.
      document.onmousemove = null;
      document.onmouseup = null;

      if (resources.frameId !== null) {
        cancelAnimationFrame(resources.frameId);
        resources.frameId = null;
      }
      if (resources.onResize) {
        window.removeEventListener('resize', resources.onResize);
        resources.onResize = null;
      }
      if (resources.onOrientationChange) {
        window.removeEventListener('orientationchange', resources.onOrientationChange);
        resources.onOrientationChange = null;
      }

      // composer.dispose() only drops its own render targets, so dispose each
      // pass too — UnrealBloomPass allocates several of its own.
      resources.composers.forEach((composer) => {
        composer.passes.forEach((pass) => pass.dispose?.());
        composer.dispose();
      });
      resources.composers = [];

      // Release every GPU buffer the scene graph owns.
      resources.scene?.traverse((obj) => {
        obj.geometry?.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m?.dispose());
      });
      resources.scene = null;

      // Swapped in during selective bloom, so it never appears in the graph.
      resources.darkMaterial?.dispose();
      resources.darkMaterial = null;

      resources.labelRenderer?.domElement.remove();
      resources.labelRenderer = null;

      // Browsers cap simultaneous WebGL contexts (~8-16). dispose() alone
      // leaves the context alive until GC decides to collect it, so force the
      // loss to hand it back immediately.
      if (resources.renderer) {
        resources.renderer.dispose();
        resources.renderer.forceContextLoss();
        resources.renderer.domElement.remove();
        resources.renderer = null;
      }
    };

    // Tracks the currently-open dropdown so opening another or clicking
    // outside closes the previous one.
    let openLabelEl = null;
    const closeOpenDropdown = () => {
      if (openLabelEl) {
        openLabelEl.classList.remove('open');
        openLabelEl = null;
      }
    };
    const onDocClickCloseDropdown = (e) => {
      if (!openLabelEl) return;
      if (!openLabelEl.contains(e.target)) closeOpenDropdown();
    };
    document.addEventListener('mousedown', onDocClickCloseDropdown);

    const loadGlobe = async () => {
      try {
        // Returning from a subsite hits a warm module cache, so every phase
        // below would resolve before the browser ever paints. The progress
        // fill would then get its first computed style at the final scaleX,
        // and a CSS transition with no prior value simply doesn't run — the
        // bar appears already full. Yield two frames so a 0% frame is painted
        // first and the fill has something to animate from.
        //
        // Raced against a timer because a background tab never fires rAF at all:
        // middle-clicking a link here used to park init on this line forever, and
        // since 'Initializing Systems...' is the only text updateLoadingPhase never
        // sets, the tab sat on it until it was focused. In a visible tab rAF still
        // wins (~32ms), so the paint-a-0%-frame behaviour above is unchanged.
        await new Promise(resolve => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            resolve();
          };
          requestAnimationFrame(() => requestAnimationFrame(finish));
          setTimeout(finish, 100);
        });
        if (cancelled) return;

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

        if (cancelled) return;

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
        resources.scene = scene;

        // Bloom layer for selective bloom
        const BLOOM_LAYER = 1;
        const bloomLayer = new THREE.Layers();
        bloomLayer.set(BLOOM_LAYER);

        // Materials cache for selective bloom
        const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        resources.darkMaterial = darkMaterial;
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
        resources.renderer = renderer;

        // CSS2D Renderer
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.left = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(labelRenderer.domElement);
        resources.labelRenderer = labelRenderer;

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

        // Camera framing, label anchors and label width are one solve: all three fall
        // out of how many pixels a world unit is worth at the current camera distance.
        //
        // Two things this deliberately does not do. It never dollies on a width
        // breakpoint — `z = width <= 1024 ? 12 : 6` doubled the camera distance across
        // a single pixel of width, which is what made browser zoom feel like it snapped
        // (aspect ratio is invariant under zoom, so nothing else moved until that line
        // fired). And it never decides label visibility from a viewport width — it
        // measures the gutter the labels actually get.
        let leftContainer = null;
        let rightContainer = null;
        // { node, worldY, side } per label row, so the layout solve can place each
        // one against its own depth (see xForRow).
        const labelAnchors = [];

        const applyResponsiveLayout = () => {
          const halfFovTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

          // A perspective FOV is vertical, so vertical framing is aspect-independent
          // and only a narrow window can ever clip the composition. Solve for the
          // distance that fits CONTENT_RADIUS across the half-frustum WIDTH, and take
          // whichever of that and the design distance is further back. Continuous in
          // aspect: no step anywhere, and at desktop aspects the max() resolves to
          // BASE_CAMERA_Z, so the framing you tuned is untouched.
          if (!isMobile && !isTablet) {
            const fitZ = CONTENT_RADIUS / (halfFovTan * camera.aspect);
            camera.position.z = Math.max(BASE_CAMERA_Z, fitZ);
            camera.position.y = 0.5;
            camera.lookAt(0, 0, 0);
          }

          const halfFrustumH = halfFovTan * Math.abs(camera.position.z);
          const pxPerWorldUnit = window.innerHeight / (halfFrustumH * 2);
          const halfViewportPx = window.innerWidth / 2;

          // The band a column lives in: from the ring's silhouette out to the viewport
          // edge, less the padding at both ends.
          const globeEdgePx = CONTENT_RADIUS * pxPerWorldUnit;
          const edgePad = labelEdgePad(window.innerWidth);
          const gutterPx = halfViewportPx - globeEdgePx - edgePad - LABEL_GLOBE_CLEARANCE;
          const fits = gutterPx >= MIN_LABEL_GUTTER;

          // Published to the CSS so labels cap themselves at the room they have —
          // clipping becomes impossible by construction, not by a tuned constant.
          container.style.setProperty('--globe-label-gutter', `${Math.max(0, Math.round(gutterPx))}px`);
          container.classList.toggle('globe-labels-hidden', !fits);
          setLabelsFit(fits);

          // Put each column's OUTER edge `edgePad` px in from the viewport edge. The
          // labels are edge-aligned against their anchor (see .css2d-label-inner), so
          // this pins the column rather than its centre and nothing can overhang.
          //
          // Solved per row, not once per column: the camera sits above the origin and
          // looks down at it, so rows at different world y are at different depths —
          // a ~3% spread, which splays a column by ~25px at desktop width. x must be
          // proportional to depth to project to a constant ndc.x.
          if (labelAnchors.length) {
            const targetNdcX = (halfViewportPx - edgePad) / halfViewportPx;
            const camY = camera.position.y;
            const camZ = camera.position.z;
            const viewLen = Math.hypot(camY, camZ) || 1;

            labelAnchors.forEach(({ node, worldY, side }) => {
              const depth = (camZ * camZ - camY * (worldY - camY)) / viewLen;
              const x = targetNdcX * halfFovTan * camera.aspect * depth;
              node.position.x = side === 'right' ? x : -x;
            });
          }
        };

        if (showFloatingLabels) {
          // Service label containers
          leftContainer = new THREE.Object3D();
          scene.add(leftContainer);

          rightContainer = new THREE.Object3D();
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
            labelAnchors.push({ node: anchor, worldY: anchor.position.y, side: item.side });

            const { href: url = '#', status = 'coming-soon' } = config.serviceLinks[item.text] || {};
            const disabled = status !== 'active';
            const subLinks = SUBSITE_NAV[item.text]?.links ?? [];
            const hasDropdown = !disabled && subLinks.length > 0;

            // CSS2DRenderer rewrites this element's `transform` every frame, so the
            // wrapper can only ever be a zero-size anchor point. All the layout — and
            // the transform we want to own and animate — lives on `inner`.
            // side-right flips both the column's edge alignment and the dropdown's
            // anchor, so the right-hand labels grow and open inward.
            const wrapper = document.createElement('div');
            wrapper.className = `css2d-label-wrapper${item.side === 'right' ? ' side-right' : ''}`;

            const inner = document.createElement('div');
            inner.className = 'css2d-label-inner';
            wrapper.appendChild(inner);

            const row = document.createElement('div');
            row.className = 'css2d-label-row';

            // Primary label pill — clicking navigates to the subsite root.
            const pill = document.createElement('div');
            pill.className = `css2d-label-pill${disabled ? ' disabled' : ''}`;

            const textEl = document.createElement('span');
            textEl.className = 'css2d-label-text';
            textEl.textContent = item.text;
            pill.appendChild(textEl);

            if (!disabled) {
              pill.addEventListener('click', (e) => {
                e.stopPropagation();
                closeOpenDropdown();
                handleNavigation(url);
              });
            }
            row.appendChild(pill);

            if (hasDropdown) {
              // Separate chevron button — its own pill so the click target is
              // unambiguous and visually distinct from the label.
              const chevronBtn = document.createElement('button');
              chevronBtn.type = 'button';
              chevronBtn.className = 'css2d-chevron-btn';
              chevronBtn.setAttribute('aria-label', 'Open sub-menu');

              const glyph = document.createElement('span');
              glyph.className = 'css2d-chevron-glyph';
              glyph.textContent = '\u25BE';
              chevronBtn.appendChild(glyph);

              chevronBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = wrapper.classList.contains('open');
                closeOpenDropdown();
                if (!isOpen) {
                  wrapper.classList.add('open');
                  openLabelEl = wrapper;
                }
              });
              row.appendChild(chevronBtn);

              const dropdown = document.createElement('div');
              dropdown.className = 'css2d-dropdown';

              const visit = document.createElement('span');
              visit.className = 'css2d-dropdown-link primary';
              visit.textContent = `Visit ${item.text} \u2192`;
              visit.addEventListener('click', (e) => {
                e.stopPropagation();
                closeOpenDropdown();
                handleNavigation(url);
              });
              dropdown.appendChild(visit);

              subLinks.forEach((link) => {
                const a = document.createElement('span');
                a.className = 'css2d-dropdown-link';
                a.textContent = link.label;
                a.addEventListener('click', (e) => {
                  e.stopPropagation();
                  closeOpenDropdown();
                  handleNavigation(link.url, link.scrollTo ? { scrollTo: link.scrollTo } : undefined);
                });
                dropdown.appendChild(a);
              });

              inner.appendChild(row);
              inner.appendChild(dropdown);
            } else {
              inner.appendChild(row);
            }

            anchor.add(new CSS2DObject(wrapper));
          };

          leftItems.forEach((item, i) => createLabel(item, i, leftContainer));
          rightItems.forEach((item, i) => createLabel(item, i, rightContainer));
        }

        // Frame the camera and pin the columns before the first render, so the
        // opening shot is already correct rather than snapping on the first resize.
        applyResponsiveLayout();

        // Load font and create 3D text.
        //
        // Served from our own origin, not hotlinked off threejs.org. The wordmark ring
        // is the brand element, and it failed SOFT — a fetch failure left a bare globe
        // with the loader still completing, so an outage would have shipped unnoticed.
        // Vendored copy + its license live in public/fonts/.
        updateLoadingPhase('font');
        const fontLoader = new FontLoader();
        const fontUrl = `${process.env.PUBLIC_URL || ''}/fonts/helvetiker_regular.typeface.json`;
        fontLoader.load(fontUrl, (font) => {
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
        }, undefined, (err) => {
          // Deliberately non-fatal — a missing wordmark should not cost the visitor
          // the whole landing page. But it is loud now, so a broken deploy shows up
          // in the console instead of silently serving a globe with no branding.
          console.error('Globe wordmark font failed to load:', fontUrl, err);
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
        resources.composers = [bloomComposer, finalComposer];

        // Interaction - only enable drag-to-rotate on desktop
        let isDragging = false, prevX = 0, prevY = 0, rotX = 0, rotY = 0, autoRotate = true;
        const enableDragRotation = !isMobile && !isTablet;

        if (enableDragRotation) {
          // The CSS2D labels live inside the container, so their mousedown
          // bubbles up here. Ignore it — pressing a label or its chevron must
          // not start a drag, which would halt auto-rotation.
          container.onmousedown = (e) => {
            if (e.target.closest?.('.css2d-label-wrapper')) return;
            isDragging = true; prevX = e.clientX; prevY = e.clientY; autoRotate = false;
          };
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

          // Camera distance, label anchors and the label width budget, all solved
          // continuously from the live frustum. No breakpoint, so no snap.
          applyResponsiveLayout();

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

        const onOrientationChange = () => setTimeout(onResize, 100);
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onOrientationChange);
        resources.onResize = onResize;
        resources.onOrientationChange = onOrientationChange;

        // Animation
        let time = 0;
        const animate = () => {
          if (cancelled) return;
          resources.frameId = requestAnimationFrame(animate);
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
            // Apply the drag delta to each group rather than snapping them to
            // the globe's absolute rotation — the text ring and particles spin
            // at their own speeds, so assigning would jump them back into sync.
            globeGroup.rotation.x += rotX;
            globeGroup.rotation.y += rotY;
            equatorTextGroup.rotation.x += rotX;
            equatorTextGroup.rotation.y += rotY;
            particles.rotation.x += rotX;
            particles.rotation.y += rotY;
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

        // Everything from the 'scene' checkpoint down is synchronous, so an
        // unmount during that stretch runs the cleanup before these resources
        // exist. Dispose them here rather than leaking them.
        if (cancelled) {
          teardown();
          return;
        }

        // Show "ready" briefly then fade out loading overlay.
        // Timing: bar fills ~550ms -> text swaps to "Ready" at 600ms ->
        // hold "Ready" for ~700ms -> start fade at 1300ms.
        updateLoadingPhase('ready');
        setTimeout(() => {
          setLoadingState(prev => ({ ...prev, isLoading: false }));
          setTimeout(() => {
            setLoadingState(prev => ({ ...prev, hidden: true }));
          }, 800);
        }, 800);

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
      cancelled = true;
      styleEl.remove();
      fontLink.remove();
      document.removeEventListener('mousedown', onDocClickCloseDropdown);
      teardown();
    };
  }, []);


  return (
    <div className="globe-page">
      <div id="background-cover" />

      {/* Full-Screen Loading Overlay with Neon Bloom */}
      {!loadingState.hidden && (
        <div className={`loading-overlay ${!loadingState.isLoading ? 'fade-out' : ''}`}>
          {/* Perspective grid floor */}
          <div className="loading-grid" />

          <div className="pda-loading">
            <div className="status">{loadingState.text}</div>

            <div className="progress-frame" role="progressbar" aria-valuenow={loadingState.progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-frame-inner">
                <div className="progress-fill" style={{ transform: `scaleX(${loadingState.progress / 100})` }} />
                <div className="progress-dividers" />
              </div>
            </div>
          </div>

          <div className="loading-corner-logo">[ SYNTHCITY DIGILABS ]</div>
        </div>
      )}

      <div ref={containerRef} id="globe-container" />
      {showMobileMenu && <GlobeMobileMenu onNavigate={handleNavigate} />}
    </div>
  );
}
