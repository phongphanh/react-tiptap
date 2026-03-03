import TiptapImage from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageNode: {
      /**
       * Add an image
       */
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: string;
        align?: "left" | "center" | "right";
        caption?: string;
      }) => ReturnType;
    };
  }
}

export const ImageExtension = TiptapImage.extend<ImageOptions>({
  name: "image",

  addOptions() {
    return {
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: "qik-image-node",
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      showCaption: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute("data-show-caption") === "true",
        renderHTML: (attributes) => {
          if (!attributes.showCaption) return {};
          return { "data-show-caption": "true" };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align"),
        renderHTML: (attributes) => {
          if (!attributes.align) return {};
          return { "data-align": attributes.align };
        },
      },
      caption: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-caption"),
        renderHTML: (attributes) => {
          if (!attributes.caption) return {};
          return { "data-caption": attributes.caption };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    // The wrapper logic gets handled by our React NodeView,
    // but for serialization (getHTML), we output a simple structure.
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },
});
