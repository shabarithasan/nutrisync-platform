import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], server: { port: 5173, proxy: { '/groq-api': { target: 'https://api.groq.com', changeOrigin: true, rewrite: path => path.replace(/^\/groq-api/, '') }, '/api': 'http://localhost:4000' } } });
