import React from "react";
import type { Editor } from "@tiptap/react";
import { Highlighter } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import "@tiptap/extension-highlight";

const PRESET_HIGHLIGHTS = [
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#ff00ff",
  "#ff0000",
  "#4a86e8",
  "#fce5cd",
  "#fff2cc",
  "#d9ead3",
  "#d0e0e3",
  "#c9daf8",
  "#ead1dc",
];

export interface HighlightColorPickerProps {
  editor: Editor | null;
}

export function HighlightColorPicker({ editor }: HighlightColorPickerProps) {
  const [activeHighlight, setActiveHighlight] = React.useState("");

  React.useEffect(() => {
    if (!editor) return;

    const update = () => {
      const highlight = editor.getAttributes("highlight").color;
      setActiveHighlight(highlight || "");
    };

    update();
    editor.on("transaction", update);
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="flex flex-col items-center justify-center rounded-md p-1.5 w-8 h-8 hover:bg-gray-100 transition-colors"
          aria-label="Highlight Color"
          title="Highlight Color"
        >
          <Highlighter className="h-4 w-4 text-gray-700" />
          <div
            className="w-4 h-1 mt-0.5 rounded-sm border border-gray-200"
            style={{ backgroundColor: activeHighlight || "transparent" }}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-44 rounded-md border bg-white p-3 shadow-md"
          sideOffset={5}
        >
          <div className="mb-2 text-xs font-semibold text-gray-500">
            Highlight
          </div>

          <div className="grid grid-cols-6 gap-1 mb-3">
            {PRESET_HIGHLIGHTS.map((color) => (
              <button
                key={color}
                onClick={() =>
                  editor.chain().focus().setHighlight({ color }).run()
                }
                className={`w-5 h-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform ${activeHighlight === color ? "ring-2 ring-blue-500" : ""}`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 border-t pt-2">
            <input
              type="color"
              value={activeHighlight || "#ffff00"}
              onChange={(e) =>
                editor
                  .chain()
                  .focus()
                  .setHighlight({ color: e.target.value })
                  .run()
              }
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
            />
            <span className="text-xs text-gray-600">Custom...</span>
            <button
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              className="ml-auto text-xs text-red-500 hover:underline"
            >
              None
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
