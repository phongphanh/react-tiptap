import React, { useEffect, useState, useRef } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import { ExternalLink, Link2Off, Check } from "lucide-react";

export interface LinkBubbleMenuProps {
  editor: Editor | null;
}

export function LinkBubbleMenu({ editor }: LinkBubbleMenuProps) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editor) return;
    let prevHref = "";
    const update = () => {
      if (editor.isActive("link")) {
        const attrs = editor.getAttributes("link");
        if (attrs.href !== prevHref) {
          prevHref = attrs.href || "";
          setUrl(prevHref);
        }
      } else {
        prevHref = "";
      }
    };
    editor.on("transaction", update);
    editor.on("selectionUpdate", update);
    update();
    return () => {
      editor.off("transaction", update);
      editor.off("selectionUpdate", update);
    };
  }, [editor]);

  if (!editor) return null;

  const handleApply = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: trimmed })
        .run();
    }
  };

  const handleRemove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  const handleOpenLink = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="linkBubbleMenu"
      shouldShow={({ editor: e }: any) => {
        return e.isActive("link");
      }}
      className="flex flex-col gap-2 border border-gray-200 bg-white shadow-lg rounded-md p-2 w-72"
    >
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <button
          onClick={handleApply}
          className="p-1.5 rounded-sm text-green-600 hover:bg-green-50 transition-colors"
          title="Apply Changes"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <button
          onClick={handleOpenLink}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
          disabled={!url}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Link
        </button>

        <button
          onClick={handleRemove}
          className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          <Link2Off className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </BubbleMenu>
  );
}
