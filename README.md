<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Film Making Hackathon v2 - Landing Page

This landing page for the AI Film Making Hackathon features an immersive 3D photo tunnel and waitlist capture.

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables for EmailOctopus (optional, for waitlist functionality):
   - Copy `.env.example` to `.env.local`
   - Add your `EMAIL_OCTOPUS_API_KEY` and `EMAIL_OCTOPUS_LIST_ID`
   - See [.env.example](.env.example) for detailed setup instructions

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

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
