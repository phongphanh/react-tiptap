import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily as TiptapFontFamily } from "@tiptap/extension-font-family";
import { mergeAttributes } from "@tiptap/core";

// Supported font families
export const FONT_FAMILIES = [
  {
    label: "Inter",
    value: "Inter",
    googleFont: "Inter:wght@400;500;600;700;800",
  },
  {
    label: "Roboto",
    value: "Roboto",
    googleFont: "Roboto:wght@400;500;700",
  },
  {
    label: "Open Sans",
    value: "Open Sans",
    googleFont: "Open+Sans:wght@400;600;700",
  },
  {
    label: "Libre Baskerville",
    value: "Libre Baskerville",
    googleFont: "Libre+Baskerville:wght@400;700",
  },
  {
    label: "Noto Sans",
    value: "Noto Sans",
    googleFont: "Noto+Sans:wght@400;600;700",
  },
  {
    label: "Tinos",
    value: "Tinos",
    googleFont: "Tinos:wght@400;700",
  },
] as const;

export type FontFamilyValue = (typeof FONT_FAMILIES)[number]["value"];

export const DEFAULT_FONT_FAMILY: FontFamilyValue = "Inter";

// Build a Google Fonts URL for a given font name
export function getGoogleFontUrl(fontValue: string): string {
  const font = FONT_FAMILIES.find((f) => f.value === fontValue);
  if (!font) return "";
  return `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
}

// Build a @font-face/import block suitable for embedding in exported HTML
export function getFontFaceStyle(fontValue: string): string {
  const url = getGoogleFontUrl(fontValue);
  if (!url) return "";
  return `@import url('${url}');`;
}

/**
 * Wraps an HTML string in a self-contained document fragment with the correct
 * font-face import and body font-family applied so that copy-pasting the output
 * into any environment will render with the correct fonts.
 */
export function wrapHtmlWithFontStyles(
  html: string,
  fontFamily: string,
): string {
  const importStatement = getFontFaceStyle(fontFamily);
  return `<style>${importStatement} body, * { font-family: '${fontFamily}', sans-serif; }</style>${html}`;
}

// Re-export TipTap extensions for consumers
export const FontFamilyExtension = TiptapFontFamily.configure({
  types: ["textStyle"],
});

export { TextStyle };
