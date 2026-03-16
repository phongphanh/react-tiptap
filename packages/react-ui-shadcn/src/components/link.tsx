import React from "react";
import type { Editor } from "@tiptap/react";
import { Link2, Link2Off, ExternalLink, Trash2 } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { ActionTooltip } from "./tooltip";
import "@tiptap/extension-link";

export interface LinkButtonProps {
  editor: Editor | null;
}

export function LinkButton({ editor }: LinkButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isLinkActive = editor?.isActive("link") ?? false;

  // Pre-fill URL whenever the popover opens
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && editor) {
      setUrl(editor.getAttributes("link").href ?? "");
    }
    setOpen(nextOpen);
  };

  // Focus input after popover mounts
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const applyLink = () => {
    if (!editor) return;
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: trimmed })
        .run();
    }
    setOpen(false);
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyLink();
    }
  };

  if (!editor) return null;

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <ActionTooltip title={isLinkActive ? "Edit link" : "Insert link"}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`rounded-md p-2 hover:bg-gray-200 transition-colors ${
              isLinkActive ? "bg-gray-200 text-blue-600" : "text-gray-700"
            }`}
            aria-label={isLinkActive ? "Edit link" : "Insert link"}
          >
            {isLinkActive ? (
              <Link2 className="h-4 w-4" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
          </button>
        </Popover.Trigger>
      </ActionTooltip>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-lg"
          sideOffset={6}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Insert Link
            </span>
            <Popover.Close
              className="rounded p-0.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              ✕
            </Popover.Close>
          </div>

          {/* URL input */}
          <div className="p-3 flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {/* Open link in new tab */}
              {url.trim() && (
                <a
                  href={url.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md border border-gray-300 p-1.5 text-gray-500 hover:text-blue-600 hover:border-blue-400 transition-colors"
                  title="Open in new tab"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isLinkActive && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
              <div className="ml-auto flex gap-2">
                <Popover.Close
                  type="button"
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </Popover.Close>
                <button
                  type="button"
                  onClick={applyLink}
                  className="rounded-md px-3 py-1.5 text-xs font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
