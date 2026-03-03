import { Node, mergeAttributes } from "@tiptap/core";

export interface VideoEmbedOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      /**
       * Insert a video embed node
       */
      insertVideo: (options: { src: string }) => ReturnType;
    };
  }
}

/** Convert any YouTube/Vimeo share URL into the embed form. */
export function resolveEmbedUrl(url: string): string | null {
  const trimmed = url.trim();

  // YouTube: https://www.youtube.com/watch?v=ID
  //          https://youtu.be/ID
  //          https://youtube.com/shorts/ID
  const ytMatch =
    trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    ) || trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);

  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  }

  // Vimeo: https://vimeo.com/123456789
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Already an embed URL — accept as-is
  if (/^https?:\/\//.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export const VideoEmbedExtension = Node.create<VideoEmbedOptions>({
  name: "videoEmbed",
  group: "block",
  atom: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => el.getAttribute("src"),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-embed] iframe",
        getAttrs: (el) => ({
          src: (el as HTMLIFrameElement).getAttribute("src"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        class: "qik-video-embed",
        "data-video-embed": "",
      }),
      [
        "iframe",
        mergeAttributes(HTMLAttributes, {
          frameborder: "0",
          allowfullscreen: "true",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        }),
      ],
    ];
  },

  addCommands() {
    return {
      insertVideo:
        ({ src }) =>
        ({ commands }) => {
          const embedUrl = resolveEmbedUrl(src);
          if (!embedUrl) return false;
          return commands.insertContent({
            type: this.name,
            attrs: { src: embedUrl },
          });
        },
    };
  },
});
