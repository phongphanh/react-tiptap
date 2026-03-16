import React from "react";
import type { Editor } from "@tiptap/react";
import "@tiptap/extension-bold";
import "@tiptap/extension-italic";
import { HeadingDropdown } from "./heading";
import { FontFamilyDropdown } from "./font-family";
import { LineHeightDropdown } from "./line-height";
import { TextAlignDropdown } from "./text-align";
import { IndentButtons } from "./indent";
import { TextFormatButtons } from "./format-buttons";
import { TextColorPicker } from "./text-color";
import { HighlightColorPicker } from "./highlight-color";
import { LinkButton } from "./link";
import { ListButtons } from "./list";
import { ImageButton } from "./image/image-button";
import { TableButton } from "./table/table-button";
import { BlockquoteButton } from "./blockquote-button";
import { CodeBlockButton } from "./code-block-button";
import { VideoButton } from "./video/video-button";
import { ActionTooltip } from "./tooltip";

export interface ToolbarProps {
  editor: Editor | null;
  className?: string;
  onUpload?: (file: File) => Promise<string>;
}

export function Toolbar({ editor, className, onUpload }: ToolbarProps) {
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
    <div
      className={`flex items-center space-x-1 border rounded-md p-1 flex-wrap ${className || ""}`}
    >
      <FontFamilyDropdown editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <HeadingDropdown editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <LineHeightDropdown editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <TextAlignDropdown editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <IndentButtons editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <div className="flex items-center gap-1">
        <ActionTooltip title="Bold">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded-md p-2 text-gray-700 hover:bg-gray-200 transition-colors ${
              activeFormats.bold ? "bg-gray-200" : ""
            }`}
            aria-label="Bold"
          >
            <strong className="font-bold font-serif w-4 h-4 flex items-center justify-center">
              B
            </strong>
          </button>
        </ActionTooltip>
        <ActionTooltip title="Italic">
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded-md p-2 text-gray-700 hover:bg-gray-200 transition-colors ${
              activeFormats.italic ? "bg-gray-200" : ""
            }`}
            aria-label="Italic"
          >
            <em className="font-serif italic w-4 h-4 flex items-center justify-center">
              I
            </em>
          </button>
        </ActionTooltip>
        <TextFormatButtons editor={editor} />
      </div>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <TextColorPicker editor={editor} />
      <HighlightColorPicker editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <LinkButton editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <ListButtons editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <BlockquoteButton editor={editor} />
      <CodeBlockButton editor={editor} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <ImageButton editor={editor} onUpload={onUpload} />
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <TableButton editor={editor} />
      <VideoButton editor={editor} />
    </div>
  );
}
