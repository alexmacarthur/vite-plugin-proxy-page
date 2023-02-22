import { JSDOM } from "jsdom";
import { RootNode } from ".";
import {
  findTargetScript,
  stringifyFromPattern,
  findSelectorInDocument,
  getSelectorNotFoundMessage,
} from "./utils";

export function setUpRootElement({
  html,
  rootNodeOptions,
}: {
  html: string;
  rootNodeOptions: RootNode;
}): string {
  const { prependTo, id: htmlId } = rootNodeOptions;

  if (!htmlId) return html;

  // If a root element is provided, it's likely because it doesn't exist in the
  // remote HTML to begin with. So, we make it, and (maybe) mount it to a
  // particular part of the page.
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  let rootEl = dom.window.document.getElementById(htmlId);

  // Check to ensure it doesn't already exist on the page.
  if (!rootEl) {
    rootEl = doc.createElement("div");
    rootEl.id = htmlId;
    doc.body.prepend(rootEl);
  }

  if (!prependTo) return doc.documentElement.outerHTML;

  const mountPoint = findSelectorInDocument(doc, prependTo);

  // If provided, mount the application node to the mount point.
  // Otherwise, leave it mounted to the document body.
  if (mountPoint) {
    mountPoint.prepend(rootEl);
  } else {
    // We couldn't find the mount point, so attach it to the document,
    // so that the console log appears in the browser.
    doc.body.insertAdjacentHTML(
      "afterbegin",
      `<script>console.error('${getSelectorNotFoundMessage(
        prependTo
      )}')</script>`
    );
  }

  return doc.documentElement.outerHTML;
}

export function remoteRemoteEntryPoint(
  html: string,
  pattern?: string | RegExp
): string {
  if (!pattern) return html;

  const targetScriptPattern = new RegExp(
    `<script(.*)${stringifyFromPattern(pattern)}(.*)<\/script>`,
    "gi"
  );

  const targetScript = findTargetScript({
    html,
    targetScriptPattern,
  });

  if (!targetScript) return html;

  return html.replace(targetScriptPattern, "");
}

export function insertLocalEntryScript(
  html: string,
  localEntryPoint: string
): string {
  const constructedScript = `<script type="module" src="${localEntryPoint}"></script>`;

  if (/<\/body>/.test(html)) {
    return html.replace(/(<\/body>)/, `${constructedScript}$1`);
  }

  return `${html}${constructedScript}`;
}

const sourcesPattern = /(<[^<].*?(?:src|href)=(?:"|'))(.+?)((?:"|').*?>)/g;

export function transformRelativeLinks({
  html,
  localEntryPoint,
  remoteHost,
}: {
  html: string;
  localEntryPoint: string;
  remoteHost: string;
}) {
  // For relative links, prepend the remoteHost, so that the assets
  // are pulled from the location in which they live.
  return html.replace(sourcesPattern, (_match, p1, p2, p3) => {
    // This is the local entry point! Leave it alone.
    if (localEntryPoint === p2) {
      return p1 + p2 + p3;
    }

    const updatedUrl = p2.replace(/^\.?\/(.+)/, `${remoteHost}/$1`);

    return `${p1}${updatedUrl}${p3}`;
  });
}
