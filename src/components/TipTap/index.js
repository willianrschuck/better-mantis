import { EditorContent, useEditor } from '@tiptap/react';
import { Markdown } from 'tiptap-markdown';
import { useDebouncedCallback } from "use-debounce";
import { Placeholder } from "@tiptap/extension-placeholder";
import { StarterKit } from "@tiptap/starter-kit";

const extensions = [
  StarterKit,
  Markdown.configure({

  }),
  Placeholder.configure({
    placeholder: 'Adicionar comentario...',
  })
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
        class: "focus:outline-none",
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
      className={ `border border-zinc-50 border-opacity-10 rounded p-3 ${ className }` }/>
  )
}

export default TipTap
