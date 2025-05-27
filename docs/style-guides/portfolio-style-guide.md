# Portfolio Site Style Guide

## Visual Identity
The main portfolio site showcases a futuristic, tech-focused aesthetic with cyberpunk influences.

## Color Palette
- **Primary**: `#00b3ff` (Cyan blue glow)
- **Background**: `#000000` (Pure black)
- **Secondary Background**: `#121212` (Dark gray)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#b8b8b8` (Light gray)
- **Accent**: Linear gradient `rgba(170, 54, 124, 0.5)` to `rgba(74, 47, 189, 0.5)`

## Typography
- **Primary Font**: 'DotGothic16', sans-serif (for headers)
- **Body Font**: System fonts
- **Header Sizes**:
  - H1: 130px with neon glow effect
  - H2: 45px with neon glow effect
  - Body: 18px

## Visual Effects
- **Neon Glow**: Used extensively on headers and important elements
  ```css
  text-shadow: 0 0 10px #00b3ff,
               0 0 20px #00b3ff,
               0 0 40px #00b3ff,
               0 0 80px #00b3ff,
               0 0 120px #00b3ff;
  ```
- **Animations**: 
  - Floating animation on images (updown keyframe)
  - Hover effects with increased glow
  - Smooth transitions (0.3s ease-in-out)

## Navigation Behavior
- **Scroll Effect**: Navigation bar becomes more compact and gains a dark background when scrolled
- **Initial State**: Transparent background, full padding
- **Scrolled State**: `#121212` background, reduced padding

## Component Patterns
- **Cards**: Dark backgrounds with glowing borders
- **Buttons**: Transparent with white borders, fill on hover
- **Sections**: Full-width with generous padding (80px vertical) 