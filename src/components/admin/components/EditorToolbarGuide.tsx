import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const EditorToolbarGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    {
      category: "Text Formatting",
      items: [
        { name: "Bold", shortcut: "Ctrl+B", description: "Make text bold" },
        { name: "Italic", shortcut: "Ctrl+I", description: "Make text italic" },
        { name: "Underline", shortcut: "Ctrl+U", description: "Underline text" },
        { name: "Strikethrough", shortcut: "", description: "Strike through text" },
        { name: "Superscript", shortcut: "", description: "Raise text above baseline" },
        { name: "Subscript", shortcut: "", description: "Lower text below baseline" }
      ]
    },
    {
      category: "Headers & Styles",
      items: [
        { name: "Headers", shortcut: "", description: "H1, H2, H3, H4, H5, H6 headings" },
        { name: "Font Family", shortcut: "", description: "Change font family" },
        { name: "Font Size", shortcut: "", description: "Small, normal, large, huge" },
        { name: "Text Color", shortcut: "", description: "Change text color" },
        { name: "Background Color", shortcut: "", description: "Highlight text background" }
      ]
    },
    {
      category: "Paragraph Formatting",
      items: [
        { name: "Text Alignment", shortcut: "", description: "Left, center, right, justify" },
        { name: "Indentation", shortcut: "", description: "Increase/decrease indent" },
        { name: "Text Direction", shortcut: "", description: "Left-to-right, right-to-left" }
      ]
    },
    {
      category: "Lists & Structure",
      items: [
        { name: "Numbered List", shortcut: "", description: "Create ordered list" },
        { name: "Bullet List", shortcut: "", description: "Create unordered list" },
        { name: "Checklist", shortcut: "", description: "Create interactive checklist" },
        { name: "Blockquote", shortcut: "", description: "Quote or highlight text" },
        { name: "Code Block", shortcut: "", description: "Format code with syntax highlighting" }
      ]
    },
    {
      category: "Media & Links",
      items: [
        { name: "Insert Image", shortcut: "", description: "Upload and insert images inline" },
        { name: "Insert Link", shortcut: "", description: "Add hyperlinks to text" },
        { name: "Insert Video", shortcut: "", description: "Embed videos from YouTube, Vimeo, etc." }
      ]
    },
    {
      category: "Advanced Features",
      items: [
        { name: "Clear Formatting", shortcut: "", description: "Remove all formatting from selected text" },
        { name: "Undo/Redo", shortcut: "Ctrl+Z / Ctrl+Y", description: "Undo or redo changes" }
      ]
    }
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        <HelpCircle className="w-4 h-4 mr-1" />
        Editor Help
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Rich Text Editor Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex flex-col space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            {item.shortcut && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                {item.shortcut}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Pro Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use Ctrl+A to select all content</li>
                  <li>• Paste content from Word/Google Docs - formatting will be preserved</li>
                  <li>• Drag and drop images directly into the editor</li>
                  <li>• Use the toolbar buttons or keyboard shortcuts for faster formatting</li>
                  <li>• Images are automatically uploaded and optimized</li>
                  <li>• Links can be added to any selected text</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditorToolbarGuide;
