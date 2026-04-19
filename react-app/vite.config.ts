import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5174,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4174,
    strictPort: true,
  },
  base: mode === "pages-admin" ? "/aihmp_b_demo/admin/" : "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.indexOf("/node_modules/react/") !== -1 ||
            id.indexOf("/node_modules/react-dom/") !== -1
          ) {
            return "react-vendor";
          }

          if (
            id.indexOf("/node_modules/antd/") !== -1 ||
            id.indexOf("/node_modules/@ant-design/") !== -1 ||
            id.indexOf("/node_modules/rc-") !== -1
          ) {
            return "antd-vendor";
          }

          return undefined;
        },
      },
    },
  },
}));
