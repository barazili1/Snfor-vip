
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Use __dirname as the environment directory instead of process.cwd() to fix the missing property error
  const env = loadEnv(mode, __dirname, '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
    define: {
      // Map GEMINI_API_KEY from .env.local to process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || process.env.API_KEY || ''),
    },
    optimizeDeps: {
      include: ["framer-motion"],
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      commonjsOptions: {
        include: [/framer-motion/, /node_modules/]
      }
    }
  };
});
