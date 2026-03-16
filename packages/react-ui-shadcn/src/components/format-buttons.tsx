import React from "react";
import type { Editor } from "@tiptap/react";
import {
  Underline as UnderlineIcon,
  Strikethrough,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
} from "lucide-react";
import "@tiptap/extension-underline";
import "@tiptap/extension-strike";
import "@tiptap/extension-subscript";
import "@tiptap/extension-superscript";
import { ActionTooltip } from "./tooltip";

export interface TextFormatButtonsProps {
  editor: Editor | null;
}

export function TextFormatButtons({ editor }: TextFormatButtonsProps) {
  const [activeFormats, setActiveFormats] = React.useState({
    underline: false,
    strike: false,
    subscript: false,
    superscript: false,
  });

  React.useEffect(() => {
    if (!editor) return;
    const update = () => {
      setActiveFormats((prev) => {
        const underline = editor.isActive("underline");
        const strike = editor.isActive("strike");
        const subscript = editor.isActive("subscript");
        const superscript = editor.isActive("superscript");
        if (
          prev.underline === underline &&
          prev.strike === strike &&
          prev.subscript === subscript &&
          prev.superscript === superscript
        ) {
          return prev;
        }
        return { underline, strike, subscript, superscript };
      });
    };
    editor.on("transaction", update);
    update();
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex items-center gap-1">
      <ActionTooltip title="Underline">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-md p-2 text-gray-700 hover:bg-gray-200 transition-colors ${
            activeFormats.underline ? "bg-gray-200" : ""
          }`}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
      </ActionTooltip>

      <ActionTooltip title="Strikethrough">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-md p-2 text-gray-700 hover:bg-gray-200 transition-colors ${
            activeFormats.strike ? "bg-gray-200" : ""
          }`}
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
      </ActionTooltip>

      <ActionTooltip title="Subscript">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`rounded-md p-2 text-gray-700 hover:bg-gray-200 transition-colors ${
            activeFormats.subscript ? "bg-gray-200" : ""
          }`}
          aria-label="Subscript"
        >
          <SubscriptIcon className="h-4 w-4" />
        </button>
      </ActionTooltip>

      <ActionTooltip title="Superscript">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`rounded-md p-2 text-gray-700 hover:bg-gray-200 transition-colors ${
            activeFormats.superscript ? "bg-gray-200" : ""
          }`}
          aria-label="Superscript"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </button>
      </ActionTooltip>
    </div>
  );
}
