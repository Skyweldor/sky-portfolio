# Component API Documentation

## Navigation Components

### NavBar
**Location**: `src/components/NavBar.js`

**Props**:
- `isGameMode` (boolean): Determines if navbar should use game styling
- `onToggleInventory` (function): Callback for inventory toggle (game mode only)
- `onToggleTown` (function): Callback for town toggle (game mode only)
- `onToggleTraining` (function): Callback for training toggle (game mode only)
- `globalXP` (number): Current XP to display (game mode only)

**Features**:
- Scroll-based opacity and blur effects
- Logo scaling on scroll
- Conditional styling for game vs portfolio modes
- Responsive design with Bootstrap

**Usage**:
```jsx
// Portfolio mode
<NavBar />

// Game mode
<NavBar 
  isGameMode={true}
  onToggleInventory={openInventory}
  onToggleTown={openTown}
  onToggleTraining={openTraining}
  globalXP={playerXP}
/>
```

## Banner Components

### Banner
**Location**: `src/components/Banner.js`

**Props**: None

**Features**:
- Animated typewriter effect
- Navigation to stickers page
- Floating image animation
- Neon glow text effects

### StickerBanner
**Location**: `src/components/StickerBanner.js`

**Props**: None

**Features**:
- Sticker-specific styling
- Navigation to stickers page
- Mondrian-inspired design elements

## Shopping Cart Components

### CartContext
**Location**: `src/components/CartContext.js`

**Provides**:
- `cart` (array): Current cart items
- `addToCart(item)`: Add item to cart
- `removeFromCart(itemTitle)`: Remove item from cart
- `increaseQuantity(itemTitle)`: Increase item quantity
- `decreaseQuantity(itemTitle)`: Decrease item quantity

### CartDisplay
**Location**: `src/components/CartDisplay.js`

**Props**: Uses CartContext

**Features**:
- Real-time cart display
- Quantity controls
- Debug mode toggle
- Mondrian color scheme

### StickerCard
**Location**: `src/components/StickerCard.js`

**Props**:
- `title` (string): Sticker title
- `description` (string): Sticker description
- `imgUrl` (string): Image URL
- `details` (string): Additional details
- `backgroundImage` (string): Background image URL

**Features**:
- Add to cart functionality
- Popup modal for details
- Hover effects

## Game Components

### AetherboundGame
**Location**: `src/components/Aetherbound/AetherboundGame.js`

**Props**: None

**Features**:
- Complete RPG game system
- Inventory management
- Combat system
- XP allocation
- Part attachment system

### InventoryPanel
**Location**: `src/components/Aetherbound/InventoryPanel.js`

**Props**:
- `inventory` (array): Player inventory items
- `onUseItem(itemId)`: Callback for item usage
- `onClose()`: Callback to close panel
- `playerParts` (object): Currently equipped parts
- `onAttachPart(partItem)`: Callback for part attachment

### TownPanel
**Location**: `src/components/Aetherbound/TownPanel.js`

**Props**:
- `onClose()`: Callback to close panel
- `quests` (array): Available quests
- `completedQuests` (array): Completed quest IDs
- `onAcceptQuest(quest)`: Quest acceptance callback
- `onClaimQuest(quest)`: Quest completion callback
- `specializations` (array): Available specializations
- `chosenSpec` (string): Current specialization ID
- `onChooseSpec(specId)`: Specialization selection callback
- `onTrain(stat, cost)`: Training callback
- `onBuyItem(item)`: Shop purchase callback
- `shopItems` (array): Available shop items

## Makeup Site Components

### HeroSection
**Location**: `src/components/makeup/HeroSection.jsx`

**Props**: None

**Features**:
- Particle effects background
- Glass morphism design
- Animated gradient borders
- Product showcase
- Scrolling ticker

### KitsCarousel
**Location**: `src/components/makeup/KitsCarousel.jsx`

**Props**: None

**Features**:
- React Slick carousel
- Responsive design
- Product kit display

### FeaturedSplit
**Location**: `src/components/makeup/FeaturedSplit.jsx`

**Props**: None

**Features**:
- Split layout design
- Circular background elements
- Call-to-action buttons

## Utility Components

### EmojiExplosion
**Location**: `src/components/EmojiExplosion.js`

**Props**:
- `position` (object): {x, y} coordinates
- `onAnimationEnd()`: Callback when animation completes

### Popup
**Location**: `src/components/Popup.js`

**Props**:
- `content` (ReactNode): Content to display
- `handleClose()`: Callback to close popup

### ProjectCard
**Location**: `src/components/ProjectCard.js`

**Props**:
- `title` (string): Project title
- `description` (string): Project description
- `imgUrl` (string): Project image
- `details` (string): Additional details
- `backgroundImage` (string): Background image 