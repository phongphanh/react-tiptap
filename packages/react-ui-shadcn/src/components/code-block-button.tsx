import React from "react";
import type { Editor } from "@tiptap/react";
import { Code2 } from "lucide-react";

export interface CodeBlockButtonProps {
  editor: Editor | null;
}

export function CodeBlockButton({ editor }: CodeBlockButtonProps) {
  if (!editor) return null;

  const isActive = editor.isActive("codeBlock");

  return (
    <button
      type="button"
      onClick={() => (editor.chain().focus() as any).toggleCodeBlock().run()}
      className={`rounded-md p-2 transition-colors text-gray-700 hover:bg-gray-200 ${
        isActive ? "bg-gray-200 text-blue-600" : ""
      }`}
      aria-label="Code block"
      title="Code block"
    >
      <Code2 className="h-4 w-4" />
    </button>
  );
}
