import { describe, expect, it } from "vitest";
import {
  insertLocalEntryScript,
  remoteRemoteEntryPoint,
  setUpRootElement,
} from "./steps";
import { htmlMatches } from "./test-utils";

describe("setUpRootElement()", () => {
  it("returns html when no rootNodeOptions are provided", () => {
    const html = `<html><body></body></html>`;
    const rootNodeOptions = {};

    const result = setUpRootElement({ html, rootNodeOptions });

    htmlMatches(result, html);
  });

  it("creates new node when it doesn't exist", () => {
    const html = `
    <html>
      <head></head>
      <body>
        <main>
        </main>
      </body>
    </html>`;
    const rootNodeOptions = {
      id: "someId",
    };

    const result = setUpRootElement({ html, rootNodeOptions });

    htmlMatches(
      result,
      `
    <html>
      <head></head>
      <body>
        <div id="someId"></div>
        <main>
        </main>
      </body>
    </html>`
    );
  });

  it("creates new node when it doesn't exist", () => {
    const html = `
    <html>
      <head></head>
      <body>
        <main>
        </main>
      </body>
    </html>`;
    const rootNodeOptions = {
      id: "someId2",
      prependTo: "main",
    };

    const result = setUpRootElement({ html, rootNodeOptions });

    htmlMatches(
      result,
      `
    <html>
      <head></head>
      <body>
        <main><div id="someId2"></div></main>
      </body>
    </html>`
    );
  });
});

describe("remoteRemoteEntryPoint()", () => {
  it("removes HTML when pattern is found.", () => {
    const html = `
      <head>
        <script src="/some/js/target.js"></script>
        <script src="/some/other/js"></script>
      </head>
    `;

    const stringResult = remoteRemoteEntryPoint(html, "/some/js/target.js");
    expect(stringResult).toEqual(
      expect.not.stringContaining('<script src="/some/js/target.js"></script>')
    );

    const patternResult = remoteRemoteEntryPoint(
      html,
      /\/some\/\js\/target\.js/
    );
    expect(patternResult).toEqual(
      expect.not.stringContaining('<script src="/some/js/target.js"></script>')
    );
  });

  it("returns same html when pattern is not found.", () => {
    const html = `
      <head>
        <script src="/some/js/target.js"></script>
        <script src="/some/other/js"></script>
      </head>
    `;

    const stringResult = remoteRemoteEntryPoint(
      html,
      "/some/js/target.js-does-not-exist"
    );
    expect(stringResult).toEqual(html);

    const patternResult = remoteRemoteEntryPoint(
      html,
      /\/some\/\js\/target\.js-does-not-exist/
    );
    expect(patternResult).toEqual(html);
  });
});

describe("insertLocalEntryScript()", () => {
  it("mounts script to inside of body if body element exists", () => {
    const html = `<body><div>hello</div></body>`;

    const result = insertLocalEntryScript(html, "./my-script.js");

    expect(result).toEqual(
      '<body><div>hello</div><script type="module" src="./my-script.js"></script></body>'
    );
  });

  it("mounts script outside all HTML if body element does not exist", () => {
    const html = `<div>hello</div>`;

    const result = insertLocalEntryScript(html, "./my-script.js");

    expect(result).toEqual(
      '<div>hello</div><script type="module" src="./my-script.js"></script>'
    );
  });
});
