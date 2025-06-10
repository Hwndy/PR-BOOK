import React, { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, Loader, RefreshCw, Heart, MessageCircle, Share2 } from 'lucide-react';

interface BlogPost {
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

interface BlogData {
  posts: BlogPost[];
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

const Blog = () => {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try backend API first, then fallback to mock data
      let response;
      try {
        response = await fetch('http://localhost:5000/api/blog/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlogData(data);
        return;
      } catch (apiError) {
        console.log('Backend API not available, using fallback data:', apiError.message);
        // Continue to fallback data below
      }
      // Fallback to mock data
      setBlogData({
        posts: [
          {
            id: "1",
            title: "The Evolution of PR Measurement: Beyond AVE",
            excerpt: "How modern PR measurement has moved beyond traditional advertising value equivalents to more sophisticated metrics.",
            content: "In today's digital landscape, PR measurement has evolved far beyond simple media mentions and advertising value equivalents (AVE).",
            category: "Industry Trends",
            date: "March 15, 2024",
            publishedAt: new Date().toISOString(),
            linkedinUrl: "https://www.linkedin.com/in/philipodiakose/",
            image: "https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg",
            engagement: { likes: 45, comments: 12, shares: 8 }
          },
          {
            id: "2",
            title: "Sentiment Analysis: Understanding the Emotional Impact of Coverage",
            excerpt: "A deep dive into how AI-powered sentiment analysis is revolutionizing PR measurement and evaluation.",
            content: "Modern sentiment analysis tools powered by AI and machine learning provide unprecedented insights.",
            category: "Digital PR",
            date: "March 8, 2024",
            publishedAt: new Date().toISOString(),
            linkedinUrl: "https://www.linkedin.com/in/philipodiakose/",
            image: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg",
            engagement: { likes: 67, comments: 18, shares: 15 }
          },
          {
            id: "3",
            title: "Measuring Social Media Impact: Beyond Likes and Shares",
            excerpt: "Advanced strategies for quantifying the true impact of your social media communications efforts.",
            content: "Social media measurement requires sophisticated approaches that go beyond vanity metrics.",
            category: "Strategy",
            date: "March 1, 2024",
            publishedAt: new Date().toISOString(),
            linkedinUrl: "https://www.linkedin.com/in/philipodiakose/",
            image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
            engagement: { likes: 89, comments: 24, shares: 19 }
          }
        ],
        profile: {
          name: "Philip Odiakose",
          title: "PR Measurement & Analytics Expert",
          linkedinUrl: "https://www.linkedin.com/in/philipodiakose/",
          bio: "Expert in PR measurement, analytics, and evaluation with extensive experience in data-driven communication strategies."
        },
        meta: {
          totalPosts: 3,
          lastUpdated: new Date().toISOString(),
          linkedinConnected: false
        }
      });
    } catch (err) {
      console.error('Error in fetchBlogData:', err);
      setError('Failed to load blog posts. Using fallback data.');

      // Minimal fallback if everything fails
      setBlogData({
        posts: [
          {
            id: "1",
            title: "The Evolution of PR Measurement: Beyond AVE",
            excerpt: "How modern PR measurement has moved beyond traditional advertising value equivalents to more sophisticated metrics.",
            content: "In today's digital landscape, PR measurement has evolved far beyond simple media mentions.",
            category: "Industry Trends",
            date: "March 15, 2024",
            publishedAt: new Date().toISOString(),
            linkedinUrl: "https://www.linkedin.com/in/philipodiakose/",
            image: "https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg",
            engagement: { likes: 45, comments: 12, shares: 8 }
          }
        ],
        profile: {
          name: "Philip Odiakose",
          title: "PR Measurement & Analytics Expert",
          linkedinUrl: "https://www.linkedin.com/in/philipodiakose/",
          bio: "Expert in PR measurement, analytics, and evaluation."
        },
        meta: {
          totalPosts: 1,
          lastUpdated: new Date().toISOString(),
          linkedinConnected: false
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-white">
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

  if (error || !blogData) {
    return (
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              PR Measurement Insights
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBlogData}
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
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            PR Measurement Insights
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-4">
            Latest trends, methodologies, case studies and best practices in PR monitoring, measurement and evaluation
          </p>
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
            <span className="text-sm text-gray-500">
              {blogData.meta.totalPosts} articles from LinkedIn
            </span>
            <a
              href={blogData.profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              Follow on LinkedIn
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <button
              onClick={fetchBlogData}
              disabled={loading}
              className="inline-flex items-center text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData.posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
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
                  <a
                    href={post.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                  >
                    Read on LinkedIn
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
            <a
              href={blogData.profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition duration-300 inline-flex items-center"
            >
              View All on LinkedIn
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
            <button
              onClick={fetchBlogData}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-8 rounded-md transition duration-300 disabled:opacity-50 inline-flex items-center"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Posts
            </button>
          </div>

          {!blogData.meta.linkedinConnected && (
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

export default Blog;