import type { ProxyPageOptions } from "./index";
import {
  insertLocalEntryScript,
  remoteRemoteEntryPoint,
  setUpRootElement,
  transformRelativeLinks,
} from "./steps";
interface TransformOptions extends Omit<ProxyPageOptions, "remoteUrl"> {
  html: string;
  remoteHost: string;
}

export default ({
  html,
  localEntryPoint,
  remoteEntryPoint,
  remoteHost,
  rootNode = {},
}: TransformOptions): string => {
  let transformedHtml = html;

  // Step #1: Ensure element for mounting is set up.
  transformedHtml = setUpRootElement({
    html,
    rootNodeOptions: rootNode,
  });

  // Step #2: Ensure live remote entry point is out of the way.
  transformedHtml = remoteRemoteEntryPoint(transformedHtml, remoteEntryPoint);

  // Step #3: Insert the local entry point onto the page.
  transformedHtml = insertLocalEntryScript(transformedHtml, localEntryPoint);

  // Step #4: Transform relative links on the proxied page.
  transformedHtml = transformRelativeLinks({
    html: transformedHtml,
    localEntryPoint,
    remoteHost,
  });

  return transformedHtml;
};
