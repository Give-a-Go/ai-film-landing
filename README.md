<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Film Making Hackathon v2 - Landing Page

This landing page for the AI Film Making Hackathon features an immersive 3D photo tunnel and waitlist capture.

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   ./setup.sh
   ```

2. Set up environment variables for EmailOctopus (optional, for waitlist functionality):
   - `./setup.sh` automatically copies existing `.env*` files from another git worktree when available
   - If no worktree has env values yet, copy `.env.example` to `.env.local`
   - Add your `EMAIL_OCTOPUS_API_KEY` and `EMAIL_OCTOPUS_LIST_ID`
   - See [.env.example](.env.example) for detailed setup instructions

3. Run the development server:
   ```bash
   ./run.sh
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

You can also use `npm run setup` and `npm start`. Set `PORT=3001 ./run.sh` to run on a different port.

## Features

- **3D Photo Tunnel**: Immersive Three.js-powered photo gallery tunnel
- **Morphing Waitlist Form**: Animated button that transforms into an email capture form
- **Dark Mode**: Toggle between light and dark themes
- **EmailOctopus Integration**: Serverless API endpoint for waitlist management

## Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings:
   - `EMAIL_OCTOPUS_API_KEY`
   - `EMAIL_OCTOPUS_LIST_ID`
4. Deploy!

## Image Optimization

To optimize images for the photo tunnel:

```bash
npm run optimize-images
```

This will process images in `public/images/` and output optimized WebP versions to `public/images-optimized/`.
