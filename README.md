# Wise Tapestry V3

A procedurally generated tapestry generator with regional duotone noise gradients and organic swoosh strokes.

## Architecture

Tapestry V3 uses a different approach from V2:
- **Procedural Gradients**: Regional backgrounds are generated using duotone noise (not static images)
- **Swoosh Layers**: Organic flowing strokes procedurally generated per region
- **Zustand State Management**: Cleaner state architecture vs Context API
- **Improved Component Structure**: Better separation of concerns

## Features

- **10 Regional Presets**: Each with unique duotone noise and swoosh colors
- **Procedural Generation**: Noise and swoosh strokes generated programmatically
- **Animate Mode**: Living, animated noise backgrounds
- **Customizable Parameters**: Adjust noise scale, octaves, lacunarity, gain
- **Layer Controls**: Opacity, blending modes, adjustments, feather, flip
- **Export**: PNG/JPEG export functionality

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Zustand (state management)
- Fabric.js (canvas manipulation)
- React Dropzone (file uploads)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Layout/          # Main layout, topbar
│   ├── Sidebar/         # Left and right sidebars
│   ├── Canvas/          # Canvas area
│   ├── Panels/          # Collapsible panels
│   ├── Controls/        # Layer controls
│   └── UI/              # Reusable UI components
├── store/               # Zustand store
├── types/               # TypeScript types
├── utils/               # Utilities (noise, swoosh generators)
├── styles/              # Global styles and tokens
└── constants/           # Constants and configs
```

## Regional Gradients

Each region has:
- **Duotone Colors**: For the background noise (e.g., EMEA = orange/blue)
- **Swoosh Colors**: For procedural strokes (e.g., EMEA = green/purple)
- **Noise Parameters**: Customizable scale, octaves, lacunarity, gain

## Development Notes

- Colors are currently randomized placeholders
- Exact color codes to be provided later
- Noise parameters match shader.tool reference
- All parameters are customizable via UI controls
