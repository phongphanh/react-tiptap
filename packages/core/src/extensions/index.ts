import { mergeAttributes } from "@tiptap/core";
import { Heading as TiptapHeading } from "@tiptap/extension-heading";
import { Paragraph as TiptapParagraph } from "@tiptap/extension-paragraph";

const headingStyles: Record<number, string> = {
  1: "font-size: 2.25rem; font-weight: 800; line-height: 1.5; margin-top: 0.75rem; margin-bottom: 0.75rem;",
  2: "font-size: 1.5rem; font-weight: 700; line-height: 1.5; margin-top: 0.75rem; margin-bottom: 0.75rem;",
  3: "font-size: 1.25rem; font-weight: 600; line-height: 1.5; margin-top: 0.75rem; margin-bottom: 0.75rem;",
  4: "font-size: 1rem; font-weight: 600; line-height: 1.5; margin-top: 0.75rem; margin-bottom: 0.75rem;",
  5: "font-size: 0.875rem; font-weight: 600; line-height: 1.5; margin-top: 0.75rem; margin-bottom: 0.75rem;",
  6: "font-size: 0.85rem; font-weight: 600; line-height: 1.5; margin-top: 0.75rem; margin-bottom: 0.75rem;",
};

export const Heading = TiptapHeading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(
        this.options.HTMLAttributes,
        { style: headingStyles[level as keyof typeof headingStyles] },
        HTMLAttributes,
      ),
      0,
    ];
  },
});

export const Paragraph = TiptapParagraph.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(
        this.options.HTMLAttributes,
        {
          style:
            "margin-top: 0.75rem; margin-bottom: 0.75rem; line-height: 1.5;",
        },
        HTMLAttributes,
      ),
      0,
    ];
  },
});

import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Indent } from "./indent";
import { Link } from "./link";
import { ImageExtension } from "./image";
import { TableExtension, TableRow, TableCell, TableHeader } from "./table";
import { CodeBlockExtension } from "./code-block";
import { VideoEmbedExtension } from "./video-embed";

export const CoreExtensions = [
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  Paragraph,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Indent,
  Link,
  ImageExtension,
  TableExtension,
  TableRow,
  TableCell,
  TableHeader,
  Underline,
  Subscript,
  Superscript,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  CodeBlockExtension,
  VideoEmbedExtension,
];
