import { defineConfig } from "vite";
import { proxyPage } from "./src/index";

export default defineConfig({
  plugins: [
    proxyPage({
      localEntryPoint: "./sandbox/index.ts",
      remoteUrl:
        "https://www.ramseysolutions.com/real-estate/moving-and-storage",
      rootNode: {
        id: "someId",
        prependTo: ".mainz",
      },
    }),
  ],
});
