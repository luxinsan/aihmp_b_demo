import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return ({
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: 5175,
            strictPort: true,
        },
        preview: {
            host: "0.0.0.0",
            port: 4175,
            strictPort: true,
        },
        base: mode === "pages-patient" ? "/aihmp_b_demo/patient/" : "/",
    });
});
