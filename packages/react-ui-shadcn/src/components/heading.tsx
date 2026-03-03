import React from "react";
import type { Editor } from "@tiptap/react";
import "@tiptap/extension-heading";
import "@tiptap/extension-paragraph";
import { ChevronDown, Heading1, Heading2, Heading3, Type } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export interface HeadingDropdownProps {
  editor: Editor | null;
}

export function HeadingDropdown({ editor }: HeadingDropdownProps) {
  if (!editor) {
    return null;
  }

  const items = [
    { label: "Paragraph", value: 0, icon: Type },
    { label: "Heading 1", value: 1, icon: Heading1 },
    { label: "Heading 2", value: 2, icon: Heading2 },
    { label: "Heading 3", value: 3, icon: Heading3 },
  ];

  const [activeItem, setActiveItem] = React.useState(items[0]);

  React.useEffect(() => {
    const updateActiveItem = () => {
      const current = items.find((item) =>
        item.value === 0
          ? editor.isActive("paragraph")
          : editor.isActive("heading", { level: item.value }),
      );
      if (current) {
        setActiveItem(current);
      }
    };

    // Update initially
    updateActiveItem();

    // Listen for transaction updates (selection/formatting changes)
    editor.on("transaction", updateActiveItem);

    return () => {
      editor.off("transaction", updateActiveItem);
    };
  }, [editor]);

  const CurrentIcon = activeItem.icon;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex w-32 items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Text formatting"
        >
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4" />
            <span className="truncate">{activeItem.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-black shadow-md"
          align="start"
          onCloseAutoFocus={(event) => {
            // Prevent Radix UI from stealing focus back to the trigger button.
            // This ensures the editor keeps the selection and the active state works.
            event.preventDefault();
          }}
        >
          {items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = item.value === activeItem.value;

            return (
              <DropdownMenu.Item
                key={item.value}
                className={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 ${
                  isActive ? "bg-gray-100 font-medium" : ""
                }`}
                onSelect={() => {
                  if (item.value === 0) {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor
                      .chain()
                      .focus()
                      .setHeading({ level: item.value as any })
                      .run();
                  }
                }}
              >
                <ItemIcon className="h-4 w-4" />
                {item.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
