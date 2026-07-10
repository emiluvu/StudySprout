import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite uses this config to understand React files and the modern JSX transform.
// Keeping it small makes the project easier to learn and extend.
export default defineConfig({
  plugins: [react()],
});
