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
