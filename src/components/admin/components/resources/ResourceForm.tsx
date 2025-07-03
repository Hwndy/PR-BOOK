import React, { useEffect, useRef, useState } from 'react';
import { X, Eye, Save, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ResourceFormProps, ResourceFormData, RESOURCE_CATEGORIES } from './types';
import ResourceImageUpload from './ResourceImageUpload';
import RichTextEditor from '../RichTextEditor';
import EditorToolbarGuide from '../EditorToolbarGuide';

const ResourceForm: React.FC<ResourceFormProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedPost,
  saving,
  onPreview,
  formData,
  onFormDataChange,
  imageFile,
  onImageFileChange,
  imagePreview,
  onImagePreviewChange,
  imageUploadType,
  onImageUploadTypeChange
}) => {
  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50); // Limit slug length
  };

  // Prevent accidental page refresh when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && (formData.title.trim() || formData.content.trim())) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    if (isOpen) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isOpen, hasUnsavedChanges, formData.title, formData.content]);

  // Auto-save functionality
  const autoSave = async (data: ResourceFormData) => {
    if (!selectedPost || !data.title.trim()) return; // Only auto-save existing posts with title

    try {
      setAutoSaveStatus('saving');

      // Create a draft version of the data
      const draftData = { ...data, status: 'draft' as const };

      // Save as draft
      await onSave(draftData, imageUploadType === 'upload' ? imageFile || undefined : undefined);

      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      // Reset status after 3 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  };

  const handleInputChange = (field: keyof ResourceFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };

    // Auto-generate slug when title changes (only if slug is empty or matches previous title)
    if (field === 'title' && (!formData.slug || formData.slug === generateSlug(formData.title))) {
      updatedData.slug = generateSlug(value);
    }

    // Auto-generate SEO title if empty
    if (field === 'title' && !formData.seoTitle) {
      updatedData.seoTitle = value;
    }

    onFormDataChange(updatedData);
    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (5 seconds after user stops typing)
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave(updatedData);
    }, 5000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        return (e.returnValue = '');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleImageFileChange = (file: File | null) => {
    onImageFileChange(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImagePreviewChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onImagePreviewChange('');
    }
  };

  const handleImageUrlChange = (url: string) => {
    onFormDataChange({ ...formData, imageUrl: url });
    onImagePreviewChange(url);
  };

  const handleSubmit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required');
      return;
    }

    await onSave(formData, imageUploadType === 'upload' ? imageFile || undefined : undefined);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Check for unsaved changes
    if (hasUnsavedChanges && (formData.title.trim() || formData.content.trim())) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      );
      if (!confirmClose) {
        return;
      }
    }

    onClose();
  };

  // Prevent form submission and page refresh
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    } else if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mt-2 sm:mt-0"
        onSubmit={handleFormSubmit}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          // Prevent modal from closing when clicking inside
          e.stopPropagation();
        }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 border-b border-gray-200 space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 min-w-0">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              {selectedPost ? 'Edit Resource' : 'Create New Resource'}
            </h3>

            {/* Auto-save status */}
            {selectedPost && (
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center text-blue-600">
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                    Saving...
                  </div>
                )}
                {autoSaveStatus === 'saved' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Auto-saved
                  </div>
                )}
                {autoSaveStatus === 'error' && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Save failed
                  </div>
                )}
                {lastSaved && autoSaveStatus === 'idle' && hasUnsavedChanges && (
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Last saved: {lastSaved.toLocaleTimeString()}</span>
                    <span className="sm:hidden">Saved</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-2 flex-shrink-0">
            {onPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPreview();
                }}
                className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center text-sm"
              >
                <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter resource title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {RESOURCE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the resource..."
            />
          </div>

          {/* Image Upload */}
          <ResourceImageUpload
            imageUploadType={imageUploadType}
            onTypeChange={onImageUploadTypeChange}
            imageFile={imageFile}
            onFileChange={handleImageFileChange}
            imagePreview={imagePreview}
            onUrlChange={handleImageUrlChange}
            imageUrl={formData.imageUrl}
            uploading={false}
          />

          {/* Content Editor */}
          <div className="space-y-3 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <EditorToolbarGuide />
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <RichTextEditor
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
                placeholder="Write your resource content here..."
                height="300px"
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="tag1, tag2, tag3..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status and Read Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Read Time (minutes)
              </label>
              <input
                type="number"
                value={formData.readTime}
                onChange={(e) => handleInputChange('readTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5"
              />
            </div>
          </div>

          {/* SEO & URL Settings */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">SEO & URL Settings</h4>
              <span className="ml-2 text-sm text-gray-500">(Search Engine Optimization)</span>
            </div>

            <div className="space-y-6">
              {/* URL Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                  <span className="text-gray-500 font-normal ml-1">(Permalink)</span>
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    /resources/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      const slug = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim();
                      handleInputChange('slug', slug);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="url-friendly-slug"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  The URL slug is the user-friendly and URL-valid name of a post. It is usually all lowercase and contains only letters, numbers, and hyphens.
                </p>
                {formData.slug && (
                  <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Preview URL:</strong> /resources/{formData.slug}
                    </p>
                  </div>
                )}
              </div>

              {/* SEO Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                  <span className="text-gray-500 font-normal ml-1">(Meta Title)</span>
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="SEO optimized title for search engines..."
                  maxLength={60}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Recommended: 50-60 characters. This appears in search engine results.
                  </p>
                  <span className={`text-xs ${formData.seoTitle.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.seoTitle.length}/60
                  </span>
                </div>
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                  <span className="text-gray-500 font-normal ml-1">(Meta Description)</span>
                </label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description that appears in search engine results..."
                  maxLength={160}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Recommended: 150-160 characters. This appears below the title in search results.
                  </p>
                  <span className={`text-xs ${formData.seoDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.seoDescription.length}/160
                  </span>
                </div>
              </div>

              {/* SEO Preview */}
              {(formData.seoTitle || formData.title) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Search Engine Preview</h5>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                      {formData.seoTitle || formData.title}
                    </div>
                    <div className="text-green-600 text-sm">
                      https://example.com/resources/{formData.slug || 'resource-slug'}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {formData.seoDescription || formData.excerpt || 'No description available.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || !formData.title || !formData.content}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center order-1 sm:order-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">Saving</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{selectedPost ? 'Update Resource' : 'Create Resource'}</span>
                <span className="sm:hidden">{selectedPost ? 'Update' : 'Create'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
