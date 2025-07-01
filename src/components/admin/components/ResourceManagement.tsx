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
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalEngagement: number;
  averageReadTime: number;
  topCategories: Array<{ name: string; count: number }>;
  recentActivity: Array<{ action: string; post: string; date: string }>;
  linkedinIntegration?: {
    connected: boolean;
    lastSync: string;
    postsImported: number;
  };
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
    category: 'PR Strategy',
    tags: '',
    author: 'Philip Odiakose',
    status: 'published' as 'draft' | 'published',
    readTime: '',
    seoTitle: '',
    seoDescription: '',
    slug: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [posts, setPosts] = useState<ResourcePost[]>([]);

  useEffect(() => {
    fetchStats();
    fetchPosts();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/resources/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get('/api/resources/posts');
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'PR Strategy',
      tags: '',
      author: 'Philip Odiakose',
      status: 'published',
      readTime: '',
      seoTitle: '',
      seoDescription: '',
      slug: ''
    });
    setImageFile(null);
    setImagePreview('');
    setSelectedPost(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seoTitle: title
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resources/upload-image`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setImagePreview(data.imageUrl);
        return data.imageUrl;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      return null;
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
      
      let imageUrl = imagePreview;
      if (imageFile && !imagePreview) {
        imageUrl = await handleImageUpload(imageFile);
        if (!imageUrl) return;
      }

      const postData = {
        ...formData,
        image: imageUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        readTime: formData.readTime ? parseInt(formData.readTime) : undefined,
        seo: {
          title: formData.seoTitle || formData.title,
          description: formData.seoDescription || formData.excerpt,
          slug: formData.slug || generateSlug(formData.title)
        }
      };

      const endpoint = selectedPost 
        ? `/api/resources/posts/${selectedPost.id}`
        : '/api/resources/posts';
      
      const method = selectedPost ? 'PUT' : 'POST';

      const response = await apiClient.request({
        method,
        url: endpoint,
        data: postData
      });

      if (response.data) {
        alert(selectedPost ? 'Resource updated successfully!' : 'Resource created successfully!');
        setIsCreateModalOpen(false);
        resetForm();
        fetchStats();
        fetchPosts();
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save resource');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: ResourcePost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
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

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      await apiClient.delete(`/api/resources/posts/${postId}`);
      alert('Resource deleted successfully!');
      fetchStats();
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete resource');
    }
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
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEngagement.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Resources</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={post.image}
                          alt={post.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.excerpt.substring(0, 60)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter resource title"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        handleImageUpload(file);
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload image</p>
                    </div>
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setImagePreview('');
                          setImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Category and Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PR Strategy">PR Strategy</option>
                    <option value="Media Relations">Media Relations</option>
                    <option value="Crisis Communication">Crisis Communication</option>
                    <option value="Digital PR">Digital PR</option>
                    <option value="Measurement & Analytics">Measurement & Analytics</option>
                    <option value="Thought Leadership">Thought Leadership</option>
                  </select>
                </div>
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

              {/* Tags and Read Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., PR, Strategy, Analytics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5"
                    min="1"
                  />
                </div>
              </div>

              {/* SEO Fields */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">SEO Settings</h4>
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO meta description"
                  />
                </div>
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
                </div>
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
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200">
              <button
                onClick={handlePreview}
                className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
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
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Preview Resource</h3>
                <p className="text-sm text-gray-600 mt-1">See how your resource will appear to readers</p>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                {/* Preview Content */}
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
                      className="text-gray-800 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formData.content || '<p class="text-gray-500 italic">Resource content will appear here...</p>'
                      }}
                    />
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
