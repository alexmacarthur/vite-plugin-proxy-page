import { JSDOM } from "jsdom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { findSelectorInDocument } from "./utils";

describe("findSelectorInDocument()", () => {
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("logs error when selector can't be found", () => {
    const doc = new JSDOM("<html><body></body></html>").window.document;
    const selector = ".does-not-exist";

    const result = findSelectorInDocument(doc, selector);

    expect(result).toBe(null);

    expect(console.error).toBeCalledWith(
      '[vite-plugin-proxy-page] Error! Could not find selector ".does-not-exist" in the document. Defaulting to body.'
    );
  });

  it("returns node when valid selector is passed", () => {
    const doc = new JSDOM(
      "<html><body><main class='main'>hi</main></body></html>"
    ).window.document;
    const selector = ".main";
    const node = doc.querySelector(selector);
    const result = findSelectorInDocument(doc, selector);

    expect(result).toBe(node);
    expect(console.error).not.toBeCalled();
  });
});
