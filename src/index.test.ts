import { beforeEach, describe, expect, it, vi } from "vitest";
import { proxyPage, htmlCache } from "./index";

const url = "https://vite-proxy-demo.netlify.app/some-page";

beforeEach(() => {
  vi.resetAllMocks();
  htmlCache.clear();
});

describe("caching", () => {
  it("performs fresh transformation when cache is empty", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await proxyPage({
      localEntryPoint: "local-dev.tsx",
      remoteUrl: url,
    }).transformIndexHtml();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(htmlCache.get(url)).not.toBe(undefined);
  });

  it("uses cache when it's filled", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    htmlCache.set(url, "<html></html>");

    await proxyPage({
      localEntryPoint: "local-dev.tsx",
      remoteUrl: url,
    }).transformIndexHtml();

    expect(fetchSpy).toHaveBeenCalledTimes(0);
  });
});
