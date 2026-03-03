import TiptapLink from "@tiptap/extension-link";

export const Link = TiptapLink.configure({
  /**
   * Don't open the link on click inside the editor—the user can
   * hold Ctrl/Cmd and click (Tiptap default) or use our toolbar
   * button to navigate.
   */
  openOnClick: false,

  /**
   * Automatically detect and linkify URLs that are typed or pasted.
   */
  autolink: true,

  /**
   * Allow links placed on any inline content, not just text.
   */
  linkOnPaste: true,

  /**
   * HTML attributes that will be rendered on every <a> tag.
   */
  HTMLAttributes: {
    rel: "noopener noreferrer",
    target: "_blank",
    class: "qik-link",
  },
});
