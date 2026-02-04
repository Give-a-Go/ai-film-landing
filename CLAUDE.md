# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for the AI Film Making Hackathon v2 featuring an immersive 3D photo tunnel built with Three.js and React. The site includes a waitlist capture system integrated with EmailOctopus.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Optimize images for the photo tunnel
npm run optimize-images
```

## Architecture

### Entry Point
- `index.html` - Main HTML file using CDN-based Tailwind and ES modules via import maps
- `index.tsx` - React root that mounts the App component
- `App.tsx` - Top-level component managing dark mode state and rendering Navigation + Hero

### Component Structure
- **Hero** (`components/Hero.tsx`) - Main component containing the 3D photo tunnel
- **Navigation** (`components/Navigation.tsx`) - Top navigation bar with theme toggle
- **WaitlistMorph** (`components/WaitlistMorph.tsx`) - Morphing button-to-form component for email capture
- **TeleprompterModal** (`components/TeleprompterModal.tsx`) - Modal displaying event information
- **PerspectiveGrid** & **HowItWorks** - Additional UI components

### 3D Tunnel Implementation (Hero.tsx)

The photo tunnel is a complex Three.js implementation with:

- **Infinite scrolling in both directions** - Segments are recycled as camera moves forward/backward
- **Auto-scrolling** - Gentle automatic movement when user isn't actively scrolling
- **Texture caching** - Images are cached in `textureCacheRef` to avoid reloading
- **Grid system** - Floor/ceiling use `FLOOR_COLS` (6 columns), walls use `WALL_ROWS` (4 rows)
- **Segment recycling** - When segments move out of view, images are disposed and re-populated
- **Theme-aware** - Grid lines and fog colors update based on `isDarkMode` prop

Key configuration constants:
- `TUNNEL_WIDTH`, `TUNNEL_HEIGHT`, `SEGMENT_DEPTH` - Tunnel dimensions
- `NUM_SEGMENTS` - Number of visible segments (8)
- `imageUrls` - Array of optimized WebP images from `/public/images-optimized/`

### API Routes

**POST `/api/subscribe.ts`** (Vercel serverless function)
- Adds email to EmailOctopus waitlist with tag `"ai-film-making-hackathon-v2"`
- If email already exists, appends tag to existing contact
- Requires environment variables: `EMAIL_OCTOPUS_API_KEY`, `EMAIL_OCTOPUS_LIST_ID`

### Environment Variables

Create `.env.local` for local development (see `.env.example`):
```bash
EMAIL_OCTOPUS_API_KEY=your_api_key_here
EMAIL_OCTOPUS_LIST_ID=your_list_id_here
```

For Vercel deployment, add these variables in project settings for all environments.

### Image Optimization

The `scripts/optimize-images.js` script:
- Reads images from `public/images/`
- Converts to WebP format at 800x600px, 80% quality
- Outputs to `public/images-optimized/`
- Uses Sharp library for processing

Run `npm run optimize-images` before adding new photos to the tunnel.

### Styling

- **Tailwind CSS** - Loaded via CDN in `index.html`
- **Custom theme** - Extended colors (accent, muted, dark) and fonts (IBM Plex Sans/Serif)
- **Dark mode** - Toggled via state in App.tsx, propagated to all components
- **Custom scrollbar** - Styled for teleprompter modal in `index.html`

### Build Configuration

- **Vite** - Build tool configured in `vite.config.ts`
- **TypeScript** - Config in `tsconfig.json` with path alias `@/*` pointing to project root
- **React 19** - Latest version with new JSX transform
- **GSAP** - Animation library for entrance effects
- **Three.js** - Fixed at v0.160.0 for stability

### Important Notes

- The dev server runs on port 3000 (configured in vite.config.ts), not the default 5173
- Import maps in index.html provide CDN-based modules for development
- The Hero component creates a very tall container (`h-[10000vh]`) to enable scroll-based navigation through the tunnel
- Three.js scene cleanup is critical - all textures, geometries, and materials must be disposed when segments are recycled or component unmounts
