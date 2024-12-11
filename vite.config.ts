/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
}));
