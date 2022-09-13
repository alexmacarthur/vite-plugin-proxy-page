import { beforeEach, describe, expect, it, vi } from "vitest";
import { proxyPage, htmlCache } from "./index";
import axios from "axios";

const url = "https://vite-proxy-demo.netlify.app/some-page";

beforeEach(() => {
  vi.resetAllMocks();
  htmlCache.clear();
});

describe("caching", () => {
  it("performs fresh transformation when cache is empty", async () => {
    const requestSpy = vi.spyOn(axios, "get");

    const plugin = proxyPage({
      localEntryPoint: "local-dev.tsx",
      remoteUrl: url,
    });

    await plugin.transformIndexHtml("");

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(htmlCache.get(url)).not.toBe(undefined);
  });

  it("uses cache when it's filled", async () => {
    const requestSpy = vi.spyOn(axios, "get");

    htmlCache.set(url, "<html></html>");

    const plugin = proxyPage({
      localEntryPoint: "local-dev.tsx",
      remoteUrl: url,
    });

    await plugin.transformIndexHtml("");

    expect(requestSpy).toHaveBeenCalledTimes(0);
  });
});
