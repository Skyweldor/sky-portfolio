# Architecture and Design Decisions

This document outlines key architectural choices for the Sky Portfolio project. The application is structured as multiple subsites that share a single React codebase. Each subsite keeps its own routes and components to preserve unique branding while allowing shared utilities across the project.

### Highlights
- **Monorepo-style React app** with feature folders for each subsite
- **Shared components** for layout, navigation, and common UI elements
- **Subsite-specific style guides** to maintain individual look and feel

Future enhancements include extracting shared libraries into npm packages and improving CI/CD pipelines.
