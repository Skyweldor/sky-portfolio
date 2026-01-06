/**
 * Interactive Globe - SynthCity Digilabs
 * Standalone Three.js visualization
 *
 * Configuration: Edit GLOBE_CONFIG below to customize service links
 */

// =============================================================================
// CONFIGURATION - Edit these values to customize the globe
// =============================================================================
const GLOBE_CONFIG = {
  // Top navigation buttons (Home, Skills, Projects)
  // Set to '#' or '' to disable links, or provide full URLs
  navigationLinks: {
    'Home': '/',
    'Skills': '/services',
    'Projects': '#projects'
  },

  // Service labels and their destination URLs
  // Set to '#' or '' to disable links, or provide full URLs
  serviceLinks: {
    'Game Development': '/services#game-dev',
    'Quantitative Finance': '/services#finance',
    'Tutoring': '/services#tutoring',
    'Make-Up/Skincare E-Commerce': '/services#skincare',
    'Stickers E-Commerce': '/services#stickers'
  },

  // Enable debug mode (shows debug panel)
  debug: false,

  // Rotation speeds
  rotation: {
    globeSpeed: -0.0003,
    textSpeed: 0.0006,
    textRotateOpposite: false,
    particleSpeed: -0.0002
  }
};

// =============================================================================
// DEBUG UTILITIES
// =============================================================================
const DEBUG = GLOBE_CONFIG.debug;

function updateDebug(key, value) {
  if (!DEBUG) return;
  const element = document.getElementById('debug-' + key);
  if (element) element.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ': ' + value;
}

function debugLog(message) {
  console.log(message);
  if (DEBUG) {
    updateDebug('status', message);
  }
}

function debugError(message, error) {
  console.error(message, error);
  if (DEBUG) {
    updateDebug('status', 'Error: ' + message);
    updateDebug('error', error);
    document.getElementById('debug-info').style.display = 'block';
  }
}

// =============================================================================
// MAIN INITIALIZATION
// =============================================================================
window.addEventListener('load', function() {
  window.scrollTo(0, document.getElementById('globe-container').offsetTop);
});

