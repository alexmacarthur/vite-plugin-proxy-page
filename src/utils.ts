export function escapeRegExp(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function stringifyFromPattern(pattern: string | RegExp): string {
  let asString = pattern.toString().replace(/^\/(.*)\/$/, "$1");

  if (typeof pattern === "object") {
    return asString;
  }

  return escapeRegExp(asString);
}

export function findTargetScript({
  html,
  targetScriptPattern,
}: {
  html: string;
  targetScriptPattern: RegExp;
}): string | undefined {
  return html.match(targetScriptPattern)?.[0];
}

export function getSelectorNotFoundMessage(selector: string): string {
  return `[vite-plugin-proxy-page] Error! Could not find selector "${selector}" in the document. Defaulting to body.`;
}

export function findSelectorInDocument(
  doc: Document,
  selector: string
): Element | null {
  const mountPoint = doc.querySelector(selector);

  if (mountPoint) return mountPoint;

  console.error(getSelectorNotFoundMessage(selector));

  return null;
}
