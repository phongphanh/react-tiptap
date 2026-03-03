import React, { useRef, useState, useCallback, useEffect } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Type } from "lucide-react";

export function ImageBlock({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const { src, alt, title, width, align, caption, showCaption } = node.attrs;
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState<number | string>(
    width || "auto",
  );

  // --- Resizing Logic ---
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setResizing(true);

      const startX = event.clientX;
      const startWidth = imageRef.current?.offsetWidth || 0;

      const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
        const currentX = mouseMoveEvent.clientX;
        const diffX = currentX - startX;
        // When dragging the right handle, width increases by diffX
        const newWidth = Math.max(50, startWidth + diffX);
        setCurrentWidth(newWidth);
      };

      const handleMouseUp = () => {
        setResizing(false);
        // Save the new width in pixels as a string
        updateAttributes({ width: `${imageRef.current?.offsetWidth}px` });
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [updateAttributes],
  );

  // Sync state if props change externally
  useEffect(() => {
    setCurrentWidth(width || "auto");
  }, [width]);

  // --- Alignment Styles ---
  let alignmentClass = "";
  if (align === "left") alignmentClass = "mr-auto";
  else if (align === "right") alignmentClass = "ml-auto";
  else alignmentClass = "mx-auto"; // center is default

  return (
    <NodeViewWrapper
      ref={containerRef}
      className={`group relative flex flex-col my-4 max-w-full ${alignmentClass}`}
      style={{ width: currentWidth }}
      data-drag-handle
    >
      {/* Image Container with Selection Ring */}
      <div
        className={`relative flex items-center justify-center transition-all ${
          selected ? "ring-2 ring-blue-500 ring-offset-2" : ""
        }`}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          title={title}
          className="block h-auto w-full object-contain max-w-none rounded-md"
          style={{ width: currentWidth }}
        />

        <div
          className={`absolute -right-1.5 top-1/2 -translate-y-1/2 h-8 w-3 cursor-ew-resize bg-white border border-gray-300 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${
            selected || resizing ? "opacity-100" : ""
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
        </div>
      </div>

      {/* Optional Caption Input */}
      {showCaption && (
        <input
          type="text"
          className="mt-2 text-sm text-center text-gray-500 bg-transparent border-none outline-none placeholder:text-gray-300 focus:placeholder:text-gray-400"
          placeholder="Write a caption..."
          value={caption || ""}
          onChange={(e) => updateAttributes({ caption: e.target.value })}
        />
      )}
    </NodeViewWrapper>
  );
}
