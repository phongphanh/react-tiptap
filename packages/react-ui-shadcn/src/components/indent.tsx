import React from "react";
import type { Editor } from "@tiptap/react";
import { Indent as IndentIcon, Outdent } from "lucide-react";
import "@qik-editor/core"; // Imports ambient type declarations for custom commands

export interface IndentButtonsProps {
  editor: Editor | null;
}

export function IndentButtons({ editor }: IndentButtonsProps) {
  if (!editor) {
    return null;
  }

  // Check if indent/outdent can currently be applied to the selection
  // and safeguard against the extension not being registered in the editor
  const canIndent =
    typeof editor.can().indent === "function" ? editor.can().indent() : false;
  const canOutdent =
    typeof editor.can().outdent === "function" ? editor.can().outdent() : false;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().outdent().run()}
        disabled={!canOutdent}
        className="rounded-md p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Decrease indent (Shift+Tab)"
        title="Decrease indent (Shift+Tab)"
      >
        <Outdent className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().indent().run()}
        disabled={!canIndent}
        className="rounded-md p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Increase indent (Tab)"
        title="Increase indent (Tab)"
      >
        <IndentIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
