import type tinymce from "tinymce";

declare global {
  interface Window {
    tinymce: typeof tinymce & {
      EditorManager: {
        get: (id: string) => tinymce.Editor | null;
      };
    };
  }
}

export {};