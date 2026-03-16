import React, { useState } from "react";
import type { Editor } from "@tiptap/react";
import { Image as ImageIcon, Upload, Link2 } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import * as Tabs from "@radix-ui/react-tabs";
import { ActionTooltip } from "../tooltip";

export interface ImageButtonProps {
  editor: Editor | null;
  /**
   * Optional custom upload handler. If not provided,
   * falls back to reading the file as a base64 Data URL.
   */
  onUpload?: (file: File) => Promise<string>;
}

export function ImageButton({ editor, onUpload }: ImageButtonProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const insertImage = (src: string) => {
    if (!src) return;
    editor.chain().focus().setImage({ src }).run();
    setOpen(false);
    setUrl("");
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    insertImage(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      if (onUpload) {
        const uploadedUrl = await onUpload(file);
        insertImage(uploadedUrl);
      } else {
        // Fallback: read as Data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (typeof result === "string") {
            insertImage(result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      // Here you might want to show a toast or error message
    } finally {
      setUploading(false);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <ActionTooltip title="Insert Image">
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`rounded-md p-2 transition-colors ${
              open
                ? "bg-gray-200 text-gray-900"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </Popover.Trigger>
      </ActionTooltip>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-72 rounded-md border border-gray-200 bg-white p-3 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          sideOffset={8}
        >
          <Tabs.Root defaultValue="url">
            <Tabs.List className="flex border-b border-gray-100 mb-3">
              <Tabs.Trigger
                value="url"
                className="flex items-center gap-1.5 flex-1 pb-2 text-sm font-medium text-gray-500 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" />
                URL
              </Tabs.Trigger>
              <Tabs.Trigger
                value="upload"
                className="flex items-center gap-1.5 flex-1 pb-2 text-sm font-medium text-gray-500 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="url">
              <form onSubmit={handleUrlSubmit} className="flex flex-col gap-2">
                <input
                  autoFocus
                  type="url"
                  placeholder="Paste image URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={!url}
                  className="w-full rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Insert
                </button>
              </form>
            </Tabs.Content>

            <Tabs.Content value="upload">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-md p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">
                  {uploading ? "Uploading..." : "Click to upload"}
                </span>
                <span className="text-xs text-gray-400 mt-1 text-center">
                  SVG, PNG, JPG or GIF (max. 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </div>
            </Tabs.Content>
          </Tabs.Root>

          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
