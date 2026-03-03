import React, { useEffect, useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight, Trash2, Type } from "lucide-react";

export interface ImageBubbleMenuProps {
  editor: Editor | null;
}

export function ImageBubbleMenu({ editor }: ImageBubbleMenuProps) {
  const [showCaption, setShowCaption] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("center");

  useEffect(() => {
    if (!editor) return;
    const update = () => {
      if (editor.isActive("image")) {
        const attrs = editor.getAttributes("image");
        setShowCaption(!!attrs.showCaption);
        setAlign(attrs.align || "center");
      }
    };
    editor.on("transaction", update);
    update();
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  const updateImageAttributes = (attrs: any) => {
    if (editor.isActive("image")) {
      editor.chain().focus().updateAttributes("image", attrs).run();
    }
  };

  const deleteNode = () => {
    editor.chain().focus().deleteSelection().run();
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="imageBubbleMenu"
      shouldShow={({ editor: e }: any) => {
        return e.isActive("image");
      }}
      className="flex items-center space-x-1 border border-gray-200 bg-white shadow-md rounded-md p-1"
    >
      <button
        type="button"
        onClick={() => updateImageAttributes({ align: "left" })}
        className={`p-1.5 rounded-sm hover:bg-gray-100 transition-colors ${
          align === "left" ? "text-blue-600 bg-blue-50" : "text-gray-600"
        }`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => updateImageAttributes({ align: "center" })}
        className={`p-1.5 rounded-sm hover:bg-gray-100 transition-colors ${
          align === "center" ? "text-blue-600 bg-blue-50" : "text-gray-600"
        }`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => updateImageAttributes({ align: "right" })}
        className={`p-1.5 rounded-sm hover:bg-gray-100 transition-colors ${
          align === "right" ? "text-blue-600 bg-blue-50" : "text-gray-600"
        }`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <button
        type="button"
        onClick={() => updateImageAttributes({ showCaption: !showCaption })}
        className={`p-1.5 rounded-sm hover:bg-gray-100 transition-colors ${
          showCaption ? "text-blue-600 bg-blue-50" : "text-gray-600"
        }`}
        title="Toggle Caption"
      >
        <Type className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <button
        type="button"
        onClick={deleteNode}
        className="p-1.5 rounded-sm text-red-600 hover:bg-red-50 transition-colors"
        title="Delete Image"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </BubbleMenu>
  );
}
