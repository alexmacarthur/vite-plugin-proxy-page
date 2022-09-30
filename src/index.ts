import { Plugin } from "vite";
import transform from "./transform";
import axios from "axios";
import { stringifyFromPattern } from "./utils";

export interface RootNode {
  prependTo?: string;
  id?: string;
}

export interface ProxyPageOptions {
  localEntryPoint: string;
  remoteUrl: string;
  remoteEntryPoint?: RegExp | string;
  rootNode?: RootNode;
  cacheHtml?: boolean;
}

export interface ProxyPlugin extends Plugin {
  transformIndexHtml: (html: string) => Promise<any>;
  transform: (src: string, id: string) => any;
}

export const htmlCache = new Map();

export const proxyPage = ({
  localEntryPoint,
  remoteEntryPoint,
  remoteUrl,
  rootNode,
  cacheHtml = true,
}: ProxyPageOptions): ProxyPlugin => {
  return {
    name: "vite-plugin-proxy-page",

    apply: "serve",

    transform(src, id) {
      const entry = localEntryPoint.replace(/^\./, "");
      const pattern = new RegExp(stringifyFromPattern(entry));
      const isLocalEntryPoint = pattern.test(id);

      return isLocalEntryPoint ? `import.meta.hot; ${src}` : src;
    },

    async transformIndexHtml(_html = ""): Promise<string> {
      if (cacheHtml && htmlCache.get(remoteUrl)) {
        return htmlCache.get(remoteUrl);
      }

      const { origin } = new URL(remoteUrl);
      const { data: html } = await axios.get(remoteUrl, {
        responseType: "text",
      });

      const transformedHtml = transform({
        html,
        localEntryPoint,
        remoteEntryPoint,
        remoteHost: origin,
        rootNode,
      });

      cacheHtml && htmlCache.set(remoteUrl, transformedHtml);

      return transformedHtml;
    },
  };
};
