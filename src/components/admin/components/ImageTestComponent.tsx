import React, { useState } from 'react';

interface ImageTestComponentProps {
  imageUrl: string;
  onLoadSuccess?: () => void;
  onLoadError?: (error: string) => void;
}

const ImageTestComponent: React.FC<ImageTestComponentProps> = ({
  imageUrl,
  onLoadSuccess,
  onLoadError
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setLoaded(true);
    setError(null);
    onLoadSuccess?.();
  };

  const handleError = () => {
    setLoading(false);
    setLoaded(false);
    const errorMsg = `Failed to load image: ${imageUrl}`;
    setError(errorMsg);
    onLoadError?.(errorMsg);
  };

  if (!imageUrl) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded">
        <p className="text-red-600">No image URL provided</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded">
      <div className="mb-2">
        <strong>Image URL:</strong> 
        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
          {imageUrl}
        </a>
      </div>
      
      {loading && (
        <div className="text-blue-600">Loading image...</div>
      )}
      
      {error && (
        <div className="text-red-600 mb-2">{error}</div>
      )}
      
      {loaded && (
        <div className="text-green-600 mb-2">✓ Image loaded successfully</div>
      )}
      
      <img
        src={imageUrl}
        alt="Test image"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          maxWidth: '200px',
          maxHeight: '200px',
          border: '1px solid #ccc',
          display: loading ? 'none' : 'block'
        }}
      />
    </div>
  );
};

export default ImageTestComponent;
