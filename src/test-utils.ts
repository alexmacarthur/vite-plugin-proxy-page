import { format } from "prettier";
import { expect } from "vitest";

export const formatCode = (code: string) =>
  format(code, {
    parser: "html",
  });

export const htmlMatches = (html1: string, html2: string) => {
  return expect(formatCode(html1)).toEqual(formatCode(html2));
};
