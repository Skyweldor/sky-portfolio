# Makeup Site Style Guide

## Visual Identity
The makeup site embodies luxury and elegance with a modern, sophisticated aesthetic featuring metallic accents and glass morphism effects.

## Color Palette
- **Primary**:
  - Metallic Gold: `#E2B84B`
  - Rose Gold: `#E8A87C`
- **Backgrounds**:
  - Dark: `#1a0a0a`
  - Cream: `#f0e2c8`
  - Pastel Pink: `#fdf2f3`
- **Text**:
  - Light: `#f0e2c8` (on dark backgrounds)
  - Dark: `#666666` (on light backgrounds)
  - Maroon: `var(--maroon)` for headers

## Typography
- **Heading Font**: `var(--heading-font)` - Elegant serif
- **Body Font**: `var(--body-font)` - Clean sans-serif
- **Effects**:
  - Shimmer text with gradient backgrounds
  - Embossed text effects for luxury feel

## Visual Effects
- **Glass Morphism**:
  ```css
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  ```
- **Animated Gradient Borders**: Using mask techniques for glowing borders
- **Particle Effects**: Golden particles drifting upward
- **Shimmer Animation**: Subtle movement on text and buttons

## Component Patterns
- **Hero Section**: Full-screen with particle overlay
- **Glass Cards**: Semi-transparent with blur effects
- **Buttons**: 
  - Gradient borders with animation
  - Hover effects with glow and scale
  - Frosted glass appearance
- **Navigation**: 
  - Horizontal layout with elegant spacing
  - Links styled minimally
  - No scroll behavior (static positioning)

## Layout Principles
- **Spacing**: Generous padding for luxury feel
- **Typography**: Large, bold headers with elegant fonts
- **Images**: High-quality product photography
- **Sections**: Clear separation with dividing bars

## Special Elements
- **Ticker Bar**: Scrolling announcements with star separators
- **Product Cards**: Clean presentation with emphasis on imagery
- **Carousel**: Smooth transitions for product showcases 