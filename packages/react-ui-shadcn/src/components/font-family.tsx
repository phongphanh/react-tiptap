import React from "react";
import type { Editor } from "@tiptap/react";
import "@tiptap/extension-font-family";
import "@tiptap/extension-text-style";
import { ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  FONT_FAMILIES,
  DEFAULT_FONT_FAMILY,
  type FontFamilyValue,
} from "@qik-editor/core";

export interface FontFamilyDropdownProps {
  editor: Editor | null;
}

export function FontFamilyDropdown({ editor }: FontFamilyDropdownProps) {
  const [activeFont, setActiveFont] =
    React.useState<FontFamilyValue>(DEFAULT_FONT_FAMILY);

  React.useEffect(() => {
    if (!editor) return;

    const update = () => {
      const matched = FONT_FAMILIES.find((f) =>
        editor.isActive("textStyle", { fontFamily: f.value }),
      );
      setActiveFont(matched ? matched.value : DEFAULT_FONT_FAMILY);
    };

    update();
    editor.on("transaction", update);
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  const activeLabel =
    FONT_FAMILIES.find((f) => f.value === activeFont)?.label ??
    DEFAULT_FONT_FAMILY;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex min-w-[9rem] items-center justify-between gap-1 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
          aria-label="Font family"
          style={{ fontFamily: activeFont }}
        >
          <span className="truncate">{activeLabel}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[10rem] overflow-hidden rounded-md border bg-white p-1 text-black shadow-md"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {FONT_FAMILIES.map((font) => {
            const isActive = activeFont === font.value;
            return (
              <DropdownMenu.Item
                key={font.value}
                className={`flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 ${
                  isActive ? "bg-gray-100 font-medium" : ""
                }`}
                style={{ fontFamily: font.value }}
                onSelect={() => {
                  const chain = editor.chain().focus();
                  if (font.value === DEFAULT_FONT_FAMILY) {
                    // Clear font family to restore default
                    (chain as any).unsetFontFamily().run();
                  } else {
                    (chain as any).setFontFamily(font.value).run();
                  }
                }}
              >
                {font.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
