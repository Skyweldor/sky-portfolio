# 3D Gold Title — Implementation Plan

**Date:** March 29, 2026
**Scope:** Replace flat CSS shimmer "ELEVATE" text in the hero section with a real-time 3D PBR gold title, plus debug controls for tuning

---

## 1. Concept

The flat CSS `shimmer-text` gradient on "ELEVATE" looks like a sticker. Real gold reads as gold because of how it reflects light — bright specular highlights against a dark base. The prototype (`00_plans/makeup-ecommerce/dark-gold-3d.html`) proved this with Three.js: a dark brown base color (`#3d2200`) + metalness 1.0 + high `envMapIntensity` + one tight key light = only direct reflections survive as bright gold, everything else falls to deep brown.

**Principle:** Widen the dynamic range by lowering the floor, not raising the ceiling.

---

## 2. Architecture

### New files
- `src/components/beautyCare/GoldTitle.jsx` — React component wrapping raw Three.js
- `src/components/beautyCare/css/GoldTitle.css` — container + debug panel styles

### Integration point
- `HeroSection.jsx` — imports `GoldTitle`, renders it between the nav row and the glass cards as the visual centerpiece
- Nav `<h1>` downsized to 1.1rem since the 3D title is now the primary brand presence

### Dependencies (all pre-existing)
- `three@^0.160.1`
- `three/examples/jsm/loaders/FontLoader`
- `three/examples/jsm/geometries/TextGeometry`
- Font: `optimer_bold.typeface.json` from Three.js CDN

---

## 3. Technical Approach

### 3.1 Scene setup
- `WebGLRenderer` with `alpha: true` + explicit `setClearColor(0x000000, 0)` — transparent canvas composites over the hero background
- ACES filmic tone mapping at 0.9 exposure
- Camera: 38° FOV at z=6.5

### 3.2 Environment map (studio lighting)
- Built via `PMREMGenerator.fromScene()` with `compileEquirectangularShader()` called first
- Key light: small (2.5×2.5) warm white plane (`0xfff8e0`) — creates tight specular
- Rim light: 1.5×1.5 warm gold plane (`0xffe0a0`) — edge definition
- Fill light: large (8×8) near-black plane (`0x0a0800`) — barely visible, prevents total darkness
- Environment background: near-black (`0x010100`)

### 3.3 Material
- `MeshPhysicalMaterial` (not Standard — needed for clearcoat)
- Base color: `0x3d2200` (dark brown — the critical insight)
- Metalness: 1.0
- Roughness: 0.15
- envMapIntensity: 4.5
- Clearcoat: 0.5, clearcoatRoughness: 0.05
- Explicit `envMap` assignment as fallback in case `scene.environment` isn't picked up

### 3.4 Text geometry
- `TextGeometry` with `optimer_bold` serif font
- Size 0.75, depth 0.22 (extrusion)
- Bevel enabled for edge catches
- Centered via `computeBoundingBox()` + translate

### 3.5 Interaction
- Mouse-follow rotation with smooth lerp (0.04 factor)
- Horizontal range: ±0.3 rad, vertical: ±0.15 rad

### 3.6 Fallback
- If font CDN fails, renders a torus knot with the same gold material so the gold effect is still visible and debuggable

---

## 4. Debug Controls

Toggled with backtick (`` ` ``) key. Dark glass-morphism panel, bottom-right of the 3D canvas.

| Control | Options | What it changes |
|---------|---------|-----------------|
| Base | Near-black (`0x1a0e00`) / Dark brown (`0x3d2200`) / Medium (`0x5a3d10`) | Material base color — most impactful knob |
| Finish | Mirror (0.15) / Polished (0.3) / Satin (0.5) | Material roughness |
| Env | Dark studio / Medium / Bright | Rebuilds the env map + adjusts exposure and envMapIntensity |

Environment presets:

| Preset | Env BG | Key color | Fill color | Exposure | Intensity |
|--------|--------|-----------|------------|----------|-----------|
| Dark | `0x010100` | `0xfff8e0` | `0x0a0800` | 0.9 | 4.5 |
| Medium | `0x080604` | `0xfff5e0` | `0x1a1208` | 1.0 | 3.0 |
| Bright | `0x111111` | `0xfff5e0` | `0x2a2018` | 1.1 | 2.0 |

---

## 5. Known Issues & Fixes Applied

### 5.1 Black render on initial implementation
**Root cause (likely):** `PMREMGenerator.fromScene()` was called without `compileEquirectangularShader()` first. Without a valid env map, metalness 1.0 materials reflect nothing → pure black.

**Fixes applied:**
- Added `pmremGen.compileEquirectangularShader()` before env map generation
- Explicit `envMap` property on material (not relying solely on `scene.environment`)
- Upgraded to `MeshPhysicalMaterial` for clearcoat and better PBR fidelity
- Stronger directional lights (2.5 intensity primary + 1.0 secondary rim)
- Brighter ambient light
- Explicit `renderer.setClearColor(0x000000, 0)` for transparent alpha
- Guard on `THREE.SRGBColorSpace` for version compatibility
- Font load error callback with fallback geometry

### 5.2 Still to verify
- Confirm the gold renders correctly after the fixes above
- Tune text size / camera distance if "ELEVATE" doesn't fill the container well
- Test on mobile (WebGL performance, touch interaction)
- Consider `devicePixelRatio` capping for lower-end devices

---

## 6. Future Considerations

- **Custom font:** Convert Playfair Display or Cormorant Garamond to Three.js JSON format via facetype.js for exact brand match
- **Post-processing:** Selective bloom on the specular highlights (project already uses UnrealBloomPass in GlobeLanding)
- **Particle integration:** Have the bokeh particles interact with or flow around the 3D text
- **Loading state:** Show the CSS shimmer text as placeholder while Three.js + font loads, then crossfade
