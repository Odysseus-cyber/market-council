import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "development-csp",
      // React Fast Refresh injects an inline preamble in development only.
      transformIndexHtml:
        command === "serve"
          ? (html) =>
              html.replace(
                "script-src 'self';",
                "script-src 'self' 'unsafe-inline';",
              )
          : undefined,
    },
  ],
  server: { host: "127.0.0.1" },
}));
