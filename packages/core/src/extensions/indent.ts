import { Extension } from "@tiptap/core";

export interface IndentOptions {
  types: string[];
  minLevel: number;
  maxLevel: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      /**
       * Increase the indentation
       */
      indent: () => ReturnType;
      /**
       * Decrease the indentation
       */
      outdent: () => ReturnType;
    };
  }
}

export const Indent = Extension.create<IndentOptions>({
  name: "indent",

  addOptions() {
    return {
      types: ["paragraph", "heading", "list_item"],
      minLevel: 0,
      maxLevel: 8,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const paddingLeft = element.style.paddingLeft;
              if (paddingLeft) {
                // Approximate rem back to levels (assume 1.5rem per level)
                const val = parseFloat(paddingLeft);
                if (paddingLeft.includes("rem") && !isNaN(val)) {
                  return Math.round(val / 1.5);
                }
              }
              return 0;
            },
            renderHTML: (attributes) => {
              if (!attributes.indent || attributes.indent <= 0) {
                return {};
              }

              // Use 1.5rem per indent level
              return {
                style: `padding-left: ${attributes.indent * 1.5}rem;`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;
          let applicable = false;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              applicable = true;
              if (dispatch) {
                const indent = (node.attrs.indent || 0) + 1;
                if (indent <= this.options.maxLevel) {
                  tr.setNodeMarkup(pos, node.type, {
                    ...node.attrs,
                    indent,
                  });
                }
              }
            }
          });

          return applicable;
        },

      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;
          let applicable = false;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              applicable = true;
              if (dispatch) {
                const indent = (node.attrs.indent || 0) - 1;
                if (indent >= this.options.minLevel) {
                  tr.setNodeMarkup(pos, node.type, {
                    ...node.attrs,
                    indent,
                  });
                }
              }
            }
          });

          return applicable;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        // Inside a list → nest the list item one level deeper
        if (
          this.editor.isActive("bulletList") ||
          this.editor.isActive("orderedList")
        ) {
          return this.editor.commands.sinkListItem("listItem");
        }
        // Otherwise → apply paragraph / heading indentation
        return this.editor.commands.indent();
      },

      "Shift-Tab": () => {
        // Inside a list → lift the list item one level up
        if (
          this.editor.isActive("bulletList") ||
          this.editor.isActive("orderedList")
        ) {
          return this.editor.commands.liftListItem("listItem");
        }
        // Otherwise → remove paragraph / heading indentation
        return this.editor.commands.outdent();
      },
    };
  },
});
