import { EditorContent, useEditor } from '@tiptap/react';
import HardBreak from '@tiptap/extension-hard-break'
import { useDebouncedCallback } from "use-debounce";
import { Placeholder } from "@tiptap/extension-placeholder";
import { StarterKit } from "@tiptap/starter-kit";

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: 'Adicionar comentario...',
  }),
  HardBreak.configure({
    keepMarks: false,
  })
]

const TipTap = ({ value, onChange, className }) => {
  const editor = useEditor({
    extensions,
    content: value.replace(/[\s\n]+$/, '').replace(/\n/g, '<br>'),
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
        onChange(editor.getText());
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
