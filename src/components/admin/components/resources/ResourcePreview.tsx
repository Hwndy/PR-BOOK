import React from 'react';
import { X, Save, RefreshCw, Calendar, User, Tag, Clock } from 'lucide-react';
import { ResourcePreviewProps } from './types';

const ResourcePreview: React.FC<ResourcePreviewProps> = ({
  isOpen,
  onClose,
  formData,
  imagePreview,
  onSave,
  saving,
  selectedPost
}) => {
  if (!isOpen) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Preview Resource</h3>
            <p className="text-sm text-gray-600 mt-1">See how your resource will appear to readers</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <article className="max-w-none">
              {/* Hero Image with Fixed Dimensions */}
              {imagePreview && (
                <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '16/9' }}
                    />
                  </div>
                </div>
              )}

              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {formData.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {formData.title || 'Untitled Resource'}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {formData.author || 'Philip Odiakose'}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(new Date())}
                </div>
                {formData.readTime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {formData.readTime} min read
                  </div>
                )}
              </div>

              {/* Excerpt */}
              {formData.excerpt && (
                <div className="text-xl text-gray-700 mb-8 leading-relaxed font-light italic border-l-4 border-blue-500 pl-6">
                  {formData.excerpt}
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ 
                  __html: formData.content || '<p>No content provided.</p>' 
                }}
              />

              {/* Tags */}
              {formData.tags && (
                <div className="flex items-center space-x-2 mb-8">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Information (for preview only) */}
              {(formData.seoTitle || formData.seoDescription) && (
                <div className="bg-gray-50 rounded-lg p-6 mt-8">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">SEO Preview</h4>
                  <div className="space-y-2">
                    <div className="text-blue-600 text-lg font-medium">
                      {formData.seoTitle || formData.title}
                    </div>
                    <div className="text-green-600 text-sm">
                      example.com/resources/{formData.slug || 'resource-slug'}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {formData.seoDescription || formData.excerpt || 'No description provided.'}
                    </div>
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close Preview
          </button>
          <button
            onClick={() => {
              onClose();
              onSave();
            }}
            disabled={saving || !formData.title || !formData.content}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {selectedPost ? 'Update Resource' : 'Publish Resource'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcePreview;
