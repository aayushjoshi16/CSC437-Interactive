import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@backend": resolve(__dirname, "../../packages/backend/src"),
    },
  },
});
