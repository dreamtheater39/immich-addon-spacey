import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default defineConfig(() => {
  const frontendPort = parseInt(process.env.VITE_FRONTEND_PORT || '5173', 10);

  return {
    plugins: [react()],
    server: {
      port: frontendPort,
      strictPort: true,
    },
    define: {
      'import.meta.env': {
        VITE_API_KEY: JSON.stringify(process.env.VITE_API_KEY),
        VITE_IMMICH_PUBLIC_URL: JSON.stringify(process.env.VITE_IMMICH_PUBLIC_URL),
      },
    },
  };
});
