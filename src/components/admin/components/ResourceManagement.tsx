import React, { useState, useEffect } from 'react';
import {
  FileText,
  RefreshCw,
  Calendar,
  TrendingUp,
  Pencil,
  Trash2,
  X,
  Plus,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  AlertCircle,
  Save,
  Upload,
  Image as ImageIcon,
  Link,
  User,
  Tag,
  FileImage
} from 'lucide-react';
import { apiClient } from '../../../utils/api';
import RichTextEditor from './RichTextEditor';
import EditorToolbarGuide from './EditorToolbarGuide';

interface ResourcePost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  tags?: string[];
  author: string;
  status: 'draft' | 'published';
  date: string;
  publishedAt: string;
  linkedinUrl?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  isManual?: boolean;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
}

interface ResourceStats {
  totalPosts: number;
  totalEngagement: number;
  lastUpdated: string;
  posts: ResourcePost[];
  profileName?: string;
  profileUrl?: string;
  linkedinConnected?: boolean;
}

const ResourceManagement: React.FC = () => {
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ResourcePost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'PR Measurement',
    imageUrl: '',
    tags: '',
    author: 'Philip Odiakose',
    status: 'published' as 'draft' | 'published',
    readTime: '',
    seoTitle: '',
    seoDescription: '',
    slug: ''
  });
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUploadType, setImageUploadType] = useState<'upload' | 'url'>('url');
  const [uploading, setUploading] = useState(false);

  const categories = [
    'PR Measurement',
    'Digital PR',
    'Strategy',
    'Industry Trends',
    'Case Studies',
    'Analytics',
    'Insights'
  ];

  useEffect(() => {
    fetchResourceStats();
  }, []);

  useEffect(() => {
    // Generate slug from title
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  useEffect(() => {
    // Estimate read time (average 200 words per minute)
    if (formData.content) {
      const wordCount = formData.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);
      setFormData(prev => ({ ...prev, readTime: readTime.toString() }));
    }
  }, [formData.content]);

  const fetchResourceStats = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getResourcePosts();
      
      const totalEngagement = data.posts.reduce(
        (total: number, post: ResourcePost) =>
          total + post.engagement.likes + post.engagement.comments + post.engagement.shares,
        0
      );

      setStats({
        totalPosts: data.posts.length,
        totalEngagement,
        lastUpdated: data.meta.lastUpdated,
        posts: data.posts,
        profileName: data.profile?.name,
        profileUrl: data.profile?.linkedinUrl,
        linkedinConnected: data.meta?.linkedinConnected,
      });
    } catch (error) {
      console.error('Error fetching resource stats:', error);
      setStats({
        totalPosts: 0,
        totalEngagement: 0,
        lastUpdated: new Date().toISOString(),
        posts: [],
        profileName: 'Philip Odiakose',
        profileUrl: 'https://www.linkedin.com/in/philipodiakose/',
        linkedinConnected: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshResourceData = async () => {
    try {
      setRefreshing(true);
      await fetchResourceStats();
    } finally {
      setRefreshing(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await apiClient.uploadResourceImage(formData);
      return response.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleCreatePost = async () => {
    try {
      setSaving(true);

      const postData = {
        ...formData,
        imageUrl: imageUploadType === 'url' ? formData.imageUrl : '',
        tags: formData.tags
      };

      if (selectedPost) {
        // For updates, pass the image file if uploading
        const imageFileToUpload = imageUploadType === 'upload' ? imageFile : undefined;
        await apiClient.updateResourcePost(selectedPost.id, postData, imageFileToUpload);
      } else {
        // For new posts, pass the image file if uploading
        const imageFileToUpload = imageUploadType === 'upload' ? imageFile : undefined;
        await apiClient.createResourcePost(postData, imageFileToUpload);
      }

      await fetchResourceStats();
      setIsCreateModalOpen(false);
      resetForm();

    } catch (error) {
      console.error('Error saving resource post:', error);
      alert('Failed to save resource post');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      await apiClient.deleteResourcePost(postId);
      await fetchResourceStats();
    } catch (error) {
      console.error('Error deleting resource post:', error);
      alert('Failed to delete resource post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'PR Measurement',
      imageUrl: '',
      tags: '',
      author: 'Philip Odiakose',
      status: 'published',
      readTime: '',
      seoTitle: '',
      seoDescription: '',
      slug: ''
    });
    setSelectedPost(null);
    setImageFile(null);
    setImagePreview('');
    setImageUploadType('url');
  };

  const openEditModal = (post: ResourcePost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.image,
      tags: post.tags?.join(', ') || '',
      author: post.author,
      status: post.status,
      readTime: post.readTime?.toString() || '',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      slug: post.slug || ''
    });
    setImagePreview(post.image);
    setIsCreateModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading resource management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
          <p className="text-gray-600">Create and manage PR resources and insights</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Resource
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalPosts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalEngagement || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm text-gray-900">
                {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ExternalLink className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">LinkedIn Status</p>
              <p className={`text-sm font-medium ${stats?.linkedinConnected ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.linkedinConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={refreshResourceData}
            disabled={refreshing}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Resources</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {stats?.posts.map((post) => (
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
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Manual</span>
                      </>
                    )}
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h4>
                  <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
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
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => window.open(`/resources/${post.id}`, '_blank')}
                    className="text-gray-600 hover:text-gray-700 p-1"
                    title="View resource"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {post.isManual && (
                    <>
                      <button
                        onClick={() => openEditModal(post)}
                        className="text-gray-600 hover:text-gray-700 p-1"
                        title="Edit resource"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete resource"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedPost ? 'Edit Resource' : 'Create New Resource'}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handlePreview}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter resource title"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Author name"
                  />
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Auto-calculated"
                    min="1"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the resource"
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <EditorToolbarGuide />
                </div>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your resource content here... Use the toolbar above to format text, add images, links, and more."
                  height="400px"
                />
              </div>

              {/* Image Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>

                {/* Image Type Toggle */}
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setImageUploadType('url')}
                    className={`flex items-center px-4 py-2 rounded-lg border ${
                      imageUploadType === 'url'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadType('upload')}
                    className={`flex items-center px-4 py-2 rounded-lg border ${
                      imageUploadType === 'upload'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </button>
                </div>

                {/* Image URL Input */}
                {imageUploadType === 'url' && (
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
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
                      <p className="text-sm text-gray-600">
                        Click to upload an image or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
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
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>

              {/* SEO Section */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h4>

                <div className="space-y-4">
                  {/* SEO Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO optimized title"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60 characters</p>
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO meta description"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160 characters</p>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="url-friendly-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated from title</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={saving || uploading || !formData.title || !formData.content}
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
                    {selectedPost ? 'Update Resource' : 'Create Resource'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Preview Resource</h3>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Preview Content */}
              <article className="max-w-none">
                {/* Hero Image */}
                {imagePreview && (
                  <div className="relative h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    {formData.category}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {formData.author}
                  </div>
                  {formData.readTime && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {formData.readTime} min read
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {formData.title || 'Resource Title'}
                </h1>

                {/* Excerpt */}
                {formData.excerpt && (
                  <div className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-blue-500 pl-6 italic">
                    {formData.excerpt}
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-8">
                  <div
                    className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                  >
                    {formData.content || 'Resource content will appear here...'}
                  </div>
                </div>

                {/* Tags */}
                {formData.tags && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO Preview */}
                {(formData.seoTitle || formData.seoDescription) && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">SEO Preview</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-blue-600 text-lg font-medium mb-1">
                        {formData.seoTitle || formData.title}
                      </div>
                      <div className="text-green-600 text-sm mb-2">
                        https://thescienceofpublicrelations.com/resources/{formData.slug || 'resource-slug'}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {formData.seoDescription || formData.excerpt || 'SEO description will appear here...'}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            </div>

            {/* Preview Footer */}
            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  handleCreatePost();
                }}
                disabled={saving || uploading || !formData.title || !formData.content}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {selectedPost ? 'Update Resource' : 'Publish Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