window.addEventListener('DOMContentLoaded', function() {
  debugLog('DOM loaded');

  // Check for Three.js
  if (typeof THREE === 'undefined') {
    debugError('Three.js not loaded', 'THREE is undefined');
    document.getElementById('loading-indicator').textContent = 'Error: 3D library not available';
    return;
  }

  updateDebug('threejs', 'LOADED (v' + THREE.REVISION + ')');

  // Get container
  const container = document.getElementById('globe-container');
  if (!container) {
    debugError('Container not found', 'globe-container element missing');
    return;
  }

  updateDebug('container', 'FOUND');

  try {
    // ==========================================================================
    // SCENE SETUP
    // ==========================================================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020924);

    // Device detection for performance optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = isMobile && Math.min(window.innerWidth, window.innerHeight) > 480;
    const isLowEndDevice = isMobile || (window.devicePixelRatio < 2 && window.innerWidth < 768);

    // Adjust quality based on device
    const segmentCount = isLowEndDevice ? 32 : 64;
    const useAntialias = !isLowEndDevice;
    const particleCount = isLowEndDevice ? 100 : 300;

    debugLog('Device: ' + (isMobile ? (isTablet ? 'Tablet' : 'Mobile') : 'Desktop') + ' (Low-end: ' + isLowEndDevice + ')');

    // ==========================================================================
    // CAMERA
    // ==========================================================================
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    if (isMobile && !isTablet) {
      camera.position.z = 15;
      camera.position.y = 2.0;
    } else if (isTablet) {
      camera.position.z = 12;
      camera.position.y = 1.0;
    } else {
      camera.position.z = 6;
      camera.position.y = 0.5;
    }
    camera.lookAt(0, 0, 0);

    // ==========================================================================
    // RENDERERS
    // ==========================================================================
    const renderer = new THREE.WebGLRenderer({
      antialias: useAntialias
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (!isLowEndDevice) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    container.appendChild(renderer.domElement);

    // CSS2D renderer for HTML labels
    const labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    debugLog('Renderers created');

    // ==========================================================================
    // LIGHTS
    // ==========================================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ddff, 0.8);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    const blueGlow = new THREE.PointLight(0x00ddff, 0.5);
    blueGlow.position.set(-5, -3, 5);
    scene.add(blueGlow);

    // ==========================================================================
    // FLOOR GRID
    // ==========================================================================
    const gridSize = 20;
    const gridDivisions = 20;
    const gridColorCenterLine = 0x00ddff;
    const gridColorGrid = 0x005588;

    const floorGridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColorCenterLine, gridColorGrid);
    if (isMobile) {
      floorGridHelper.position.y = -2.0;
    } else {
      floorGridHelper.position.y = -3.0;
    }
    scene.add(floorGridHelper);

    // ==========================================================================
    // GLOBE
    // ==========================================================================
    const globeGeometry = new THREE.SphereGeometry(2, segmentCount, segmentCount);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x000030,
      transparent: true,
      opacity: 0.8,
      emissive: 0x000010,
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeMesh);

    // Main group for all globe elements
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.add(globeMesh);

    // Initial rotation
    globeGroup.rotation.x = Math.PI * 0.06;
    globeGroup.rotation.y = Math.PI * 0.5;

    // Grid lines (latitude/longitude)
    const gridHelper = new THREE.Object3D();
    // Longitude lines
    for (let i = 0; i < 24; i++) {
      const longitude = new THREE.LineLoop(
        new THREE.CircleGeometry(2, 64),
        new THREE.LineBasicMaterial({ color: 0x00ddff, transparent: true, opacity: 0.1 })
      );
      longitude.rotation.y = Math.PI / 2;
      longitude.rotation.z = i * (Math.PI / 12);
      gridHelper.add(longitude);
    }
    // Latitude lines
    for (let i = -8; i <= 8; i += 2) {
      const radius = 2 * Math.cos(i * (Math.PI / 18));
      const latitude = new THREE.LineLoop(
        new THREE.CircleGeometry(radius, 64),
        new THREE.LineBasicMaterial({ color: 0x00ddff, transparent: true, opacity: 0.1 })
      );
      latitude.rotation.x = Math.PI / 2;
      latitude.position.y = 2 * Math.sin(i * (Math.PI / 18));
      gridHelper.add(latitude);
    }
    globeGroup.add(gridHelper);

    // Continents (wireframe overlay)
    const continentsGeometry = new THREE.SphereGeometry(2.01, segmentCount, segmentCount);
    const continentsMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ddff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const continentsMesh = new THREE.Mesh(continentsGeometry, continentsMaterial);
    globeGroup.add(continentsMesh);

    // Equatorial ring
    const ringGeometry = new THREE.RingGeometry(2.5, 2.6, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ddff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    globeGroup.add(ring);

    // Inner glow
    const glowGeometry = new THREE.SphereGeometry(1.9, segmentCount, segmentCount);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ddff,
      transparent: true,
      opacity: 0.03
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    globeGroup.add(glowMesh);

    // Group for equatorial text
    const equatorTextGroup = new THREE.Group();
    scene.add(equatorTextGroup);

    // Service label group
    const serviceLabelGroup = new THREE.Group();
    scene.add(serviceLabelGroup);

    // Rotation configuration from GLOBE_CONFIG
    const rotationConfig = GLOBE_CONFIG.rotation;

    // ==========================================================================
    // NAVIGATION LINKS (Home, Skills, Projects)
    // ==========================================================================
    function createNavigationLinks() {
      // Get navigation items from config
      const navItems = Object.entries(GLOBE_CONFIG.navigationLinks).map(([text, url]) => ({
        text: text,
        url: url
      }));

      // Create a container for the top navigation (horizontal layout)
      const topNavContainer = new THREE.Object3D();
      topNavContainer.position.set(0, 2.5, 0);  // Raised higher to avoid obstructing globe
      scene.add(topNavContainer);

      // Create horizontal layout for nav items
      const horizontalSpacing = 3.0;
      navItems.forEach((item, index) => {
        try {
          const navAnchor = new THREE.Object3D();

          // Position horizontally (center the middle item)
          const xOffset = (index - (navItems.length - 1) / 2) * horizontalSpacing;
          navAnchor.position.set(xOffset, 0, 0);
          topNavContainer.add(navAnchor);

          // Create HTML element for the label
          const navDiv = document.createElement('div');
          navDiv.className = 'css2d-label';
          navDiv.textContent = item.text;
          navDiv.style.color = '#00ddff';
          navDiv.style.fontSize = '18px';
          navDiv.style.fontWeight = 'bold';
          navDiv.style.padding = '4px 20px';
          navDiv.style.background = 'rgba(0, 10, 30, 0.7)';
          navDiv.style.borderRadius = '4px';
          navDiv.style.border = '1px solid rgba(0, 221, 255, 0.3)';
          navDiv.style.pointerEvents = 'auto';
          navDiv.style.cursor = 'pointer';
          navDiv.style.textShadow = '0 0 10px rgba(0, 221, 255, 0.9)';
          navDiv.style.transition = 'all 0.2s ease';

          // Hover effects
          navDiv.addEventListener('mouseenter', () => {
            navDiv.style.background = 'rgba(0, 30, 60, 0.9)';
            navDiv.style.textShadow = '0 0 15px rgba(0, 221, 255, 1)';
            navDiv.style.transform = 'scale(1.1)';
          });

          navDiv.addEventListener('mouseleave', () => {
            navDiv.style.background = 'rgba(0, 10, 30, 0.7)';
            navDiv.style.textShadow = '0 0 10px rgba(0, 221, 255, 0.9)';
            navDiv.style.transform = 'scale(1)';
          });

          // Click navigation
          navDiv.addEventListener('click', () => {
            if (item.url && item.url !== '#' && item.url !== '') {
              document.body.classList.add('page-exit');
              setTimeout(function() {
                window.location = item.url;
              }, 500);
            }
          });

          // Create CSS2D object from HTML element
          const navLabel = new THREE.CSS2DObject(navDiv);
          navAnchor.add(navLabel);

        } catch (navError) {
          debugError("Error creating navigation link: " + item.text, navError);
        }
      });
    }

    createNavigationLinks();

    // ==========================================================================
    // EQUATORIAL TEXT (3D)
    // ==========================================================================
    if (typeof THREE.FontLoader !== 'undefined') {
      const fontLoader = new THREE.FontLoader();
      fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        debugLog("Font loaded successfully");

        const equatorText = "[ SYNTHCITY DIGILABS[]SYNTHCITY DIGILABS ]";
        const equatorRadius = 2.80;

        try {
          const textGeom = new THREE.TextGeometry(equatorText, {
            font: font,
            size: 0.5,
            height: 0.25,
            curveSegments: 8,
            bevelEnabled: true,
            bevelThickness: 0.08,
            bevelSize: 0.05,
            bevelSegments: 5
          });

          textGeom.computeBoundingBox();
          const bbox = textGeom.boundingBox;
          const textWidth = bbox.max.x - bbox.min.x;

          const arcAngle = Math.PI * 2.055;
          const radius = equatorRadius;

          const scaleMatrix = new THREE.Matrix4().makeScale(1, 1, -1);
          textGeom.applyMatrix4(scaleMatrix);

          const positionAttribute = textGeom.getAttribute('position');
          const vertex = new THREE.Vector3();

          for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            const alpha = 1 - ((vertex.x - bbox.min.x) / textWidth);
            const angle = -arcAngle / 2 + alpha * arcAngle;
            const newX = radius * Math.cos(angle);
            const newZ = radius * Math.sin(angle);
            positionAttribute.setXYZ(i, newX, vertex.y, newZ);
          }

          textGeom.computeVertexNormals();

          const wireframeGeom = textGeom.clone();

          const fillMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ddff,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            depthWrite: false,
            depthTest: true
          });

          const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ddff,
            wireframe: true,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide,
            depthWrite: false,
            depthTest: true
          });

          const textMesh = new THREE.Mesh(textGeom, fillMaterial);
          equatorTextGroup.add(textMesh);

          const wireframeMesh = new THREE.Mesh(wireframeGeom, wireframeMaterial);
          wireframeMesh.position.copy(textMesh.position);
          equatorTextGroup.add(wireframeMesh);

          equatorTextGroup.position.copy(globeGroup.position);
          equatorTextGroup.rotation.x = globeGroup.rotation.x;
          equatorTextGroup.rotation.y = globeGroup.rotation.y;
          equatorTextGroup.rotation.y += Math.PI * -0.1;
        } catch (textError) {
          debugError("Error creating equatorial text", textError);
        }

        // ==========================================================================
        // SERVICE LABELS
        // ==========================================================================
        const serviceLabels = [
          { text: "Game Development", position: "left" },
          { text: "Quantitative Finance", position: "left" },
          { text: "Tutoring", position: "left" },
          { text: "Make-Up/Skincare E-Commerce", position: "right" },
          { text: "Stickers E-Commerce", position: "right" }
        ];

        // Left container - raised higher to avoid obstructing globe
        const leftServiceContainer = new THREE.Object3D();
        if (isMobile) {
          leftServiceContainer.position.set(-3.0, -1.5, 0);
        } else {
          leftServiceContainer.position.set(-5.5, 0, 0);
        }
        scene.add(leftServiceContainer);

        // Right container - raised higher to avoid obstructing globe
        const rightServiceContainer = new THREE.Object3D();
        if (isMobile) {
          rightServiceContainer.position.set(3.0, -1.5, 0);
        } else {
          rightServiceContainer.position.set(5.5, 0, 0);
        }
        scene.add(rightServiceContainer);

        const verticalServiceSpacing = 1.2;

        const leftServices = serviceLabels.filter(label => label.position === "left");
        const rightServices = serviceLabels.filter(label => label.position === "right");

        // Create label helper function
        function createServiceLabel(label, index, container) {
          try {
            const labelAnchor = new THREE.Object3D();
            const yOffset = verticalServiceSpacing * (1 - index);
            labelAnchor.position.set(0, yOffset, 0);
            container.add(labelAnchor);

            const labelDiv = document.createElement('div');
            labelDiv.className = 'css2d-label';
            labelDiv.textContent = label.text;
            labelDiv.style.color = '#00ddff';
            labelDiv.style.fontSize = '16px';
            labelDiv.style.fontWeight = 'bold';
            labelDiv.style.padding = '4px 12px';
            labelDiv.style.background = 'rgba(0, 10, 30, 0.7)';
            labelDiv.style.borderRadius = '4px';
            labelDiv.style.border = '1px solid rgba(0, 221, 255, 0.3)';
            labelDiv.style.pointerEvents = 'auto';
            labelDiv.style.cursor = 'pointer';
            labelDiv.style.textShadow = '0 0 8px rgba(0, 221, 255, 0.7)';
            labelDiv.style.transition = 'all 0.2s ease';

            // Get URL from config
            const serviceURL = GLOBE_CONFIG.serviceLinks[label.text] || '#';
            labelDiv.setAttribute('data-url', serviceURL);

            // Hover effects
            labelDiv.addEventListener('mouseenter', () => {
              labelDiv.style.background = 'rgba(0, 30, 60, 0.85)';
              labelDiv.style.textShadow = '0 0 12px rgba(0, 221, 255, 1)';
              labelDiv.style.transform = 'scale(1.1)';
            });

            labelDiv.addEventListener('mouseleave', () => {
              labelDiv.style.background = 'rgba(0, 10, 30, 0.7)';
              labelDiv.style.textShadow = '0 0 8px rgba(0, 221, 255, 0.7)';
              labelDiv.style.transform = 'scale(1)';
            });

            // Click handler
            labelDiv.addEventListener('click', () => {
              const url = labelDiv.getAttribute('data-url');
              if (url && url !== '#' && url !== '') {
                document.body.classList.add('page-exit');
                setTimeout(function() {
                  window.location = url;
                }, 500);
              }
            });

            const labelObject = new THREE.CSS2DObject(labelDiv);
            labelAnchor.add(labelObject);

          } catch (labelError) {
            debugError("Error creating service label: " + label.text, labelError);
          }
        }

        // Create left labels
        leftServices.forEach((label, index) => {
          createServiceLabel(label, index, leftServiceContainer);
        });

        // Create right labels
        rightServices.forEach((label, index) => {
          createServiceLabel(label, index, rightServiceContainer);
        });

        // Hide any original HTML service labels
        document.querySelectorAll('.service-label').forEach(label => {
          label.style.display = 'none';
        });

        debugLog("3D text creation complete");
      }, undefined, function(error) {
        debugError("Font loading error", error);
      });
    } else {
      debugError("FontLoader not available", "THREE.FontLoader is undefined");
    }

    // ==========================================================================
    // PARTICLES
    // ==========================================================================
    const particlesGeometry = new THREE.BufferGeometry();
    const mobileParticleMultiplier = isMobile ? 1.5 : 1.0;
    const adjustedParticleCount = Math.floor(particleCount * mobileParticleMultiplier);
    const posArray = new Float32Array(adjustedParticleCount * 3);
    const scaleArray = new Float32Array(adjustedParticleCount);
    const pulseSpeedArray = new Float32Array(adjustedParticleCount);

    for (let i = 0; i < adjustedParticleCount * 3; i += 3) {
      let radius, phi;

      if (isMobile && i % 6 === 0) {
        radius = 2 + (Math.random() * 7);
        phi = Math.acos((Math.random() * 2) - 1) * 0.8;
      } else {
        radius = 2 + (Math.random() * 3.25);
        phi = Math.acos((Math.random() * 2) - 1);
      }

      const theta = Math.random() * Math.PI * 2;

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.cos(phi);
      posArray[i + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const index = i / 3;
      scaleArray[index] = 0.5 + Math.random() * 1.5;
      pulseSpeedArray[index] = 0.3 + Math.random() * 1.7;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    particlesGeometry.setAttribute('pulseSpeed', new THREE.BufferAttribute(pulseSpeedArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00ddff,
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // ==========================================================================
    // MOUSE/TOUCH INTERACTION
    // ==========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', function(event) {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });

    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationSpeedX = 0;
    let rotationSpeedY = 0;
    let autoRotate = true;

    // Mouse events
    container.addEventListener('mousedown', function(event) {
      isDragging = true;
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
      autoRotate = false;
      container.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(event) {
      if (isDragging) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;

        rotationSpeedX = deltaY * 0.0005;
        rotationSpeedY = deltaX * 0.0005;

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
      }

      targetX = mouseX * 20;
      targetY = -mouseY * 20;
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';

        setTimeout(function() {
          autoRotate = true;
        }, 3000);
      }
    });

    // Touch events
    container.addEventListener('touchstart', function(event) {
      if (event.touches.length === 1) {
        isDragging = true;
        previousMouseX = event.touches[0].clientX;
        previousMouseY = event.touches[0].clientY;
        autoRotate = false;
        event.preventDefault();
      }
    });

    container.addEventListener('touchmove', function(event) {
      if (isDragging && event.touches.length === 1) {
        const deltaX = event.touches[0].clientX - previousMouseX;
        const deltaY = event.touches[0].clientY - previousMouseY;

        const touchSensitivity = isMobile ? 1.5 : 1.0;
        rotationSpeedX = deltaY * 0.0005 * touchSensitivity;
        rotationSpeedY = deltaX * 0.0005 * touchSensitivity;

        previousMouseX = event.touches[0].clientX;
        previousMouseY = event.touches[0].clientY;

        event.preventDefault();
      }
    });

    container.addEventListener('touchend', function(event) {
      if (isDragging) {
        isDragging = false;
        setTimeout(function() {
          autoRotate = true;
        }, 3000);
      }
    });

    container.addEventListener('mouseenter', function() {
      container.style.cursor = 'grab';
    });

    // ==========================================================================
    // RESIZE HANDLER
    // ==========================================================================
    window.addEventListener('resize', function() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const isPortrait = height > width;
      if (width < 480) {
        camera.position.z = isPortrait ? 18 : 15;
        camera.position.y = isPortrait ? 3.0 : 2.0;
      } else if (width < 1024) {
        camera.position.z = isPortrait ? 14 : 12;
        camera.position.y = isPortrait ? 1.5 : 1.0;
      } else {
        camera.position.z = 6;
        camera.position.y = 0.5;
      }

      renderer.setSize(width, height);
      labelRenderer.setSize(width, height);

      composer.setSize(width, height);
      bloomPass.resolution.set(width, height);
    });

    // ==========================================================================
    // BLOOM EFFECT
    // ==========================================================================
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(1);

    const bloomParams = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0.2,
      bloomRadius: 0.5
    };

    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = bloomParams.exposure;

    const renderScene = new THREE.RenderPass(scene, camera);

    const bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomParams.bloomStrength,
      bloomParams.bloomRadius,
      bloomParams.bloomThreshold
    );

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    function enableBloom(obj, strength = 1) {
      if (!obj) return;
      obj.layers.enable(1);

      if (typeof obj.userData !== 'object') obj.userData = {};
      obj.userData.bloomIntensity = strength;

      if (obj.children && obj.children.length > 0) {
        obj.children.forEach(child => enableBloom(child, strength));
      }
    }

    enableBloom(floorGridHelper, 0.7);
    enableBloom(continentsMesh, 1.5);
    enableBloom(ring, 1.5);
    enableBloom(particlesMesh, 1.4);

    if (equatorTextGroup && equatorTextGroup.children) {
      equatorTextGroup.children.forEach(child => {
        if (child.type === 'Mesh' && child.material.wireframe) {
          enableBloom(child, 1.8);
        }
      });
    }

    // ==========================================================================
    // ANIMATION LOOP
    // ==========================================================================
    let time = 0;

    function animate() {
      requestAnimationFrame(animate);

      time += 0.01;

      // Particle twinkling
      if (particlesGeometry.attributes.scale) {
        const scaleAttr = particlesGeometry.attributes.scale;
        const pulseSpeedAttr = particlesGeometry.attributes.pulseSpeed;

        for (let i = 0; i < adjustedParticleCount; i++) {
          const pulseFactor = Math.sin(time * pulseSpeedAttr.array[i]) * 0.5 + 0.5;
          scaleAttr.array[i] = 0.5 + pulseFactor * 1.5;
        }

        scaleAttr.needsUpdate = true;
      }

      // Rotation
      if (autoRotate) {
        globeGroup.rotation.y -= rotationConfig.globeSpeed;

        if (rotationConfig.textRotateOpposite) {
          equatorTextGroup.rotation.y += rotationConfig.textSpeed;
        } else {
          equatorTextGroup.rotation.y -= rotationConfig.textSpeed;
        }

        particlesMesh.rotation.y += rotationConfig.particleSpeed;
      } else {
        globeGroup.rotation.x += rotationSpeedX;
        globeGroup.rotation.y += rotationSpeedY;

        equatorTextGroup.rotation.x = globeGroup.rotation.x;
        equatorTextGroup.rotation.y = globeGroup.rotation.y;

        particlesMesh.rotation.x = globeGroup.rotation.x;
        particlesMesh.rotation.y = globeGroup.rotation.y;

        if (!isDragging) {
          rotationSpeedX *= 0.95;
          rotationSpeedY *= 0.95;

          if (Math.abs(rotationSpeedX) < 0.0001 && Math.abs(rotationSpeedY) < 0.0001) {
            rotationSpeedX = 0;
            rotationSpeedY = 0;
          }
        }
      }

      composer.render();
      labelRenderer.render(scene, camera);
    }

    animate();

    debugLog('Animation started');

    // Hide loading indicator
    document.getElementById('loading-indicator').style.display = 'none';

    // Trigger initial resize to ensure camera matches current viewport
    window.dispatchEvent(new Event('resize'));

    // Add smooth page transitions for links
    document.querySelectorAll('a').forEach(link => {
      // Only for internal links, not external
      if (link.hostname === window.location.hostname) {
        link.addEventListener('click', function(e) {
          e.preventDefault(); // Prevent default navigation

          // Get the target URL
          const targetUrl = this.href;

          // Add exit animation class
          document.body.classList.add('page-exit');

          // Wait for animation to finish then navigate
          setTimeout(function() {
            window.location = targetUrl;
          }, 500); // Match this with the CSS animation duration
        });
      }
    });

  } catch (error) {
    debugError('Rendering error', error.message);
    document.getElementById('loading-indicator').textContent = 'Error: ' + error.message;
  }
});
