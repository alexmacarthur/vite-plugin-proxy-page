import { defineConfig } from "vite";
import path from "path";
import { proxyPage } from "./src/index";

export default defineConfig({
  plugins: [
    proxyPage({
      localEntryPoint: "./sandbox/index.ts",
      remoteUrl: "https://vite-proxy-demo.netlify.app/some-page",
      rootNode: {
        id: "someId",
        prependTo: "main",
      },
    }),
  ],
  build: {
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VitePluginProxyPage",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "umd"],
    },
  },
});
