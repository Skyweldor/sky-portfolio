# Interactive Globe - SynthCity Digilabs

A standalone 3D interactive globe visualization built with Three.js. This is an extracted, portable version that can be hosted independently or embedded in other websites.

## Files

```
extracted-globe/
├── index.html    # Main HTML entry point
├── globe.css     # All styles
├── globe.js      # Three.js visualization + configuration
└── README.md     # This file
```

## Quick Start

### Option 1: Open Directly
Simply open `index.html` in a modern web browser. The globe will load using CDN-hosted Three.js libraries.

### Option 2: Host on a Static Server
Upload all files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web server

### Option 3: Embed via iframe
```html
<iframe
  src="path/to/extracted-globe/index.html"
  width="100%"
  height="600"
  frameborder="0"
  allow="accelerometer; gyroscope">
</iframe>
```

## Configuration

Edit the `GLOBE_CONFIG` object at the top of `globe.js` to customize the globe:

### Navigation Links
Configure the top navigation buttons (Home, Skills, Projects):

```javascript
const GLOBE_CONFIG = {
  navigationLinks: {
    'Home': '/',
    'Skills': '/services',
    'Projects': '#projects'
  },
  // ...
};
```

You can add, remove, or rename navigation items. They will be automatically centered horizontally.

### Service Links
Configure where each service label links to:

```javascript
const GLOBE_CONFIG = {
  serviceLinks: {
    'Game Development': 'https://yoursite.com/games',
    'Quantitative Finance': 'https://yoursite.com/finance',
    'Tutoring': 'https://yoursite.com/tutoring',
    'Make-Up/Skincare E-Commerce': 'https://yoursite.com/skincare',
    'Stickers E-Commerce': 'https://yoursite.com/stickers'
  },
  // ...
};
```

**Link Options:**
- Full URL: `'https://example.com/page'`
- Relative path: `'/services#section'`
- Anchor: `'#section-id'`
- Disabled: `'#'` or `''` (no navigation on click)

### Debug Mode
Enable debug panel for troubleshooting:

```javascript
debug: true,  // Shows debug info panel
```

### Rotation Speeds
Adjust the auto-rotation behavior:

```javascript
rotation: {
  globeSpeed: -0.0003,      // Globe rotation speed (negative = clockwise)
  textSpeed: 0.0006,        // Equatorial text rotation speed
  textRotateOpposite: false, // Text rotates opposite to globe
  particleSpeed: -0.0002    // Particle field rotation speed
}
```

## Browser Compatibility

**Required:**
- WebGL support (all modern browsers)
- JavaScript enabled

**Tested on:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome for Android

## Performance Notes

The globe automatically adjusts quality based on device capabilities:

| Device Type | Sphere Segments | Particles | Antialiasing |
|-------------|-----------------|-----------|--------------|
| Desktop     | 64              | 300       | Enabled      |
| Tablet      | 64              | 300       | Enabled      |
| Mobile      | 32              | 150       | Disabled     |
| Low-end     | 32              | 100       | Disabled     |

## Customizing Appearance

### Colors
Edit CSS variables in `globe.css`:

```css
:root {
  --primary-cyan: #00ddff;    /* Main accent color */
  --bg-primary: #020924;      /* Background color */
  --accent-teal: #0FFFC0;     /* Secondary accent */
}
```

### Fonts
The globe uses IBM Plex Mono (loaded from Google Fonts). To use a different font:

1. Update the `@import` in `globe.css`
2. Change `--body-font-mono` variable

## Dependencies

All dependencies are loaded from CDN (no npm install required):

- **Three.js v0.128.0** - 3D rendering
  - Core library
  - FontLoader
  - TextGeometry
  - CSS2DRenderer
  - Post-processing (EffectComposer, UnrealBloomPass)

## Troubleshooting

### Globe not loading
1. Check browser console for errors
2. Enable debug mode in `GLOBE_CONFIG`
3. Ensure WebGL is enabled in your browser

### Performance issues
- Try a different browser
- Close other GPU-intensive tabs
- The globe auto-detects low-end devices and reduces quality

### Labels not clickable
- Ensure `pointerEvents` is not being blocked by parent CSS
- Check that URLs in `GLOBE_CONFIG.serviceLinks` are valid

## License

Part of the SynthCity Digilabs project.
