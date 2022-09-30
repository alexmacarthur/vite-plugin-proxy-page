import { beforeEach, describe, expect, it, vi } from "vitest";
import { proxyPage, htmlCache } from "./index";
import axios from "axios";

const url = "https://vite-proxy-demo.netlify.app/some-page";

beforeEach(() => {
  vi.resetAllMocks();
  htmlCache.clear();
});

describe("hmr injections", () => {
  it("injects import.meta.hot when entry point is handled", () => {
    const plugin = proxyPage({
      localEntryPoint: "./local-dev.tsx",
      remoteUrl: url,
    });

    const result = plugin.transform(
      "var test = 'true'",
      "/path/to/my/local-dev.tsx"
    );

    expect(result).toEqual("import.meta.hot; var test = 'true'");
  });

  it("does not inject import.meta.hot when entry point is not handled", () => {
    const plugin = proxyPage({
      localEntryPoint: "./local-dev.tsx",
      remoteUrl: url,
    });

    const result = plugin.transform(
      "var test = 'true'",
      "/path/to/some/other/file.js"
    );

    expect(result).toEqual("var test = 'true'");
  });
});

describe("caching", () => {
  it("performs fresh transformation when cache is empty", async () => {
    const requestSpy = vi.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({ data: "<html><body></body></html>" });
    });

    const plugin = proxyPage({
      localEntryPoint: "local-dev.tsx",
      remoteUrl: url,
    });

    await plugin.transformIndexHtml("");

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(htmlCache.get(url)).not.toBe(undefined);
  });

  it("uses cache when it's filled", async () => {
    const requestSpy = vi.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({ data: "<html><body></body></html>" });
    });

    htmlCache.set(url, "<html></html>");

    const plugin = proxyPage({
      localEntryPoint: "local-dev.tsx",
      remoteUrl: url,
    });

    await plugin.transformIndexHtml("");

    expect(requestSpy).toHaveBeenCalledTimes(0);
  });

  it("does not cache when the option is disabled", async () => {
    const requestSpy = vi.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({ data: "<html><body></body></html>" });
    });

    const plugin = proxyPage({
      localEntryPoint: "local-dev.tsx",
      remoteUrl: url,
      cacheHtml: false,
    });

    await plugin.transformIndexHtml("");

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(htmlCache.get(url)).toBe(undefined);
  });
});
