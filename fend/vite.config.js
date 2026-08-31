import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    // Proxy /api calls to XAMPP during development
    proxy: {
      "/api": {
        target: "http://localhost/solace-backend",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
