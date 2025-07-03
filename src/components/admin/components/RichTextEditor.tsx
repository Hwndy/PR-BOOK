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

  // Handle content change with proper debouncing
  const handleChange = useCallback((content: string, delta: any, source: string, editor: any) => {
    // Only trigger onChange for user changes, not programmatic ones
    if (source === 'user') {
      onChange(content);
    }
  }, [onChange]);

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
          const quill = quillRef.current?.getEditor();
          if (!quill) {
            console.error('Quill editor not available');
            return;
          }

          const range = quill.getSelection(true);
          if (!range) {
            console.error('No selection range available');
            return;
          }

          // Insert loading placeholder
          quill.insertText(range.index, 'Uploading image...', 'user');

          // Create FormData for upload
          const formData = new FormData();
          formData.append('image', file);

          // Upload image to server
          const token = localStorage.getItem('adminToken');
          if (!token) {
            quill.deleteText(range.index, 18);
            alert('Authentication required. Please log in again.');
            return;
          }

          console.log('Uploading image to:', `${import.meta.env.VITE_API_URL}/api/resources/upload-inline-image`);
          console.log('Current environment:', import.meta.env.MODE);
          console.log('API URL:', import.meta.env.VITE_API_URL);

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resources/upload-inline-image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            mode: 'cors',
            body: formData
          });

          // Remove loading text
          quill.deleteText(range.index, 18);

          if (response.ok) {
            const data = await response.json();
            console.log('Image upload response:', data);

            if (data.imageUrl) {
              console.log('Inserting image with URL:', data.imageUrl);

              // Ensure the URL is properly formatted
              let imageUrl = data.imageUrl;
              if (!imageUrl.startsWith('http')) {
                // If it's a relative URL, make it absolute
                const baseUrl = import.meta.env.VITE_API_URL || 'https://pr-book.onrender.com';
                imageUrl = imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
                console.log('Converted to absolute URL:', imageUrl);
              }

              // Test if the image URL is accessible
              const testImg = new Image();
              testImg.onload = () => {
                console.log('Image URL is accessible:', imageUrl);
              };
              testImg.onerror = () => {
                console.error('Image URL is not accessible:', imageUrl);
                alert('Image uploaded but URL is not accessible. Please check server configuration.');
              };
              testImg.src = imageUrl;

              // Insert image into editor at the current position
              try {
                // Method 1: Try insertEmbed with 'user' source
                quill.insertEmbed(range.index, 'image', imageUrl, 'user');
                quill.setSelection(range.index + 1, 0);
                console.log('Image inserted successfully with URL:', imageUrl);

                // Verify the image was actually inserted
                setTimeout(() => {
                  const delta = quill.getContents();
                  const hasImage = delta.ops?.some(op => op.insert && typeof op.insert === 'object' && op.insert.image);
                  console.log('Image verification - found in content:', hasImage);

                  if (!hasImage) {
                    console.warn('Image not found in content, trying alternative method');
                    // Method 2: Try without 'user' source
                    quill.insertEmbed(range.index, 'image', imageUrl);
                    quill.setSelection(range.index + 1, 0);
                  }

                  // Force editor to refresh
                  const editor = quillRef.current?.getEditor();
                  if (editor) {
                    editor.update();
                  }
                }, 100);
              } catch (embedError) {
                console.error('Error inserting image embed:', embedError);
                // Fallback: Insert as HTML
                const imageHtml = `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
                quill.clipboard.dangerouslyPasteHTML(range.index, imageHtml);
                console.log('Image inserted as HTML fallback');
              }
            } else {
              console.error('No imageUrl in response:', data);
              alert('Image upload failed: No image URL returned');
            }
          } else {
            const errorData = await response.text();
            console.error('Image upload failed:', response.status, errorData);

            if (response.status === 403) {
              alert('Authentication failed. Please refresh the page and log in again.');
            } else {
              alert(`Failed to upload image: ${response.status} ${response.statusText}`);
            }
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert(`Error uploading image: ${error.message}`);

          // Clean up loading text if it exists
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            if (range) {
              const text = quill.getText(range.index - 18, 18);
              if (text === 'Uploading image...') {
                quill.deleteText(range.index - 18, 18);
              }
            }
          }
        }
      }
    };
  }, []);

  // Custom link handler
  const linkHandler = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) {
      console.error('Quill editor not available for link handler');
      return;
    }

    const range = quill.getSelection(true);
    if (!range) {
      console.error('No selection range for link');
      return;
    }

    // Get selected text if any
    const selectedText = quill.getText(range.index, range.length);
    const url = prompt('Enter the URL:', 'https://');

    if (url && url.trim()) {
      if (range.length > 0) {
        // Format selected text as link
        quill.format('link', url.trim());
      } else {
        // Insert link with URL as text
        const linkText = selectedText || url.trim();
        quill.insertText(range.index, linkText, 'link', url.trim());
        quill.setSelection(range.index + linkText.length, 0);
      }
    }
  }, []);

  // Custom video handler
  const videoHandler = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) {
      console.error('Quill editor not available for video handler');
      return;
    }

    const range = quill.getSelection(true);
    if (!range) {
      console.error('No selection range for video');
      return;
    }

    const url = prompt('Enter video URL (YouTube, Vimeo, etc.):', 'https://');
    if (url && url.trim()) {
      try {
        quill.insertEmbed(range.index, 'video', url.trim(), 'user');
        quill.setSelection(range.index + 1, 0);
      } catch (error) {
        console.error('Error inserting video:', error);
        alert('Error inserting video. Please check the URL format.');
      }
    }
  }, []);

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

  // Debug function to check editor content
  const debugEditorContent = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const delta = quill.getContents();
      const html = quill.root.innerHTML;
      console.log('Editor Delta:', delta);
      console.log('Editor HTML:', html);

      // Check for images in content
      const images = quill.root.querySelectorAll('img');
      console.log('Images found in editor:', images.length);
      images.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, {
          src: img.src,
          alt: img.alt,
          style: img.style.cssText,
          visible: img.offsetWidth > 0 && img.offsetHeight > 0,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        });
      });
    }
  }, []);

  // Add debug button in development
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="rich-text-editor">
      {isDevelopment && (
        <div className="mb-2">
          <button
            type="button"
            onClick={debugEditorContent}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Debug Editor Content
          </button>
        </div>
      )}
      <QuillWrapper
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
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
