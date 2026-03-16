import React from "react";
import type { Editor } from "@tiptap/react";
import { TextQuote } from "lucide-react";
import { ActionTooltip } from "./tooltip";

export interface BlockquoteButtonProps {
  editor: Editor | null;
}

export function BlockquoteButton({ editor }: BlockquoteButtonProps) {
  if (!editor) return null;

  const isActive = editor.isActive("blockquote");

  return (
    <ActionTooltip title="Blockquote">
      <button
        type="button"
        onClick={() => (editor.chain().focus() as any).toggleBlockquote().run()}
        className={`rounded-md p-2 transition-colors text-gray-700 hover:bg-gray-200 ${
          isActive ? "bg-gray-200 text-blue-600" : ""
        }`}
        aria-label="Blockquote"
      >
        <TextQuote className="h-4 w-4" />
      </button>
    </ActionTooltip>
  );
}
