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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUploadType, setImageUploadType] = useState<'upload' | 'url'>('url');

  useEffect(() => {
    fetchResourceStats();
  }, []);

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
      alert('Failed to load resource data');
    } finally {
      setLoading(false);
    }
  };

  const refreshResourceData = async () => {
    try {
      setRefreshing(true);

      // Refresh LinkedIn cache first
      try {
        await apiClient.request('/api/resources/refresh', {
          method: 'POST'
        });
      } catch (error) {
        console.warn('LinkedIn refresh failed, continuing with local data refresh:', error);
      }

      // Fetch updated stats
      await fetchResourceStats();

    } catch (error) {
      console.error('Error refreshing resources:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh resources';
      alert(`Error: ${errorMessage}`);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.deleteResourcePost(postId);
      await fetchResourceStats();
      alert('Resource deleted successfully!');
    } catch (error) {
      console.error('Error deleting resource post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete resource post';
      alert(`Error: ${errorMessage}`);
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

      // Validate required fields
      if (!data.title.trim() || !data.content.trim()) {
        alert('Title and content are required');
        return;
      }

      // Handle image logic properly
      let finalImageUrl = '';
      if (imageUploadType === 'url' && data.imageUrl) {
        finalImageUrl = data.imageUrl;
      } else if (imageUploadType === 'upload' && imageFile) {
        // Image file will be handled by the API
        finalImageUrl = ''; // Will be set by server
      } else if (imagePreview) {
        // Use existing preview (for edits)
        finalImageUrl = imagePreview;
      }

      const postData = {
        title: data.title.trim(),
        excerpt: data.excerpt.trim() || data.content.substring(0, 150) + '...',
        content: data.content.trim(),
        category: data.category,
        imageUrl: finalImageUrl,
        tags: data.tags,
        author: data.author || 'Philip Odiakose',
        status: data.status,
        readTime: data.readTime,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        slug: data.slug
      };

      if (selectedPost) {
        // For updates, pass the image file if uploading
        const imageFileToUpload = imageUploadType === 'upload' ? imageFile : undefined;
        await apiClient.updateResourcePost(selectedPost.id, postData, imageFileToUpload);
        alert('Resource updated successfully!');
      } else {
        // For new posts, pass the image file if uploading
        const imageFileToUpload = imageUploadType === 'upload' ? imageFile : undefined;
        await apiClient.createResourcePost(postData, imageFileToUpload);
        alert('Resource created successfully!');
      }

      await fetchResourceStats();
      setIsCreateModalOpen(false);
      setIsPreviewModalOpen(false);

    } catch (error) {
      console.error('Error saving resource post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save resource post';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resource Stats Component */}
      <ResourceStats
        stats={stats}
        loading={loading}
        refreshing={refreshing}
        onRefresh={refreshResourceData}
        onCreateNew={handleCreateNew}
      />

      {/* Resource List Component */}
      <ResourceList
        posts={stats?.posts || []}
        onEdit={handleEdit}
        onDelete={handleDeletePost}
      />

      {/* Resource Form Modal */}
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

      {/* Resource Preview Modal */}
      <ResourcePreview
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        formData={formData}
        imagePreview={imagePreview}
        onSave={() => handleSave(formData, imageUploadType === 'upload' ? imageFile || undefined : undefined)}
        saving={saving}
        selectedPost={selectedPost}
      />
    </div>
  );
};

export default ResourceManagement;