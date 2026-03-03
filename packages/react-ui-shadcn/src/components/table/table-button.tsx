import React, { useState } from "react";
import type { Editor } from "@tiptap/react";
import * as Popover from "@radix-ui/react-popover";
import { Table2 } from "lucide-react";

const MAX_ROWS = 8;
const MAX_COLS = 10;

interface TableButtonProps {
  editor: Editor | null;
}

export function TableButton({ editor }: TableButtonProps) {
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverCol, setHoverCol] = useState(0);
  const [open, setOpen] = useState(false);

  if (!editor) return null;

  const handleInsert = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`rounded-md p-2 hover:bg-gray-200 transition-colors text-gray-700`}
          aria-label="Insert table"
          title="Insert table"
        >
          <Table2 className="h-4 w-4" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 rounded-lg border border-gray-200 bg-white shadow-lg p-3"
          sideOffset={6}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {hoverRow > 0 && hoverCol > 0
              ? `${hoverRow} × ${hoverCol} table`
              : "Insert Table"}
          </p>

          {/* Grid */}
          <div
            className="flex flex-col gap-0.5"
            onMouseLeave={() => {
              setHoverRow(0);
              setHoverCol(0);
            }}
          >
            {Array.from({ length: MAX_ROWS }, (_, r) => (
              <div key={r} className="flex gap-0.5">
                {Array.from({ length: MAX_COLS }, (_, c) => {
                  const row = r + 1;
                  const col = c + 1;
                  const isHighlighted = row <= hoverRow && col <= hoverCol;
                  return (
                    <div
                      key={c}
                      className={`w-5 h-5 rounded-sm border cursor-pointer transition-colors ${
                        isHighlighted
                          ? "bg-blue-500 border-blue-600"
                          : "bg-gray-100 border-gray-300 hover:bg-blue-200 hover:border-blue-400"
                      }`}
                      onMouseEnter={() => {
                        setHoverRow(row);
                        setHoverCol(col);
                      }}
                      onClick={() => handleInsert(row, col)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
