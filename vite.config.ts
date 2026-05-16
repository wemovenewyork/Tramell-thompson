import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /api/* routes are served by Vercel serverless functions (see api/).
// For local development with the API routes wired up, run `npx vercel dev`
// instead of `npm run dev` — plain Vite does not execute the api/ functions.
export default defineConfig({
  plugins: [react()],
});
