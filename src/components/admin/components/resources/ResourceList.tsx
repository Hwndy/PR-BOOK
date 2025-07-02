import React, { useState } from 'react';
import {
  Pencil,
  Trash2,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  User,
  Tag,
  Copy,
  Check,
  Link
} from 'lucide-react';
import { ResourceListProps } from './types';

const ResourceList: React.FC<ResourceListProps> = ({
  posts,
  onEdit,
  onDelete
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const generateResourceUrl = (post: any): string => {
    const baseUrl = window.location.origin;
    const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    return `${baseUrl}/resources/${slug}`;
  };

  const copyToClipboard = async (url: string, postId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(postId);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedUrl(postId);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Resources</h3>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-500">No resources found. Create your first resource to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Resources</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {posts.map((post) => (
          <div key={post.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-blue-600">{post.category}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                  {post.isManual && (
                    <>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Manual
                      </span>
                    </>
                  )}
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h4>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Author and Read Time */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  {post.readTime && (
                    <span>{post.readTime} min read</span>
                  )}
                </div>

                {/* Resource URL */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Link className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate">
                        {generateResourceUrl(post)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={() => copyToClipboard(generateResourceUrl(post), post.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Copy URL"
                      >
                        {copiedUrl === post.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <a
                        href={generateResourceUrl(post)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.engagement.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.engagement.comments}
                  </div>
                  <div className="flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    {post.engagement.shares}
                  </div>
                  {post.linkedinUrl && (
                    <a
                      href={post.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {/* Image */}
              {post.image && (
                <div className="ml-6 flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => onEdit(post)}
                className="text-blue-600 hover:text-blue-700 p-1"
                title="Edit resource"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="text-red-600 hover:text-red-700 p-1"
                title="Delete resource"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
