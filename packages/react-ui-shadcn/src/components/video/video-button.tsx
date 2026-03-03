import React from "react";
import type { Editor } from "@tiptap/react";
import { Video } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { resolveEmbedUrl } from "@qik-editor/core";

export interface VideoButtonProps {
  editor: Editor | null;
}

export function VideoButton({ editor }: VideoButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleInsert = () => {
    const resolved = resolveEmbedUrl(url.trim());
    if (!resolved) {
      setError("Please enter a valid YouTube or Vimeo URL.");
      return;
    }
    (editor.chain().focus() as any).insertVideo({ src: url.trim() }).run();
    setUrl("");
    setError("");
    setOpen(false);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setUrl("");
          setError("");
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className="rounded-md p-2 transition-colors text-gray-700 hover:bg-gray-200"
          aria-label="Embed video"
          title="Embed video"
        >
          <Video className="h-4 w-4" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={6}
          className="z-50 w-80 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <p className="mb-2 text-xs font-semibold text-gray-700">
            Embed Video
          </p>
          <p className="mb-2 text-xs text-gray-400">
            Supports YouTube &amp; Vimeo URLs
          </p>

          <input
            ref={inputRef}
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleInsert();
              if (e.key === "Escape") setOpen(false);
            }}
            className="mb-1 w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />

          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="rounded-md bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600 transition-colors"
            >
              Insert
            </button>
          </div>
          <Popover.Arrow className="fill-white stroke-gray-200" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
