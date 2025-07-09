import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, Heart,
  MessageCircle, Share2, Calendar, User, Tag, Loader
} from 'lucide-react';
import SEOHead from './SEOHead';

interface ResourcePost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  publishedAt: string;
  linkedinUrl: string;
  image: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  author?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
}

const ResourcePost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<ResourcePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchPost(id);
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resources/posts/${postId}`);
      if (!res.ok) throw new Error('Failed to load resource');

      const data = await res.json();
      if (!data?.post) throw new Error('Invalid data structure');

      setPost({
        ...data.post,
        engagement: data.post.engagement ?? { likes: 0, comments: 0, shares: 0 },
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/resources');

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Resource Not Found</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={handleBack}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        image={post.image}
        url={`/resources/${post.slug || post.id}`}
        type="article"
        author={post.author}
        publishedTime={post.publishedAt}
        tags={post.tags}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-700 flex items-center mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </button>
          </div>
        </div>

        {/* Main Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 lg:h-96">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
                }
              />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
            </div>

            <div className="p-6 md:p-8 lg:p-12">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.publishedAt || post.date)}
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {post.category}
                </div>
                {post.author && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              <div className="text-xl text-gray-600 mb-8 italic pl-6 border-l-4 border-blue-500">
                {post.excerpt}
              </div>

              {/* Engagement */}
              <div className="flex items-center gap-6 border-b pb-6 mb-8 text-gray-600">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  {post.engagement.likes} likes
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                  {post.engagement.comments} comments
                </div>
                <div className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2 text-green-500" />
                  {post.engagement.shares} shares
                </div>
              </div>

              {/* Main Content */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: post.content || '',
                }}
              />

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-10 border-t">
                <a
                  href={post.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  View on LinkedIn
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Share Article
                  <Share2 className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default ResourcePost;
