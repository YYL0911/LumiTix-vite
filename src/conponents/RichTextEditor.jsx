import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align'; 
import Underline from '@tiptap/extension-underline'; 

// 這是編輯器的「工具列」元件
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-toolbar border border-bottom-0 rounded-top p-2 bg-light">
      {/* 基礎功能 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`btn btn-sm fw-bold ${editor.isActive("bold") ? "btn-dark" : "btn-outline-dark"} me-1`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`btn btn-sm fst-italic ${editor.isActive("italic") ? "btn-dark" : "btn-outline-dark"} me-1`}
      >
        I
      </button>
      {/* 新增：底線按鈕 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`btn btn-sm ${editor.isActive("underline") ? "btn-dark" : "btn-outline-dark"} me-1`}
      >
        <u>U</u>
      </button>
      <span className="vr mx-1"></span> {/* 一個小小的分隔線 */}
      {/* 標題 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`btn btn-sm ${editor.isActive("heading", { level: 2 }) ? "btn-dark" : "btn-outline-dark"} me-1`}
      >
        H2
      </button>
      {/* 列表 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`btn btn-sm ${editor.isActive("bulletList") ? "btn-dark" : "btn-outline-dark"} me-1`}
      >
        ●
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`btn btn-sm ${editor.isActive("orderedList") ? "btn-dark" : "btn-outline-dark"}`}
      >
        1.
      </button>
      <span className="vr mx-1"></span> {/* 分隔線 */}
      {/* 新增：文字對齊按鈕 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`btn btn-sm ${editor.isActive({ textAlign: "left" }) ? "btn-dark" : "btn-outline-dark"} me-1`}
      >
        <i className="bi bi-text-left"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`btn btn-sm ${editor.isActive({ textAlign: "center" }) ? "btn-dark" : "btn-outline-dark"} me-1`}
      >
        <i className="bi bi-text-center"></i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`btn btn-sm ${editor.isActive({ textAlign: "right" }) ? "btn-dark" : "btn-outline-dark"}`}
      >
        <i className="bi bi-text-right"></i>
      </button>
    </div>
  );
};


// 這是編輯器的「主體」元件
const RichTextEditor = ({ value, onChange, onBlur, isInvalid, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline, // 3. 啟用底線擴充
      TextAlign.configure({
        // 4. 啟用文字對齊擴充
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: ({ editor }) => {
      onBlur();
    },
    editorProps: {
      attributes: {
        class: `form-control tiptap-editor ${isInvalid ? "is-invalid" : ""}`,
        "data-placeholder": placeholder,
      },
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
