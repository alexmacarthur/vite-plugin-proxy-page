import "isomorphic-fetch";
import transform from "./transform";

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

export const htmlCache = new Map();

export const proxyPage = ({
  localEntryPoint,
  remoteEntryPoint,
  remoteUrl,
  rootNode,
}: ProxyPageOptions) => ({
  name: "vite-plugin-proxy-page",

  apply: "serve",

  async transformIndexHtml() {
    if (htmlCache.get(remoteUrl)) {
      return htmlCache.get(remoteUrl);
    }

    const html = await fetch(remoteUrl).then((r) => r.text());

    const { origin } = new URL(remoteUrl);

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
});
