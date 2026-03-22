import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        historyApiFallback: true,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      build: {
        minify: 'esbuild',
        target: 'es2020',
        rollupOptions: {
          output: {
            manualChunks: {
              'three': ['three'],
              'gsap': ['gsap'],
              'react-vendor': ['react', 'react-dom'],
            },
          },
        },
        chunkSizeWarningLimit: 600,
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
