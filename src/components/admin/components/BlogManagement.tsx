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
  Save
} from 'lucide-react';

interface BlogPost {
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
}

interface BlogStats {
  totalPosts: number;
  totalEngagement: number;
  lastUpdated: string;
  posts: BlogPost[];
  profileName?: string;
  profileUrl?: string;
  linkedinConnected?: boolean;
}

const BlogManagement: React.FC = () => {
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'PR Measurement',
    image: '',
    tags: '',
    author: 'Philip Odiakose',
    status: 'published' as 'draft' | 'published'
  });
  const [saving, setSaving] = useState(false);

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
    fetchBlogStats();
  }, []);

  const fetchBlogStats = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/blog/posts');
      if (response.ok) {
        const data = await response.json();
        const totalEngagement = data.posts.reduce(
          (total: number, post: BlogPost) =>
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
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error fetching blog stats:', error);
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

  const refreshBlogData = async () => {
    try {
      setRefreshing(true);
      await fetchBlogStats();
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/blog/posts', {
        method: selectedPost ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      await fetchBlogStats();
      setIsCreateModalOpen(false);
      resetForm();

    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/blog/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      await fetchBlogStats();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Failed to delete blog post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'PR Measurement',
      image: '',
      tags: '',
      author: 'Philip Odiakose',
      status: 'published'
    });
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshBlogData}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalPosts || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Manual Posts</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats?.posts.filter(p => p.isManual).length || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Pencil className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Engagement</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats?.totalEngagement || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm text-gray-900 mt-1">
                {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
        </div>

        <div className="p-6">
          {stats?.posts && stats.posts.length > 0 ? (
            <div className="space-y-4">
              {stats.posts.slice(0, 10).map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          post.isManual
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {post.isManual ? 'Manual' : 'LinkedIn'}
                        </span>
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">{post.date}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {post.engagement.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {post.engagement.comments}
                        </div>
                        <div className="flex items-center">
                          <Share2 className="h-3 w-3 mr-1" />
                          {post.engagement.shares}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <a
                        href="/blog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="View on blog"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      {post.linkedinUrl && (
                        <a
                          href={post.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="View on LinkedIn"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {post.isManual && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setFormData({
                                title: post.title,
                                excerpt: post.excerpt,
                                content: post.content,
                                category: post.category,
                                image: post.image,
                                tags: post.tags?.join(', ') || '',
                                author: post.author,
                                status: post.status
                              });
                              setIsCreateModalOpen(true);
                            }}
                            className="text-gray-600 hover:text-gray-700 p-1"
                            title="Edit post"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete post"
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
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No blog posts found</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedPost ? 'Edit Post' : 'Create New Post'}
                </h3>
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
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter post title"
                  required
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

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
                  placeholder="Brief description of the post"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your blog post content here..."
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
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
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={saving || !formData.title || !formData.content}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? 'Saving...' : selectedPost ? 'Update Post' : 'Create Post'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Blog Management Features
            </h4>
            <div className="text-sm text-blue-700">
              <p className="mb-2">
                <strong>Manual Posts:</strong> Create and manage blog posts directly from this interface.
              </p>
              <p className="mb-2">
                <strong>LinkedIn Integration:</strong> Automatically pulls posts from Philip's LinkedIn profile.
              </p>
              <p>
                <strong>Combined Feed:</strong> Manual posts appear first, followed by LinkedIn content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;