import React, { useRef, useState, useCallback, useEffect } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

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

  const [resizerState, setResizerState] = useState({ x: 0, w: 0, dir: "" });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

  const onLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setOriginalSize({
        width: e.currentTarget.naturalWidth,
        height: e.currentTarget.naturalHeight,
      });

      if (!width || width === "auto") {
        const computedWidth = getComputedStyle(e.currentTarget).width;
        if (computedWidth && computedWidth !== "auto") {
          setCurrentWidth(computedWidth);
        }
      }
    },
    [width],
  );

  // --- Resizing Logic ---
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, dir: string) => {
      event.preventDefault();
      event.stopPropagation();
      setResizing(true);

      const startWidth = imageRef.current?.offsetWidth || 0;

      setResizerState({
        x: event.clientX,
        w: startWidth,
        dir,
      });
    },
    [],
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      mouseMoveEvent.preventDefault();
      mouseMoveEvent.stopPropagation();

      const { x, w, dir } = resizerState;
      // If dragging left side (tl or bl), movement to the left (negative dx) increases width
      const dx = (mouseMoveEvent.clientX - x) * (/l/.test(dir) ? -1 : 1);

      const newWidth = Math.max(50, w + dx); // min width 50px
      // A full actual implementation using originalSize for aspectRatio could be used if height isn't automatic,
      // but since width works independently with `h-auto` we just adjust width here as in the ref.

      setCurrentWidth(newWidth);
    };

    const handleMouseUp = (mouseUpEvent: MouseEvent) => {
      mouseUpEvent.preventDefault();
      mouseUpEvent.stopPropagation();
      setResizing(false);
      // Save the new width in pixels as a string
      if (imageRef.current) {
        updateAttributes({ width: `${imageRef.current.offsetWidth}px` });
      }
    };

    document.addEventListener("mousemove", handleMouseMove, true);
    document.addEventListener("mouseup", handleMouseUp, true);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove, true);
      document.removeEventListener("mouseup", handleMouseUp, true);
    };
  }, [resizing, resizerState, updateAttributes]);

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
      className={`group relative my-4 max-w-full ${alignmentClass}`}
      style={{ width: currentWidth }}
      data-drag-handle
    >
      {/* Image Container with Selection Ring */}
      <figure
        className={`relative flex flex-col items-center justify-center transition-all m-0 ${
          selected ? "ring-2 ring-blue-500 ring-offset-2" : ""
        }`}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          title={title}
          onLoad={onLoad}
          className={`block h-auto w-full object-contain max-w-none mt-0 mb-0 ${
            resizing ? "pointer-events-none" : ""
          }`}
          style={{ width: currentWidth }}
        />

        {(selected || resizing) && (
          <>
            {["tl", "tr", "bl", "br"].map((dir) => (
              <div
                key={dir}
                onMouseDown={(e) => handleMouseDown(e, dir)}
                className={`absolute w-3 h-3 bg-blue-500 border border-white rounded-full shadow-sm transition-opacity opacity-100
                  ${dir.includes("t") ? "-top-1.5" : "-bottom-1.5"}
                  ${dir.includes("l") ? "-left-1.5" : "-right-1.5"}
                  ${
                    dir === "tl" || dir === "br"
                      ? "cursor-nwse-resize"
                      : "cursor-nesw-resize"
                  }
                `}
              />
            ))}
          </>
        )}
        {/* Optional Caption Input */}
        {showCaption && (
          <figcaption
            className="mt-0 text-sm text-center text-gray-500 outline-none w-full bg-neutral-100"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              updateAttributes({ caption: e.currentTarget.innerText })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            data-placeholder="Write a caption..."
          >
            {caption || ""}
          </figcaption>
        )}
      </figure>
    </NodeViewWrapper>
  );
}
