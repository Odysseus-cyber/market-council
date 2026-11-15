import { VitePlugin } from "@electron-forge/plugin-vite";

export default {
  packagerConfig: { asar: true },
  makers: [],
  plugins: [
    new VitePlugin({
      build: [
        { entry: "src/main.ts", config: "vite.main.config.ts", target: "main" },
      ],
      renderer: [{ name: "main_window", config: "vite.renderer.config.ts" }],
    }),
  ],
};
