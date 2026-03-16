import React from "react";
import type { Editor } from "@tiptap/react";
import { List, ListOrdered } from "lucide-react";
import "@tiptap/extension-bullet-list";
import "@tiptap/extension-ordered-list";
import { ActionTooltip } from "./tooltip";

export interface ListButtonsProps {
  editor: Editor | null;
}

export function ListButtons({ editor }: ListButtonsProps) {
  const [activeList, setActiveList] = React.useState({
    bulletList: false,
    orderedList: false,
  });

  React.useEffect(() => {
    if (!editor) return;
    const update = () => {
      setActiveList({
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
      });
    };
    editor.on("transaction", update);
    update();
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  const buttons = [
    {
      key: "bulletList",
      label: "Bulleted list",
      icon: <List className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: activeList.bulletList,
    },
    {
      key: "orderedList",
      label: "Numbered list",
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: activeList.orderedList,
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {buttons.map(({ key, label, icon, action, active }) => (
        <ActionTooltip key={key} title={label}>
          <button
            type="button"
            onClick={action}
            className={`rounded-md p-2 transition-colors ${
              active
                ? "bg-gray-200 text-gray-900"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label={label}
          >
            {icon}
          </button>
        </ActionTooltip>
      ))}
    </div>
  );
}
