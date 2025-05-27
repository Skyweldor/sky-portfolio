# Aetherbound Game Style Guide

## Visual Identity
Aetherbound features a sci-fi RPG aesthetic with glowing cyan accents and dark, atmospheric backgrounds.

## Color Palette
- **Primary**: `#00b3ff` (Cyan - used for UI elements and glow effects)
- **Background**: `#1a1a1a` (Dark gray)
- **Borders**: `#00b3ff` with glow effects
- **Text**: `#ffffff` (White) with cyan glow
- **HP Bar**: Red gradient
- **Stamina Bar**: Green/Yellow gradient

## Typography
- **Font**: System fonts with consistent sizing
- **Effects**: Text-shadow with cyan glow for important elements
- **Weight**: Bold for headers and UI elements

## UI Components
- **Navigation Bar**:
  - Dark background (`#1a1a1a`)
  - Cyan borders and text
  - Buttons with glow effects on hover
  - XP display in navbar
  
- **Game Layout**:
  - 5-column layout: Player Parts | Player | Battle Arena | Enemy | Enemy Parts
  - Fixed positioning for overlays
  - Consistent spacing (20px gaps)

- **Bars**:
  - HP and Stamina bars with gradient fills
  - Smooth width transitions
  - Container with dark background

## Visual Effects
- **Glow Effects**:
  ```css
  box-shadow: 0 0 10px #00b3ff;
  text-shadow: 0 0 5px #00b3ff;
  ```
- **Borders**: 2px solid with cyan color
- **Hover States**: Increased glow intensity
- **Transitions**: Smooth 0.3s transitions

## Component Patterns
- **Overlay Panels**: 
  - Dark semi-transparent backgrounds
  - Cyan borders
  - Slide-in animations
- **Buttons**:
  - Cyan borders with glow
  - Dark background
  - Hover: brighter glow effect
- **Combat Log**:
  - Scrollable area
  - Monospace font for entries
  - Auto-scroll to bottom

## Game-Specific Elements
- **Part Slots**: 5 slots for creature customization
- **Entity Display**: Image with name and status bars
- **Action Buttons**: Consistent styling with game theme
- **Inventory Grid**: Dark tiles with item highlights 