import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";

const lowlight = createLowlight(common);

export const CodeBlockExtension = CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: "plaintext",
  HTMLAttributes: {
    class: "qik-code-block",
  },
});
