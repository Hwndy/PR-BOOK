import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  RefreshCw, 
  ExternalLink, 
  Settings,
  CheckCircle,
  AlertCircle,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  linkedinUrl: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface BlogStats {
  totalPosts: number;
  totalEngagement: number;
  lastUpdated: string;
  linkedinConnected: boolean;
  profileName: string;
  profileUrl: string;
  posts: BlogPost[];
}

const BlogManagement: React.FC = () => {
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBlogStats();
  }, []);

  const fetchBlogStats = async () => {
    try {
      setLoading(true);

      // Try backend API first
      try {
        const response = await fetch('http://localhost:5000/api/blog/posts');
        if (response.ok) {
          const data = await response.json();

          const totalEngagement = data.posts.reduce((total: number, post: BlogPost) =>
            total + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0
          );

          setStats({
            totalPosts: data.posts.length,
            totalEngagement,
            lastUpdated: data.meta.lastUpdated,
            linkedinConnected: data.meta.linkedinConnected,
            profileName: data.profile.name,
            profileUrl: data.profile.linkedinUrl,
            posts: data.posts.slice(0, 5) // Show only latest 5 posts
          });
          return;
        }
      } catch (apiError) {
        console.log('Backend API not available, using fallback stats');
      }

      // Fallback stats
      setStats({
        totalPosts: 6,
        totalEngagement: 450,
        lastUpdated: new Date().toISOString(),
        linkedinConnected: false,
        profileName: 'Philip Odiakose',
        profileUrl: 'https://www.linkedin.com/in/philipodiakose/',
        posts: []
      });
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      // Fallback stats
      setStats({
        totalPosts: 6,
        totalEngagement: 450,
        lastUpdated: new Date().toISOString(),
        linkedinConnected: false,
        profileName: 'Philip Odiakose',
        profileUrl: 'https://www.linkedin.com/in/philipodiakose/',
        posts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshBlogData = async () => {
    try {
      setRefreshing(true);
      // Call refresh endpoint
      try {
        await fetch('http://localhost:5000/api/blog/refresh', { method: 'POST' });
      } catch (error) {
        console.log('Refresh endpoint not available');
      }
      await fetchBlogStats();
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setRefreshing(false);
    }
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
          <p className="text-gray-600">Manage LinkedIn content integration and blog posts</p>
        </div>
        <button
          onClick={refreshBlogData}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Content'}</span>
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">LinkedIn Integration</p>
              <div className="flex items-center mt-2">
                {stats?.linkedinConnected ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-yellow-700 font-medium">Mock Data</span>
                  </>
                )}
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalPosts || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Engagement</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalEngagement || 0}</p>
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
                {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">LinkedIn Profile</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Name
            </label>
            <p className="text-gray-900">{stats?.profileName || 'Not available'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL
            </label>
            <div className="flex items-center space-x-2">
              <p className="text-gray-600 flex-1 truncate">{stats?.profileUrl || 'Not available'}</p>
              {stats?.profileUrl && (
                <a
                  href={stats.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Integration Status
            </label>
            <div className="flex items-center space-x-2">
              {stats?.linkedinConnected ? (
                <div className="flex items-center text-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Connected to LinkedIn API</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-700">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Using curated content - Set up LinkedIn API for real-time posts</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
        
        {stats?.posts && stats.posts.length > 0 ? (
          <div className="space-y-4">
            {stats.posts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
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
                  
                  <a
                    href={post.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No posts available</p>
        )}
      </div>

      {/* Setup Instructions */}
      {!stats?.linkedinConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                LinkedIn API Setup Required
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                To fetch real posts from Philip's LinkedIn profile, you need to set up LinkedIn API credentials.
              </p>
              <div className="text-sm text-yellow-700">
                <p className="mb-2"><strong>Steps:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Create a LinkedIn app at <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="underline">LinkedIn Developers</a></li>
                  <li>Get your access token</li>
                  <li>Add it to your server/.env file</li>
                  <li>Restart the server</li>
                </ol>
                <p className="mt-3">
                  <strong>Note:</strong> The blog page works perfectly with curated content until you set up the API.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-900">View Blog Page</p>
              <p className="text-sm text-blue-600">See how it looks to visitors</p>
            </div>
            <ExternalLink className="h-4 w-4 text-blue-600 ml-auto" />
          </a>

          <button
            onClick={refreshBlogData}
            disabled={refreshing}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-6 w-6 text-green-600 mr-3 ${refreshing ? 'animate-spin' : ''}`} />
            <div>
              <p className="font-medium text-green-900">Refresh Content</p>
              <p className="text-sm text-green-600">Update blog posts</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
