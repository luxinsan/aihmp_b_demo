import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 5180,
  },
  preview: {
    host: "0.0.0.0",
    port: 4180,
  },
  base: mode === "pages-platform-admin" ? "/aihmp_b_demo/platform-admin/" : "/",
}));
