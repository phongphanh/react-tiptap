import React from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  Rows2,
  Columns2,
  Trash2,
  TableProperties,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface TableBubbleMenuProps {
  editor: Editor | null;
}

/* ────────────────────────── helpers ────────────────────────── */

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5" />;
}

interface TipButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

function TipButton({
  label,
  onClick,
  className = "",
  children,
}: TipButtonProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={`p-1.5 rounded-sm transition-colors ${className}`}
          aria-label={label}
        >
          {children}
        </button>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={6}
          className="z-50 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-md animate-in fade-in-0 zoom-in-95"
        >
          {label}
          <TooltipPrimitive.Arrow className="fill-gray-900" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/* ────────────────────────── main component ────────────────────────── */

export function TableBubbleMenu({ editor }: TableBubbleMenuProps) {
  if (!editor) return null;

  return (
    <TooltipPrimitive.Provider delayDuration={400}>
      <BubbleMenu
        editor={editor}
        pluginKey="tableBubbleMenu"
        shouldShow={({ editor: e, state }: any) => {
          const isTextSelection = state.selection.type === "text" || state.selection.constructor.name === "TextSelection";

          // If the user is just selecting text inside a table, we don't want to show the table menu.
          // We want the text menu to show up instead.
          if (isTextSelection && !state.selection.empty) {
            return false;
          }

          return (
            e.isActive("table") ||
            e.isActive("tableCell") ||
            e.isActive("tableHeader") ||
            e.isActive("tableRow")
          );
        }}
        className="flex items-center gap-0.5 border border-gray-200 bg-white shadow-md rounded-md p-1"
      >
        {/* Row controls */}
        <TipButton
          label="Add row above"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="text-gray-600 hover:bg-gray-100"
        >
          <ChevronUp className="w-4 h-4" />
        </TipButton>

        <TipButton
          label="Add row below"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="text-gray-600 hover:bg-gray-100"
        >
          <ChevronDown className="w-4 h-4" />
        </TipButton>

        <TipButton
          label="Delete row"
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="text-gray-600 hover:bg-gray-100"
        >
          <Rows2 className="w-4 h-4" />
        </TipButton>

        <Divider />

        {/* Column controls */}
        <TipButton
          label="Add column before"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </TipButton>

        <TipButton
          label="Add column after"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="text-gray-600 hover:bg-gray-100"
        >
          <ChevronRight className="w-4 h-4" />
        </TipButton>

        <TipButton
          label="Delete column"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="text-gray-600 hover:bg-gray-100"
        >
          <Columns2 className="w-4 h-4" />
        </TipButton>

        <Divider />

        {/* Table controls */}
        <TipButton
          label="Toggle header row"
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          className="text-gray-600 hover:bg-gray-100"
        >
          <TableProperties className="w-4 h-4" />
        </TipButton>

        <TipButton
          label="Delete table"
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </TipButton>
      </BubbleMenu>
    </TooltipPrimitive.Provider>
  );
}
