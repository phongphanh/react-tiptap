import { Editor as TiptapEditor, EditorOptions } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

export interface QikEditorConfig extends Partial<EditorOptions> {
  // Custom configuration options for QikEditor can be added here
}

export class QikEditor {
  private editor: TiptapEditor;

  constructor(config: QikEditorConfig = {}) {
    this.editor = new TiptapEditor({
      ...config,
      extensions: [StarterKit, ...(config.extensions || [])],
    });
  }

  get instance(): TiptapEditor {
    return this.editor;
  }

  destroy() {
    this.editor.destroy();
  }
}

export function createEditor(config: QikEditorConfig): QikEditor {
  return new QikEditor(config);
}
