import React from 'react';
import { EditorProvider, useCurrentEditor, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import styles from '@/styles/Tiptap.module.css';

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.controlGroup}>
      <div className={styles.buttonGroup}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? styles.isActive : ''}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? styles.isActive : ''}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? styles.isActive : ''}>
          Strike
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? styles.isActive : ''}>
          Bullet list
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? styles.isActive : ''}>
          Ordered list
        </button>
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
          Redo
        </button>
      </div>
    </div>
  );
};

const extensions = [
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit,
];

const content = `
<h2>Application for Mentorship</h2>
<p>Dear Mentor,</p>
<p>I am writing to apply for your mentorship. I believe that your guidance and expertise would be invaluable to my personal and professional growth. I look forward to learning from you and hope for a positive response.</p>
<p>Thank you for considering my application.</p>
<p>Best regards,</p>
<p>[Your Name]</p>
`;

const Tiptap = ({ onContentChange }) => {
  const editor = useEditor({
    extensions: extensions,
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
