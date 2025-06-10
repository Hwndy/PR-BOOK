import React, { useState, useEffect } from 'react';
import { 
  Podcast, 
  RefreshCw, 
  ExternalLink, 
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface PodcastStats {
  totalEpisodes: number;
  lastUpdated: string;
  spotifyConnected: boolean;
  showName: string;
  showUrl: string;
}

const PodcastManagement: React.FC = () => {
  const [stats, setStats] = useState<PodcastStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPodcastStats();
  }, []);

  const fetchPodcastStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/podcast/episodes');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalEpisodes: data.episodes.length,
          lastUpdated: new Date().toISOString(),
          spotifyConnected: data.show.name !== "The PR Measurement Podcast", // Mock detection
          showName: data.show.name,
          showUrl: data.show.spotifyUrl
        });
      } else {
        // Fallback to mock stats
        setStats({
          totalEpisodes: 5,
          lastUpdated: new Date().toISOString(),
          spotifyConnected: false,
          showName: "The PR Measurement Podcast",
          showUrl: "https://open.spotify.com/show/5xnBGHhsdklfMvw0bnLp39"
        });
      }
    } catch (error) {
      console.error('Error fetching podcast stats:', error);
      // Fallback to mock stats
      setStats({
        totalEpisodes: 5,
        lastUpdated: new Date().toISOString(),
        spotifyConnected: false,
        showName: "The PR Measurement Podcast",
        showUrl: "https://open.spotify.com/show/5xnBGHhsdklfMvw0bnLp39"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshPodcastData = async () => {
    try {
      setRefreshing(true);
      await fetchPodcastStats();
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
          <h2 className="text-2xl font-bold text-gray-900">Podcast Management</h2>
          <p className="text-gray-600">Manage your podcast integration and episodes</p>
        </div>
        <button
          onClick={refreshPodcastData}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Spotify Integration</p>
              <div className="flex items-center mt-2">
                {stats?.spotifyConnected ? (
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
            <div className="p-3 rounded-full bg-green-100">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Episodes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalEpisodes || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Podcast className="h-6 w-6 text-blue-600" />
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
            <div className="p-3 rounded-full bg-purple-100">
              <RefreshCw className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Podcast Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Podcast Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Podcast Name
            </label>
            <p className="text-gray-900">{stats?.showName || 'Not available'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spotify URL
            </label>
            <div className="flex items-center space-x-2">
              <p className="text-gray-600 flex-1 truncate">{stats?.showUrl || 'Not available'}</p>
              {stats?.showUrl && (
                <a
                  href={stats.showUrl}
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
              {stats?.spotifyConnected ? (
                <div className="flex items-center text-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Connected to Spotify API</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-700">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Using mock data - Set up Spotify API for real data</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      {!stats?.spotifyConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                Spotify API Setup Required
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                To fetch real podcast data from Spotify, you need to set up Spotify API credentials.
              </p>
              <div className="text-sm text-yellow-700">
                <p className="mb-2"><strong>Steps:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Create a Spotify app at <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">developer.spotify.com</a></li>
                  <li>Get your Client ID and Client Secret</li>
                  <li>Add them to your server/.env file</li>
                  <li>Restart the server</li>
                </ol>
                <p className="mt-3">
                  <strong>Note:</strong> The podcast page works perfectly with mock data until you set up the API.
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
            href="/podcast"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Podcast className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-900">View Podcast Page</p>
              <p className="text-sm text-blue-600">See how it looks to visitors</p>
            </div>
            <ExternalLink className="h-4 w-4 text-blue-600 ml-auto" />
          </a>

          <button
            onClick={refreshPodcastData}
            disabled={refreshing}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-6 w-6 text-green-600 mr-3 ${refreshing ? 'animate-spin' : ''}`} />
            <div>
              <p className="font-medium text-green-900">Refresh Episodes</p>
              <p className="text-sm text-green-600">Update episode data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PodcastManagement;
