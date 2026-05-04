import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 5177,
  },
  preview: {
    host: "0.0.0.0",
    port: 4177,
  },
  base: mode === "pages-patient-h5" ? "/aihmp_b_demo/patient-h5/" : "/",
}));
