import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    root: '.', // sử dụng root hiện tại
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'), // alias cho root
      },
    },
    build: {
      outDir: 'dist', // thư mục build
      sourcemap: true, // có thể thêm để debug dễ hơn
    },
    server: {
      port: 3000, // tùy chọn: port dev server
      open: true, // tự mở trình duyệt khi chạy dev
    },
  };
});
