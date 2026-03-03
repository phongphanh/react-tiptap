import React from "react";
import type { Editor } from "@tiptap/react";
import { ChevronDown, WrapText } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const LINE_HEIGHTS = [
  { label: "1", value: "1" },
  { label: "1.25", value: "1.25" },
  { label: "Default", value: "1.5" },
  { label: "1.75", value: "1.75" },
  { label: "2", value: "2" },
];

export interface LineHeightDropdownProps {
  editor: Editor | null;
}

export function LineHeightDropdown({ editor }: LineHeightDropdownProps) {
  const [activeLineHeight, setActiveLineHeight] = React.useState("1.5");

  React.useEffect(() => {
    if (!editor) return;

    const update = () => {
      let current = "1.5";
      const types = ["paragraph", "heading", "listItem"];

      for (const t of types) {
        if (editor.isActive(t)) {
          const attrs = editor.getAttributes(t);
          if (attrs.lineHeight) {
            current = attrs.lineHeight;
          }
          break;
        }
      }
      setActiveLineHeight(current);
    };

    update();
    editor.on("transaction", update);
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  const activeLabel =
    LINE_HEIGHTS.find((lh) => lh.value === activeLineHeight)?.label ??
    "Default";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex min-w-[5rem] items-center justify-between gap-1 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Line Height"
        >
          <div className="flex items-center gap-2">
            <WrapText className="h-4 w-4" />
            <span className="truncate">{activeLabel}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-black shadow-md"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {LINE_HEIGHTS.map((lh) => {
            const isActive = activeLineHeight === lh.value;
            return (
              <DropdownMenu.Item
                key={lh.value}
                className={`flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 ${
                  isActive ? "bg-gray-100 font-medium" : ""
                }`}
                onSelect={() => {
                  if (lh.value === "1.5") {
                    editor.chain().focus().unsetLineHeight().run();
                  } else {
                    editor.chain().focus().setLineHeight(lh.value).run();
                  }
                }}
              >
                {lh.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
