import { Table as TiptapTable } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

export const TableExtension = TiptapTable.configure({
  resizable: true,
  HTMLAttributes: {
    class: "qik-table",
  },
});

export { TableRow, TableCell, TableHeader };
