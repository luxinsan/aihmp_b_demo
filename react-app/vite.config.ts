import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
});
