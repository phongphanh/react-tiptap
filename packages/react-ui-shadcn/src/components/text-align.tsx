import React from "react";
import type { Editor } from "@tiptap/react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "@tiptap/extension-text-align";

const ALIGNMENTS = [
  { label: "Left", value: "left", icon: AlignLeft },
  { label: "Center", value: "center", icon: AlignCenter },
  { label: "Right", value: "right", icon: AlignRight },
  { label: "Justify", value: "justify", icon: AlignJustify },
];

export interface TextAlignDropdownProps {
  editor: Editor | null;
}

export function TextAlignDropdown({ editor }: TextAlignDropdownProps) {
  const [activeAlign, setActiveAlign] = React.useState("left");

  React.useEffect(() => {
    if (!editor) return;

    const update = () => {
      const match = ALIGNMENTS.find((a) =>
        editor.isActive({ textAlign: a.value }),
      );
      setActiveAlign(match ? match.value : "left");
    };

    update();
    editor.on("transaction", update);
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  const activeItem =
    ALIGNMENTS.find((a) => a.value === activeAlign) || ALIGNMENTS[0];
  const ActiveIcon = activeItem.icon;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center justify-between gap-1 rounded-md px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Text Align"
        >
          <ActiveIcon className="h-4 w-4" />
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-black shadow-md flex flex-col"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {ALIGNMENTS.map((align) => {
            const isActive = activeAlign === align.value;
            const Icon = align.icon;
            return (
              <DropdownMenu.Item
                key={align.value}
                className={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 ${
                  isActive ? "bg-gray-100 font-medium" : ""
                }`}
                onSelect={() => {
                  editor.chain().focus().setTextAlign(align.value).run();
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{align.label}</span>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
