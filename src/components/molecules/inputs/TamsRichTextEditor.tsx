import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label: string
  withAsterisk?: boolean
}

export default function TamsRichTextEditor({
  value,
  onChange,
  label,
  withAsterisk,
}: RichTextEditorProps) {
  const editorLock = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div>
      <div className="flex gap-1.5">
        <label className="font-medium">{label}</label>
        <span className="text-red-500">{withAsterisk && '*'}</span>
      </div>
      <MantineRichTextEditor editor={editorLock}>
        <MantineRichTextEditor.Toolbar>
          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Bold />
            <MantineRichTextEditor.Italic />
            <MantineRichTextEditor.Underline />
            <MantineRichTextEditor.Strikethrough />
            <MantineRichTextEditor.ClearFormatting />
            <MantineRichTextEditor.Highlight />
            <MantineRichTextEditor.Code />
          </MantineRichTextEditor.ControlsGroup>
        </MantineRichTextEditor.Toolbar>
        <MantineRichTextEditor.Content />
      </MantineRichTextEditor>
    </div>
  )
}
