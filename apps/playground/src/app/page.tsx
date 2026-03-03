"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Heading,
  Paragraph,
  FontFamilyExtension,
  TextStyle,
  FONT_FAMILIES,
  DEFAULT_FONT_FAMILY,
  getGoogleFontUrl,
  LineHeight,
  TextAlignExtension,
  Indent,
  Underline,
  Subscript,
  Superscript,
  Color,
  HighlightExtension,
  ImageExtension,
  TableExtension,
  TableRow,
  TableCell,
  TableHeader,
} from "@qik-editor/core";
import {
  Toolbar,
  ImageBlock,
  TextBubbleMenu,
  ImageBubbleMenu,
  LinkBubbleMenu,
  TableBubbleMenu,
} from "@qik-editor/react-ui-shadcn";
import { ReactNodeViewRenderer } from "@tiptap/react";

export default function Home() {
  const [selectedFont, setSelectedFont] = React.useState(DEFAULT_FONT_FAMILY);

  // Mock upload handler for the playground
  const handleUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("File read error"));
      reader.readAsDataURL(file);
    });
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        paragraph: false,
      }),
      TextStyle,
      FontFamilyExtension,
      Heading.configure({ levels: [1, 2, 3] }),
      Paragraph,
      LineHeight,
      TextAlignExtension,
      Indent,
      Underline,
      Subscript,
      Superscript,
      Color,
      HighlightExtension,
      ImageExtension.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageBlock);
        },
      }),
      TableExtension,
      TableRow,
      TableCell,
      TableHeader,
    ],
    content:
      "<p>Hello <strong>World!</strong> Try selecting this text, changing the font and heading level.</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose mx-auto focus:outline-none min-h-[300px]",
      },
    },
    onTransaction: ({ editor: e }) => {
      const matched = FONT_FAMILIES.find((f) =>
        e.isActive("textStyle", { fontFamily: f.value }),
      );
      setSelectedFont(matched ? matched.value : DEFAULT_FONT_FAMILY);
    },
  });

  // Build all Google Font URLs upfront so ANY font applied inline renders correctly
  const allFontLinks = FONT_FAMILIES.map((f) =>
    getGoogleFontUrl(f.value),
  ).filter(Boolean);
  const rawHtml = editor ? editor.getHTML() : "";
  // Wrap with ALL font @imports so the exported HTML is fully self-contained
  const allFontImports = FONT_FAMILIES.map(
    (f) => `@import url('${getGoogleFontUrl(f.value)}');`,
  ).join("\n");
  const wrappedHtml = rawHtml
    ? `<style>\n${allFontImports}\n</style>\n${rawHtml}`
    : "";

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      {/* Preload ALL Google Fonts so inline spans render correctly regardless of selection */}
      {allFontLinks.map((url) => (
        <link key={url} rel="stylesheet" href={url} />
      ))}

      <div className="z-10 max-w-4xl w-full items-center justify-between font-sans">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          QikEditor Playground
        </h1>

        {/* No global fontFamily here — font applies only to selected spans via TextStyle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50 p-2">
            <Toolbar editor={editor} onUpload={handleUpload} />
          </div>
          <div className="p-6 relative">
            <TextBubbleMenu editor={editor} />
            <ImageBubbleMenu editor={editor} />
            <LinkBubbleMenu editor={editor} />
            <TableBubbleMenu editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* HTML Output Viewer: shows the full self-contained HTML with font CSS */}
        <div className="mt-8 bg-gray-800 text-gray-100 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
          <div className="border-b border-gray-700 bg-gray-900/50 p-3 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-300">
              HTML Output Viewer
            </h3>
            <span className="text-xs text-gray-500">
              Includes @import for all {FONT_FAMILIES.length} fonts
            </span>
          </div>
          <div className="p-4 overflow-auto max-h-[300px]">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words text-gray-300">
              {wrappedHtml}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
