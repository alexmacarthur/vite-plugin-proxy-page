import fs from "fs";
import { PLUGIN_NAME } from ".";

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
  return `[${PLUGIN_NAME}] Error! Could not find selector "${selector}" in the document. Defaulting to body.`;
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

export function createRootIfNotExists(root: string) {
  const markup = `<!DOCTYPE html>
  A root index.html file is required, so ${PLUGIN_NAME} created one.
</html>`;

  const filePath = `${root}/index.html`;
  if (fs.existsSync(filePath)) {
    return;
  }

  console.log(
    `[${PLUGIN_NAME}] Root index.html file could not be found! Creating one here: ${filePath}`
  );

  fs.writeFileSync(filePath, markup);
}
