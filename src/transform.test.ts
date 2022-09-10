import { describe, expect, it } from "vitest";
import transform from "./transform";
import relativeLinksHtml from "./fixtures/relative-links";
import absoluteLinksHtml from "./fixtures/absolute-links";
import relativeLinksTransformedHtml from "./fixtures/relative-links-transformed";
import absoluteLinksTransformedHtml from "./fixtures/absolute-links-transformed";
import { formatCode } from "./test-utils";

describe("page with relative links", () => {
  it("produces correct HTML with RegEx remoteEntryPoint.", () => {
    const result = transform({
      html: relativeLinksHtml,
      localEntryPoint: "./local-entry-point.ts",
      remoteEntryPoint: /\/static\/production-bundle\.js/,
      remoteHost: "https://remote-host.com",
    });

    const formattedResult = formatCode(result);

    expect(formattedResult).toEqual(relativeLinksTransformedHtml);
  });

  it("produces correct HTML with string remoteEntryPoint.", () => {
    const result = transform({
      html: relativeLinksHtml,
      localEntryPoint: "./local-entry-point.ts",
      remoteEntryPoint: "/static/production-bundle.js",
      remoteHost: "https://remote-host.com",
    });

    const formattedResult = formatCode(result);

    expect(formattedResult).toEqual(relativeLinksTransformedHtml);
  });
});

describe("page with absolute links", () => {
  it("produces correct HTML with RegEx remoteEntryPoint.", () => {
    const result = transform({
      html: absoluteLinksHtml,
      localEntryPoint: "./local-entry-point.ts",
      remoteEntryPoint: /https:\/\/my-cdn\.com\/path\/production-bundle\.js/,
      remoteHost: "https://remote-host.com",
    });

    const formattedResult = formatCode(result);

    expect(formattedResult).toEqual(absoluteLinksTransformedHtml);
  });

  it("produces correct HTML with string remoteEntryPoint.", () => {
    const result = transform({
      html: absoluteLinksHtml,
      localEntryPoint: "./local-entry-point.ts",
      remoteEntryPoint: "https://my-cdn.com/path/production-bundle.js",
      remoteHost: "https://remote-host.com",
    });

    const formattedResult = formatCode(result);

    expect(formattedResult).toEqual(absoluteLinksTransformedHtml);
  });
});
