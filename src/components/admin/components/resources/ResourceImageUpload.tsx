import React from 'react';
import { Upload, Link, FileImage } from 'lucide-react';
import { ResourceImageUploadProps } from './types';

const ResourceImageUpload: React.FC<ResourceImageUploadProps> = ({
  imageUploadType,
  onTypeChange,
  imageFile,
  onFileChange,
  imagePreview,
  onUrlChange,
  imageUrl,
  uploading
}) => {
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onUrlChange(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resource Image *
        </label>
        
        {/* Upload Type Toggle */}
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => onTypeChange('url')}
            className={`px-4 py-2 rounded-lg border transition-colors inline-flex items-center ${
              imageUploadType === 'url'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Link className="h-4 w-4 mr-2" />
            Image URL
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('upload')}
            className={`px-4 py-2 rounded-lg border transition-colors inline-flex items-center ${
              imageUploadType === 'upload'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </button>
        </div>

        {/* URL Input */}
        {imageUploadType === 'url' && (
          <div>
            <input
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Enter image URL..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a direct link to an image (jpg, png, gif, webp)
            </p>
          </div>
        )}

        {/* File Upload */}
        {imageUploadType === 'upload' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                {imageFile ? imageFile.name : 'Click to upload an image'}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </label>
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        {uploading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-blue-600">
              <Upload className="h-4 w-4 mr-2 animate-pulse" />
              Uploading image...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceImageUpload;
