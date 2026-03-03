import React from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import { TextFormatButtons } from "../format-buttons";
import { TextColorPicker } from "../text-color";
import { HighlightColorPicker } from "../highlight-color";
import { LinkButton } from "../link";

export interface TextBubbleMenuProps {
  editor: Editor | null;
}

export function TextBubbleMenu({ editor }: TextBubbleMenuProps) {
  const [activeFormats, setActiveFormats] = React.useState({
    bold: false,
    italic: false,
  });

  React.useEffect(() => {
    if (!editor) return;
    const update = () => {
      setActiveFormats((prev) => {
        const bold = editor.isActive("bold");
        const italic = editor.isActive("italic");
        if (prev.bold === bold && prev.italic === italic) return prev;
        return { bold, italic };
      });
    };
    editor.on("transaction", update);
    update();
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="textBubbleMenu"
      shouldShow={({ editor: e, state }: any) => {
        // Only show if there is an actual text selection,
        // and NOT if an image, link, or other blocked node is selected.
        const { empty } = state.selection;
        const isImage = e.isActive("image");
        const isLink = e.isActive("link");
        return !empty && !isImage && !isLink;
      }}
      className="flex items-center space-x-1 border border-gray-200 bg-white shadow-md rounded-md p-1"
    >
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-md p-2 text-gray-700 hover:bg-gray-200 transition-colors ${
            activeFormats.bold ? "bg-gray-200" : ""
          }`}
          aria-label="Bold"
          title="Bold"
        >
          <strong className="font-bold font-serif w-4 h-4 flex items-center justify-center">
            B
          </strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-md p-2 text-gray-700 hover:bg-gray-200 transition-colors ${
            activeFormats.italic ? "bg-gray-200" : ""
          }`}
          aria-label="Italic"
          title="Italic"
        >
          <em className="font-serif italic w-4 h-4 flex items-center justify-center">
            I
          </em>
        </button>
        <TextFormatButtons editor={editor} />
      </div>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <TextColorPicker editor={editor} />
      <HighlightColorPicker editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <LinkButton editor={editor} />
    </BubbleMenu>
  );
}
