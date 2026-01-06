# Implementation Plan: Dual Aesthetic Bloom System

## Overview

Keep **both** visual styles as intentional design choices:
- **Magical (Bright)**: Vibrant, high-glow aesthetic with 2x bloom intensity multiplier
- **Dark (Subdued)**: The "happy accident" darker aesthetic from selective bloom without intensity boost

The toggle button cycles between these two distinct looks.

---

## Current Implementation Status

### Completed Changes
1. Added `bloomIntensity` uniform to blend shader (multiplier for bloom texture)
2. Lowered bloom threshold to 0.05 for magical mode
3. Increased material opacities for brighter base rendering
4. Enabled bloom on additional objects (gridLines, inner glow)
5. Updated aesthetic presets with `bloomIntensity` property

### Architecture
- Two-composer selective bloom system retained
- Blend shader multiplies bloom by `bloomIntensity` uniform
- `applyAesthetic()` function updates all parameters when toggling

---

## Aesthetic Presets

### Magical (Bright) - Default
The vibrant, glowing look with enhanced bloom:
```javascript
{
  exposure: 1.2,
  bloomStrength: 1.8,
  bloomRadius: 0.4,
  bloomThreshold: 0.05,
  bloomIntensity: 2.0,      // Key: 2x multiplier amplifies glow
  textOpacity: 0.85,
  textBloom: true,
  wireframeOpacity: 0.5,
  particleOpacity: 0.8,
  globeOpacity: 0.8
}
```

### Dark (Subdued) - Toggle Option
The moodier, understated look (the "happy accident"):
```javascript
{
  exposure: 0.85,           // Lower exposure
  bloomStrength: 0.5,       // Subtle bloom
  bloomRadius: 1.0,         // Wider, softer
  bloomThreshold: 0.15,     // Higher threshold
  bloomIntensity: 1.0,      // Key: No multiplier = original dark look
  textOpacity: 0.2,         // Dim text
  textBloom: false,         // Text doesn't glow
  wireframeOpacity: 0.25,   // Subtle wireframe
  particleOpacity: 0.4,     // Muted particles
  globeOpacity: 1.0         // Solid globe core
}
```

---

## Toggle Button Behavior

The existing button cycles between modes:
- Click: Toggles `isDarkMode` boolean
- Calls `applyAesthetic('dark')` or `applyAesthetic('magical')`
- Updates button text/icon to reflect current mode

Button states:
- Magical mode: Shows sparkle icon + "Magical"
- Dark mode: Shows moon icon + "Dark Mode"

---

## Key Insight

The `bloomIntensity` uniform is the critical difference:
- **2.0** = Vibrant glow (bloom texture doubled before adding)
- **1.0** = Subdued glow (bloom texture added as-is)

This single parameter, combined with adjusted opacities and bloom settings, creates the dramatic difference between the two aesthetics.

---

## Files Modified

1. **`src/pages/GlobeLanding.jsx`**
   - Blend shader with `bloomIntensity` uniform
   - Enhanced bloom parameters
   - Dual aesthetic presets
   - `applyAesthetic()` updates all values including `bloomIntensity`

---

## Testing Checklist

- [ ] Default state is "Magical" (bright, vibrant)
- [ ] Clicking toggle switches to "Dark" (subdued, moody)
- [ ] Clicking again returns to "Magical"
- [ ] Text visibility changes dramatically between modes
- [ ] Wireframe glow intensity changes
- [ ] Particle brightness changes
- [ ] Button text/icon updates correctly
- [ ] No visual glitches during transition
- [ ] Performance remains smooth in both modes
