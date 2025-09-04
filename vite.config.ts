import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables từ file .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    root: '.', // root hiện tại
    base: '/', // quan trọng khi deploy Netlify ở root
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      // Client-side chỉ truy cập được các biến env bắt đầu bằng VITE_
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'), // đảm bảo index.html được build chính xác
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});
