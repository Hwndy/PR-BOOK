import React, { useRef, useMemo, useCallback, useEffect, forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';
import { suppressReactQuillWarnings, restoreReactQuillWarnings } from '../../../utils/suppressWarnings';

// Create a wrapper component to handle ReactQuill properly
// This suppresses the findDOMNode deprecation warning from ReactQuill
const QuillWrapper = forwardRef<ReactQuill, any>((props, ref) => {
  useEffect(() => {
    // Suppress ReactQuill findDOMNode warnings on mount
    suppressReactQuillWarnings();

    return () => {
      // Restore warnings on unmount
      restoreReactQuillWarnings();
    };
  }, []);

  return <ReactQuill ref={ref} {...props} />;
});

QuillWrapper.displayName = 'QuillWrapper';

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
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          // Show loading state
          const quill = quillRef.current?.getEditor();
          if (!quill) return;

          const range = quill.getSelection();
          if (!range) return;

          // Insert loading placeholder
          quill.insertText(range.index, 'Uploading image...', 'user');
          quill.setSelection(range.index + 18);

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
            credentials: 'include',
            mode: 'cors',
            body: formData
          });

          // Remove loading text
          quill.deleteText(range.index, 18);

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
  }, []);

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

  // Add tooltips to toolbar after component mounts
  useEffect(() => {
    const addTooltips = () => {
      const toolbar = document.querySelector('.rich-text-editor .ql-toolbar');
      if (toolbar) {
        // Add tooltips to buttons
        const tooltips = {
          '.ql-bold': 'Bold (Ctrl+B)',
          '.ql-italic': 'Italic (Ctrl+I)',
          '.ql-underline': 'Underline (Ctrl+U)',
          '.ql-strike': 'Strikethrough',
          '.ql-script[value="super"]': 'Superscript',
          '.ql-script[value="sub"]': 'Subscript',
          '.ql-header': 'Heading',
          '.ql-font': 'Font Family',
          '.ql-size': 'Font Size',
          '.ql-color': 'Text Color',
          '.ql-background': 'Background Color',
          '.ql-align': 'Text Alignment',
          '.ql-indent[value="-1"]': 'Decrease Indent',
          '.ql-indent[value="+1"]': 'Increase Indent',
          '.ql-direction': 'Text Direction',
          '.ql-list[value="ordered"]': 'Numbered List',
          '.ql-list[value="bullet"]': 'Bullet List',
          '.ql-list[value="check"]': 'Checklist',
          '.ql-blockquote': 'Blockquote',
          '.ql-code-block': 'Code Block',
          '.ql-link': 'Insert Link',
          '.ql-image': 'Insert Image',
          '.ql-video': 'Insert Video',
          '.ql-clean': 'Clear Formatting'
        };

        Object.entries(tooltips).forEach(([selector, title]) => {
          const element = toolbar.querySelector(selector);
          if (element) {
            element.setAttribute('title', title);
          }
        });
      }
    };

    // Add tooltips after a short delay to ensure toolbar is rendered
    const timer = setTimeout(addTooltips, 100);
    return () => clearTimeout(timer);
  }, []);

  // Set editor height constraints to prevent overflow
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorContainer = editor.container.querySelector('.ql-editor');
      const container = editor.container.querySelector('.ql-container');

      if (editorContainer) {
        (editorContainer as HTMLElement).style.minHeight = height;
        (editorContainer as HTMLElement).style.maxHeight = '400px';
        (editorContainer as HTMLElement).style.overflowY = 'auto';
      }

      if (container) {
        (container as HTMLElement).style.maxHeight = '400px';
        (container as HTMLElement).style.overflow = 'hidden';
      }
    }
  }, [height]);

  return (
    <div className="rich-text-editor">
      <QuillWrapper
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          maxHeight: '400px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};

export default RichTextEditor;
