'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, Undo, Redo, Link as LinkIcon, Heading2 } from 'lucide-react';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#C4A25A] underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  };

  return (
    <div className="border border-[#D6BFAE] rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#D6BFAE] bg-[#F7F7F7]">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-white transition-colors ${
            editor.isActive('bold') ? 'bg-[#1B365D] text-white' : 'bg-white text-[#1B365D]'
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-white transition-colors ${
            editor.isActive('italic') ? 'bg-[#1B365D] text-white' : 'bg-white text-[#1B365D]'
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-white transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[#1B365D] text-white' : 'bg-white text-[#1B365D]'
          }`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-white transition-colors ${
            editor.isActive('bulletList') ? 'bg-[#1B365D] text-white' : 'bg-white text-[#1B365D]'
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => {
              if (editor.isActive('link')) {
                removeLink();
              } else {
                setShowLinkInput(!showLinkInput);
              }
            }}
            className={`p-2 rounded hover:bg-white transition-colors ${
              editor.isActive('link') ? 'bg-[#1B365D] text-white' : 'bg-white text-[#1B365D]'
            }`}
            title="Link"
          >
            <LinkIcon size={18} />
          </button>

          {showLinkInput && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-[#D6BFAE] rounded-lg shadow-lg p-3 z-10 min-w-[300px]">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-[#D6BFAE] rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={addLink}
                  className="px-3 py-1 bg-[#1B365D] text-white rounded hover:bg-[#C4A25A] transition-colors text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowLinkInput(false);
                    setLinkUrl('');
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-[#D6BFAE] mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded bg-white text-[#1B365D] hover:bg-[#F7F7F7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded bg-white text-[#1B365D] hover:bg-[#F7F7F7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror {
          min-height: 300px;
        }

        .ProseMirror h2 {
          font-family: var(--font-playfair);
          font-size: 1.5rem;
          font-weight: 600;
          color: #1B365D;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .ProseMirror p {
          color: #374151;
          font-size: 1.125rem;
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }

        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .ProseMirror li {
          margin-bottom: 0.5rem;
        }

        .ProseMirror a {
          color: #C4A25A;
          text-decoration: underline;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
