# QikEditor

A modular, extensible rich-text editor built on top of [Tiptap](https://tiptap.dev/), published as a pnpm monorepo with two packages:

| Package                       | NPM                                                                                                                           | Description                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `@qik-editor/core`            | [![npm](https://img.shields.io/npm/v/@qik-editor/core)](https://www.npmjs.com/package/@qik-editor/core)                       | Headless Tiptap extensions             |
| `@qik-editor/react-ui-shadcn` | [![npm](https://img.shields.io/npm/v/@qik-editor/react-ui-shadcn)](https://www.npmjs.com/package/@qik-editor/react-ui-shadcn) | React toolbar & bubble-menu components |

---

## Installation

```bash
# Core extensions only (headless)
npm install @qik-editor/core

# React UI (includes core as a dependency)
npm install @qik-editor/react-ui-shadcn
```

> **Peer dependencies** — make sure you have React ≥ 18 and Tiptap ≥ 3 installed:
>
> ```bash
> npm install react react-dom @tiptap/react @tiptap/starter-kit
> ```

---

## Quick Start

```tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CoreExtensions } from "@qik-editor/core";
import { Toolbar } from "@qik-editor/react-ui-shadcn";

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, ...CoreExtensions],
    content: "<p>Hello, QikEditor! 👋</p>",
  });

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
```

---

## Packages

### `@qik-editor/core`

Provides all Tiptap extensions pre-configured and ready to use.

#### Exports

| Export                                                   | Description                                                      |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| `CoreExtensions`                                         | Full array of extensions — drop into `useEditor({ extensions })` |
| `Heading`                                                | Custom heading with inline styles (h1–h6)                        |
| `Paragraph`                                              | Custom paragraph with consistent line-height                     |
| `FontFamilyExtension`                                    | Font family picker support                                       |
| `LineHeightExtension`                                    | Line-height control                                              |
| `Indent`                                                 | Indent / Outdent (Tab / Shift+Tab)                               |
| `Link`                                                   | Clickable links with bubble-menu edit                            |
| `ImageExtension`                                         | Image upload & URL insert                                        |
| `TableExtension`, `TableRow`, `TableCell`, `TableHeader` | Resizable tables                                                 |
| `CodeBlockExtension`                                     | Syntax-highlighted code blocks (lowlight)                        |
| `VideoEmbedExtension`                                    | YouTube / Vimeo embeds                                           |
| `resolveEmbedUrl(url)`                                   | Utility — converts a share URL to an embed URL                   |

#### Using individual extensions

```ts
import { CodeBlockExtension, VideoEmbedExtension } from "@qik-editor/core";

const editor = useEditor({
  extensions: [
    StarterKit,
    CodeBlockExtension, // syntax highlighting via lowlight
    VideoEmbedExtension, // YouTube / Vimeo embeds
  ],
});
```

---

### `@qik-editor/react-ui-shadcn`

React components for the toolbar and bubble menus, styled with Tailwind CSS + Radix UI primitives.

#### Toolbar

```tsx
import { Toolbar } from "@qik-editor/react-ui-shadcn";

<Toolbar
  editor={editor}
  onUpload={async (file) => {
    // upload file and return the public URL
    const url = await uploadToS3(file);
    return url;
  }}
/>;
```

The toolbar includes (left → right):

- Font family · Heading level · Line height · Text align · Indent / Outdent
- Bold · Italic · Underline · Strike · Subscript · Superscript · Code
- Text color · Highlight color
- Link · Lists (bullet / ordered / task) · Blockquote · Code Block
- Image upload · Table insert · Video embed

#### Bubble Menus

```tsx
import {
  TextBubbleMenu,
  LinkBubbleMenu,
  ImageBubbleMenu,
  TableBubbleMenu,
} from '@qik-editor/react-ui-shadcn';

// Place these alongside <EditorContent />
<TextBubbleMenu editor={editor} />
<LinkBubbleMenu editor={editor} />
<ImageBubbleMenu editor={editor} />
<TableBubbleMenu editor={editor} />
```

| Menu              | Appears when…            | Actions                                                |
| ----------------- | ------------------------ | ------------------------------------------------------ |
| `TextBubbleMenu`  | Text is selected         | Bold, Italic, Underline, Strike, Code, Link            |
| `LinkBubbleMenu`  | Cursor is inside a link  | Edit URL, Open in tab, Remove link                     |
| `ImageBubbleMenu` | Image is selected        | Align left/center/right, Alt text, Replace             |
| `TableBubbleMenu` | Cursor is inside a table | Add/delete rows & columns, Toggle header, Delete table |

#### Individual Buttons

All toolbar buttons are exported individually if you want to build a custom toolbar:

```tsx
import {
  BlockquoteButton,
  CodeBlockButton,
  VideoButton,
  ImageButton,
  TableButton,
  ListButtons,
  IndentButtons,
  TextAlignDropdown,
  HeadingDropdown,
  FontFamilyDropdown,
  LineHeightDropdown,
  TextColorPicker,
  HighlightColorPicker,
  LinkButton,
  TextFormatButtons,
} from "@qik-editor/react-ui-shadcn";
```

---

## Extensions Reference

### Code Block

Powered by [`lowlight`](https://github.com/wooorm/lowlight) — auto-detects and highlights **JavaScript, TypeScript, CSS, HTML, JSON, Python, Go, Rust**, and many more.

```ts
// Toggle code block
editor.chain().focus().toggleCodeBlock().run();

// Check if active
editor.isActive("codeBlock");
```

### Video Embed

Supports **YouTube** (`watch?v=`, `youtu.be/`, `shorts/`) and **Vimeo** URLs.

```ts
editor
  .chain()
  .focus()
  .insertVideo({ src: "https://youtu.be/dQw4w9WgXcQ" })
  .run();
```

### Table

Fully resizable via drag handles. Bubble menu controls all row/column operations.

```ts
editor
  .chain()
  .focus()
  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
  .run();
```

### Image

```tsx
// With upload callback (recommended)
<Toolbar editor={editor} onUpload={async (file) => uploadFn(file)} />;

// Or insert by URL
editor
  .chain()
  .focus()
  .setImage({ src: "https://example.com/photo.jpg", alt: "A photo" })
  .run();
```

---

## Development

This is a **pnpm monorepo** using [Turborepo](https://turbo.build/).

```bash
# Install dependencies
pnpm install

# Start dev watchers (all packages + playground)
pnpm dev

# Build all packages
pnpm build

# Open the playground at http://localhost:3000
# (started automatically by `pnpm dev`)
```

### Project structure

```
.
├── apps/
│   └── playground/        # Next.js app for testing
├── packages/
│   ├── core/              # @qik-editor/core
│   └── react-ui-shadcn/   # @qik-editor/react-ui-shadcn
├── pnpm-workspace.yaml
└── turbo.json
```

### Publishing

```bash
# Build
pnpm --filter @qik-editor/core build
pnpm --filter @qik-editor/react-ui-shadcn build

# Publish
cd packages/core && npm publish --access public
cd ../react-ui-shadcn && npm publish --access public
```

---

## License

MIT © [phonghqh](https://github.com/phongphanh)
