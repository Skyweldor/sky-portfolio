# Sky Portfolio Documentation

## Project Overview
Sky Portfolio is a multi-purpose React application featuring:
- A professional portfolio website
- An e-commerce sticker store
- A makeup/beauty products microsite
- An RPG game called "Aetherbound"

## Documentation Structure
- `/docs/README.md` - This file, main documentation hub
- `/docs/style-guides/` - Visual and coding style guides for each site
- `/docs/api/` - Component API documentation
- `/docs/architecture/` - System architecture and design decisions

## Quick Links
- [Portfolio Style Guide](./style-guides/portfolio-style-guide.md)
- [Sticker Store Style Guide](./style-guides/sticker-store-style-guide.md)
- [Makeup Site Style Guide](./style-guides/makeup-site-style-guide.md)
- [Aetherbound Game Style Guide](./style-guides/aetherbound-style-guide.md)

## Navigation Philosophy
Each subsite maintains its own visual identity and navigation structure to create distinct, siloed experiences while remaining part of the larger portfolio ecosystem.

## Development Guidelines
1. Each subsite should maintain its unique visual identity
2. Navigation bars adapt to their context (scroll behavior, styling)
3. Component reusability is encouraged within subsites
4. Global styles should be minimal to prevent cross-site interference 