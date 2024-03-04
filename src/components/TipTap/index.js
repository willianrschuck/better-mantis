import { EditorContent, useEditor } from '@tiptap/react';
import { useDebouncedCallback } from "use-debounce";
import { Placeholder } from "@tiptap/extension-placeholder";
import { StarterKit } from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

const extensions = [
  StarterKit,
  Markdown.configure({
    html: false,
    breaks: true
  }),
  Placeholder.configure({
    placeholder: 'Adicionar comentario...',
  }),
]

const TipTap = ({ value, onChange, className }) => {
  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: async ({ editor }) => {
      debouncedUpdates({ onChange, editor });
    },
    editable: !!onChange,
    editorProps: {
      attributes: {
        class: "border border-zinc-50 border-opacity-10 rounded p-3",
      }
    }
  });

  const debouncedUpdates = useDebouncedCallback(async ({ onChange, editor }) => {
    setTimeout(async () => {
      if (onChange) {
        onChange(editor.storage.markdown.getMarkdown());
      }
    }, 100);
  }, 200);

  return (
    <EditorContent
      editor={ editor }
      className={ className }/>
  )
}

export default TipTap
