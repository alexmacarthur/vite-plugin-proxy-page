import { Plugin } from "vite";
import transform from "./transform";
import axios from "axios";

export interface RootNode {
  prependTo?: string;
  id?: string;
}

export interface ProxyPageOptions {
  localEntryPoint: string;
  remoteUrl: string;
  remoteEntryPoint?: RegExp | string;
  rootNode?: RootNode;
}

export interface ProxyPlugin extends Plugin {
  transformIndexHtml: (html: string) => Promise<any>;
}

export const htmlCache = new Map();

export const proxyPage = ({
  localEntryPoint,
  remoteEntryPoint,
  remoteUrl,
  rootNode,
}: ProxyPageOptions): ProxyPlugin => {
  return {
    name: "vite-plugin-proxy-page",

    apply: "serve",

    async transformIndexHtml(_html = ""): Promise<string> {
      if (htmlCache.get(remoteUrl)) {
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

      htmlCache.set(remoteUrl, transformedHtml);

      return transformedHtml;
    },
  };
};
