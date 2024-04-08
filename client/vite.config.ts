import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        includeSource: ["src/**/*.{js,ts}"],
    },
    define: {
        "import.meta.vitest": "undefined",
    },
});
