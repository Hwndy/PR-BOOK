import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink, Loader, RefreshCw, Heart, MessageCircle, Share2, Filter } from 'lucide-react';

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
}

interface ResourceData {
  posts: ResourcePost[];
  profile: {
    name: string;
    title: string;
    linkedinUrl: string;
    bio: string;
  };
  meta: {
    totalPosts: number;
    lastUpdated: string;
    linkedinConnected: boolean;
  };
}

const Resources = () => {
  const navigate = useNavigate();
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'PR Measurement', 'Digital PR', 'Strategy', 'Industry Trends', 'Case Studies', 'Analytics', 'Insights'];

  useEffect(() => {
    fetchResourceData();
  }, []);

  const fetchResourceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resources/posts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResourceData(data);
    } catch (err) {
      console.error('Error in fetchResourceData:', err);
      setError('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (postId: string) => {
    navigate(`/resources/${postId}`);
  };

  const filteredPosts = resourceData?.posts.filter(post => 
    selectedCategory === 'All' || post.category === selectedCategory
  ) || [];

  if (loading) {
    return (
      <section id="resources" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading latest insights...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !resourceData) {
    return (
      <section id="resources" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              PR Resources & Insights
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchResourceData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="resources" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            PR Resources & Insights
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            Latest trends, methodologies, case studies and best practices in PR monitoring, measurement and evaluation
          </p>
          
          {/* Category Filter */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <Filter className="h-4 w-4 text-gray-500 ml-2" />
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
            <span className="text-sm text-gray-500">
              {filteredPosts.length} of {resourceData.meta.totalPosts} resources
            </span>
            <a
              href={resourceData.profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              Follow on LinkedIn
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <button
              onClick={fetchResourceData}
              disabled={loading}
              className="inline-flex items-center text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-blue-600">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.date}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Engagement metrics */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
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

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleReadMore(post.id)}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  <a
                    href={post.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                  >
                    LinkedIn
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && selectedCategory !== 'All' && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No resources found in the "{selectedCategory}" category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              View all resources
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
            <a
              href={resourceData.profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition duration-300 inline-flex items-center"
            >
              View All on LinkedIn
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
            <button
              onClick={fetchResourceData}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-8 rounded-md transition duration-300 disabled:opacity-50 inline-flex items-center"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Posts
            </button>
          </div>

          {!resourceData.meta.linkedinConnected && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Currently showing curated content. Connect LinkedIn API for real-time posts from Philip's profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Resources;
