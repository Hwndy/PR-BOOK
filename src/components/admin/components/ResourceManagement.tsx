import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/api';
import ResourceStats from './resources/ResourceStats';
import ResourceList from './resources/ResourceList';
import ResourceForm from './resources/ResourceForm';
import ResourcePreview from './resources/ResourcePreview';
import {
  ResourcePost,
  ResourceStats as ResourceStatsType,
  ResourceFormData
} from './resources/types';

interface ResourceAPIResponse {
  posts: ResourcePost[];
  meta: {
    lastUpdated?: string;
    linkedinConnected?: boolean;
  };
  profile?: {
    name?: string;
    linkedinUrl?: string;
  };
}

const ResourceManagement: React.FC = () => {
  const [stats, setStats] = useState<ResourceStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ResourcePost | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>({
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
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUploadType, setImageUploadType] = useState<'upload' | 'url'>('url');

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const isAuthenticated = await apiClient.checkAuthStatus();
        if (!isAuthenticated) {
          alert('Authentication required. Please log in again.');
          return;
        }

        await fetchResourceStats();
      } catch (error) {
        console.error('Initialization failed:', error);
        alert('Failed to load resource management.');
      }
    };

    initializeComponent();
  }, []);

  const fetchResourceStats = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getResourcePosts({ all: true }) as ResourceAPIResponse;
      // const data = await apiClient.getResourcePosts({ all: true });


      if (!data || !Array.isArray(data.posts)) {
        throw new Error('Invalid response format from server');
      }

      const totalEngagement = data.posts.reduce(
        (total, post) =>
          total + (post.engagement?.likes ?? 0) +
          (post.engagement?.comments ?? 0) +
          (post.engagement?.shares ?? 0),
        0
        
      );

      setStats({
        totalPosts: data.posts.length,
        totalEngagement,
        lastUpdated: data.meta?.lastUpdated || new Date().toISOString(),
        posts: data.posts,
        profileName: data.profile?.name,
        profileUrl: data.profile?.linkedinUrl,
        linkedinConnected: data.meta?.linkedinConnected || false,
      });
    } catch (error) {
      console.error('Error fetching resource stats:', error);
      alert('Failed to load resource data.');
    } finally {
      setLoading(false);
    }
  };

  const refreshResourceData = async () => {
    try {
      setRefreshing(true);
      try {
        await apiClient.request('/api/resources/refresh', { method: 'POST' });
      } catch (error) {
        console.warn('LinkedIn refresh failed:', error);
      }
      await fetchResourceStats();
    } catch (error) {
      console.error('Error refreshing resources:', error);
      alert('Error refreshing resources.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await apiClient.deleteResourcePost(postId);
      await fetchResourceStats();
      alert('Resource deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete resource.');
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
    setImageFile(null);
    setImagePreview('');
    setImageUploadType('url');
  };

  const handleCreateNew = () => {
    setSelectedPost(null);
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEdit = (post: ResourcePost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || '',
      imageUrl: post.image || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      author: post.author || 'Philip Odiakose',
      status: post.status || 'published',
      readTime: post.readTime?.toString() || '',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      slug: post.slug || ''
    });
    setImagePreview(post.image || '');
    setImageFile(null);
    setImageUploadType('url');
    setIsCreateModalOpen(true);
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleSave = async (data: ResourceFormData, imageFile?: File) => {
    try {
      setSaving(true);
      if (!data.title.trim() || !data.content.trim()) {
        alert('Title and content are required.');
        return;
      }

      let finalImageUrl = '';
      if (imageUploadType === 'url' && data.imageUrl) {
        finalImageUrl = data.imageUrl;
      } else if (imageUploadType === 'upload' && imageFile) {
        finalImageUrl = ''; // will be handled by server
      } else if (imagePreview) {
        finalImageUrl = imagePreview;
      }

      const postData = {
        title: data.title.trim(),
        excerpt: data.excerpt.trim() || data.content.substring(0, 150) + '...',
        content: data.content.trim(),
        category: data.category,
        image: finalImageUrl, // ✅ important fix
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        author: data.author || 'Philip Odiakose',
        status: data.status,
        readTime: data.readTime,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        slug: data.slug
      };

      const imageFileToUpload = imageUploadType === 'upload' ? imageFile : undefined;

      if (selectedPost) {
        await apiClient.updateResourcePost(selectedPost.id, postData, imageFileToUpload);
        showNotification('success', 'Resource updated successfully!');
      } else {
        await apiClient.createResourcePost(postData, imageFileToUpload);
        showNotification('success', 'Resource created successfully!');
      }

      resetForm();
      setIsCreateModalOpen(false);
      setIsPreviewModalOpen(false);
      await fetchResourceStats();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save resource.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <ResourceStats
        stats={stats}
        loading={loading}
        refreshing={refreshing}
        onRefresh={refreshResourceData}
        onCreateNew={handleCreateNew}
      />

      <ResourceList
        posts={stats?.posts || []}
        onEdit={handleEdit}
        onDelete={handleDeletePost}
      />

      <ResourceForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSave}
        selectedPost={selectedPost}
        saving={saving}
        onPreview={handlePreview}
        formData={formData}
        onFormDataChange={setFormData}
        imageFile={imageFile}
        onImageFileChange={setImageFile}
        imagePreview={imagePreview}
        onImagePreviewChange={setImagePreview}
        imageUploadType={imageUploadType}
        onImageUploadTypeChange={setImageUploadType}
      />

      <ResourcePreview
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        formData={formData}
        imagePreview={imagePreview}
        onSave={() => handleSave(formData, imageUploadType === 'upload' ? imageFile || undefined : undefined)}
        saving={saving}
        selectedPost={selectedPost}
      />

      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
