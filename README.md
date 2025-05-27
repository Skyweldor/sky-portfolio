# Sky Portfolio

A multi-purpose React application featuring a professional portfolio, e-commerce stores, and an interactive RPG game.

## 🌟 Features

### Portfolio Site
- **Futuristic Design**: Cyberpunk-inspired aesthetic with neon glow effects
- **Enhanced Navigation**: Scroll-based opacity and blur effects
- **Project Showcase**: Interactive project cards with hover effects
- **Skills Display**: Animated skill presentation

### Sticker Store
- **Mondrian Design**: Bold, geometric design inspired by Piet Mondrian
- **Shopping Cart**: Full cart functionality with quantity management
- **Product Categories**: Organized by pets, welcome messages, and year one themes
- **Interactive Cards**: Hover effects and popup details

### Makeup Microsite
- **Luxury Aesthetic**: Glass morphism and metallic gold accents
- **Particle Effects**: Animated background particles
- **Product Carousel**: Smooth product kit displays
- **Modern UI**: Contemporary design with elegant typography

### Aetherbound Game
- **Complete RPG System**: Turn-based combat with stats and progression
- **Inventory Management**: Item usage and equipment system
- **Part Customization**: Attachable creature parts system
- **Quest System**: Town interactions and specializations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sky-portfolio.git
cd sky-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📁 Project Structure

```
sky-portfolio/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, and media
│   │   ├── components/        # React components
│   │   │   ├── Aetherbound/   # Game components
│   │   │   ├── makeup/        # Makeup site components
│   │   │   └── archived/      # Archived components
│   │   ├── styles/            # Modular CSS files
│   │   │   ├── components/    # Component-specific styles
│   │   │   ├── pages/         # Page-specific styles
│   │   │   └── modules/       # Feature module styles
│   │   └── App.js            # Main application component
│   ├── docs/                  # Documentation
│   │   ├── api/              # Component API docs
│   │   └── style-guides/     # Design system guides
│   └── CHANGELOG_CLEANUP.md   # Cleanup documentation
```

## 🎨 Design Philosophy

Each subsite maintains its own unique visual identity:

- **Portfolio**: Cyberpunk aesthetic with neon glows and dark themes
- **Sticker Store**: Mondrian-inspired with bold colors and geometric shapes
- **Makeup Site**: Luxury design with glass morphism and metallic accents
- **Aetherbound**: Sci-fi RPG styling with cyan highlights and dark backgrounds

## 🛠️ Technologies Used

- **Frontend**: React 18, React Router, Bootstrap 5
- **Styling**: Modular CSS, CSS Variables, Flexbox/Grid
- **Effects**: TSParticles, React Slick, Custom animations
- **State Management**: React Context API, useState/useEffect hooks

## 📚 Documentation

- [Component API Documentation](./docs/api/component-api.md)
- [Portfolio Style Guide](./docs/style-guides/portfolio-style-guide.md)
- [Sticker Store Style Guide](./docs/style-guides/sticker-store-style-guide.md)
- [Makeup Site Style Guide](./docs/style-guides/makeup-site-style-guide.md)
- [Aetherbound Style Guide](./docs/style-guides/aetherbound-style-guide.md)

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🌐 Deployment

The application is configured for deployment to [jairdreams.com](http://jairdreams.com).

To build for production:
```bash
npm run build
```

## 📝 Recent Updates

### Code Cleanup Phase 1 (December 2024)
- ✅ Enhanced navigation scroll effects
- ✅ Modularized CSS architecture (1191 lines → 9 focused files)
- ✅ Removed all commented code and console.logs
- ✅ Created comprehensive documentation
- ✅ Established component API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🎮 Navigation

- `/` - Main portfolio homepage
- `/stickers` - Sticker store with shopping cart
- `/makeup` - Luxury makeup microsite
- `/aetherbound` - Interactive RPG game
- `/blog` - Blog section (placeholder)
- `/prototype` - Development prototype area
