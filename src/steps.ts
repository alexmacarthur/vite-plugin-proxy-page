import { JSDOM } from "jsdom";
import { RootNode } from ".";
import { findTargetScript, stringifyFromPattern } from "./utils";

export function setUpRootElement({
  html,
  rootNodeOptions,
}: {
  html: string;
  rootNodeOptions: RootNode;
}): string {
  const { prependTo, id: htmlId } = rootNodeOptions;

  if (!htmlId) return html;

  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const mountPoint = prependTo && doc.querySelector(prependTo);
  let rootEl = dom.window.document.getElementById(htmlId);

  if (!rootEl) {
    rootEl = doc.createElement("div");
    rootEl.id = htmlId;
    doc.body.prepend(rootEl);
  }

  if (mountPoint) {
    mountPoint.prepend(rootEl);
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
