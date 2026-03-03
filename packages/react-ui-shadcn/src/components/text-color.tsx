import React from "react";
import type { Editor } from "@tiptap/react";
import { Baseline } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import "@tiptap/extension-color";

const PRESET_COLORS = [
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#cccccc",
  "#ffffff",
  "#980000",
  "#ff0000",
  "#ff9900",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#4a86e8",
  "#0000ff",
  "#9900ff",
  "#ff00ff",
];

export interface TextColorPickerProps {
  editor: Editor | null;
}

export function TextColorPicker({ editor }: TextColorPickerProps) {
  const [activeColor, setActiveColor] = React.useState("");

  React.useEffect(() => {
    if (!editor) return;

    const update = () => {
      const color = editor.getAttributes("textStyle").color;
      setActiveColor(color || "");
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
          aria-label="Text Color"
          title="Text Color"
        >
          <Baseline className="h-4 w-4 text-gray-700" />
          <div
            className="w-4 h-1 mt-0.5 rounded-sm"
            style={{ backgroundColor: activeColor || "#000000" }}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-44 rounded-md border bg-white p-3 shadow-md"
          sideOffset={5}
        >
          <div className="mb-2 text-xs font-semibold text-gray-500">
            Text Color
          </div>

          <div className="grid grid-cols-6 gap-1 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => editor.chain().focus().setColor(color).run()}
                className={`w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform ${activeColor === color ? "ring-2 ring-blue-500" : ""}`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 border-t pt-2">
            <input
              type="color"
              value={activeColor || "#000000"}
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
            />
            <span className="text-xs text-gray-600">Custom...</span>
            <button
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="ml-auto text-xs text-red-500 hover:underline"
            >
              Reset
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
