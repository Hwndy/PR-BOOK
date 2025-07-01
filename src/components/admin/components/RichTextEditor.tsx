import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  height = "400px"
}) => {
  const quillRef = useRef<ReactQuill>(null);

  // Custom image handler for inline images
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          // Create FormData for upload
          const formData = new FormData();
          formData.append('image', file);

          // Upload image to server
          const token = localStorage.getItem('adminToken');
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resources/upload-inline-image`, {
            method: 'POST',
            headers: {
              ...(token && { Authorization: `Bearer ${token}` })
            },
            body: formData
          });

          if (response.ok) {
            const data = await response.json();
            const imageUrl = data.imageUrl;

            // Insert image into editor
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              const index = range ? range.index : quill.getLength();
              quill.insertEmbed(index, 'image', imageUrl);
              quill.setSelection(index + 1, 0);
            }
          } else {
            alert('Failed to upload image');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image');
        }
      }
    };
  };

  // Custom link handler
  const linkHandler = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        const url = prompt('Enter the URL:');
        if (url) {
          quill.format('link', url);
        }
      }
    }
  };

  // Custom video handler
  const videoHandler = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
        if (url) {
          quill.insertEmbed(range.index, 'video', url);
          quill.setSelection(range.index + 1, 0);
        }
      }
    }
  };

  // Toolbar configuration with all standard features
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        // Text formatting
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],

        // Basic formatting
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],

        // Paragraph formatting
        [{ 'align': [] }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],

        // Lists and quotes
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        ['blockquote', 'code-block'],

        // Media and links
        ['link', 'image', 'video'],

        // Advanced features
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        link: linkHandler,
        video: videoHandler
      }
    },
    clipboard: {
      matchVisual: false
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    },
    keyboard: {
      bindings: {
        // Custom keyboard shortcuts
        bold: {
          key: 'B',
          ctrlKey: true,
          handler: function(range: any, context: any) {
            this.quill.format('bold', !context.format.bold);
          }
        },
        italic: {
          key: 'I',
          ctrlKey: true,
          handler: function(range: any, context: any) {
            this.quill.format('italic', !context.format.italic);
          }
        },
        underline: {
          key: 'U',
          ctrlKey: true,
          handler: function(range: any, context: any) {
            this.quill.format('underline', !context.format.underline);
          }
        }
      }
    }
  }), []);

  // Formats supported by the editor
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'align', 'indent', 'direction',
    'list', 'bullet', 'check',
    'blockquote', 'code-block',
    'link', 'image', 'video',
    'clean'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />
    </div>
  );
};

export default RichTextEditor;
