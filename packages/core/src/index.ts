export * from "./editor";
export * from "./extensions";
export * from "./extensions/font-family";
export * from "./extensions/line-height";
export * from "./extensions/indent";
export * from "./extensions/image";
export * from "./extensions/table";
export * from "./extensions/code-block";
export * from "./extensions/video-embed";

import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

export const TextAlignExtension = TextAlign.configure({
  types: ["heading", "paragraph"],
});

export const HighlightExtension = Highlight.configure({
  multicolor: true,
});

export { Underline, Subscript, Superscript, Color };
