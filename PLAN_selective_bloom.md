# Implementation Plan: Selective Bloom for Globe Landing

## Goal
Add selective bloom layers to the globe scene so different elements glow with different intensities, matching the original "magical" aesthetic.

---

## Current State
- Bloom is applied uniformly to all objects via `UnrealBloomPass`
- Current bloom params: strength=0.5, radius=1, threshold=0.15, exposure=0.85
- All objects receive the same bloom treatment

## Target State
- Different objects glow at different intensities
- Text wireframe glows brightest (most prominent)
- Particles have strong glow
- Globe wireframe has medium glow
- Floor grid has subtle glow

---

## Implementation Steps

### Step 1: Store References to Scene Objects
Currently objects are created but not all are stored in variables we can reference later.

**Changes needed in GlobeLanding.jsx:**
- Store `floorGrid` reference (already have it)
- Store `wireframe` reference (already have it)
- Store `particles` reference (already have it)
- Store `wireMesh` (text wireframe) reference - need to extract from font loader callback

### Step 2: Add Bloom Layer Helper Function
Add the `enableBloom()` function that sets objects to bloom layer and stores intensity.

```javascript
// Add after scene creation
const bloomLayer = new THREE.Layers();
bloomLayer.set(1);

const enableBloom = (obj, strength = 1) => {
  if (!obj) return;
  obj.layers.enable(1);
  obj.userData = obj.userData || {};
  obj.userData.bloomIntensity = strength;
  if (obj.children) {
    obj.children.forEach(child => enableBloom(child, strength));
  }
};
```

### Step 3: Apply Selective Bloom to Objects
After all objects are created, enable bloom with appropriate intensities:

| Object | Bloom Intensity | Visual Effect |
|--------|-----------------|---------------|
| `floorGrid` | 0.7 | Subtle glow on floor |
| `wireframe` (globe) | 1.5 | Medium glow on globe surface |
| `ring` | 1.5 | Medium glow (invisible anyway) |
| `particles` | 1.4 | Strong particle twinkle |
| `wireMesh` (text) | 1.8 | Brightest - text pops |

### Step 4: Restore Original Bloom Parameters
Change bloom pass parameters back to original values:

```javascript
renderer.toneMappingExposure = 1.0;  // was 0.85

new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,   // bloomStrength (was 0.5)
  0.5,   // bloomRadius (was 1)
  0.2    // bloomThreshold (was 0.15)
);
```

### Step 5: Handle Text Mesh Reference
The text wireframe is created inside the font loader callback. Need to either:
- Option A: Store reference in outer scope variable, apply bloom after creation
- Option B: Apply bloom immediately inside the callback after `wireMesh` is created

**Recommended: Option B** - Apply `enableBloom(wireMesh, 1.8)` right after creating wireMesh.

---

## Code Changes Summary

### Location: `src/pages/GlobeLanding.jsx`

1. **After scene creation (~line 187):** Add bloom layer and helper function

2. **After floor grid creation (~line 227):**
   ```javascript
   enableBloom(floorGrid, 0.7);
   ```

3. **After wireframe creation (~line 268):**
   ```javascript
   enableBloom(wireframe, 1.5);
   ```

4. **After ring creation (~line 276):**
   ```javascript
   enableBloom(ring, 1.5);
   ```

5. **After particles creation (~line 435):**
   ```javascript
   enableBloom(particles, 1.4);
   ```

6. **Inside font loader callback, after wireMesh creation (~line 404):**
   ```javascript
   enableBloom(wireMesh, 1.8);
   ```

7. **Update bloom pass parameters (~line 443-448):**
   - exposure: 0.85 → 1.0
   - strength: 0.5 → 1.5
   - radius: 1 → 0.5
   - threshold: 0.15 → 0.2

---

## Testing Checklist
- [ ] Floor grid has subtle glow
- [ ] Globe wireframe has medium glow
- [ ] Particles twinkle with strong glow
- [ ] Equator text is brightest element
- [ ] Overall scene matches original aesthetic
- [ ] No performance regression on mobile

---

## Rollback Plan
If the selective bloom doesn't achieve desired effect or causes issues:
1. Remove `enableBloom` calls
2. Remove bloom layer setup
3. Keep current uniform bloom parameters

---

## Time Estimate
- Implementation: ~15-20 minutes
- Testing/tuning: ~10 minutes
