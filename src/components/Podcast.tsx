import React, { useState, useEffect } from 'react';
import { Play, AlignJustify as Spotify, Headphones, Mic, ExternalLink, Loader, RefreshCw } from 'lucide-react';

interface Episode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  spotifyUrl: string;
  imageUrl?: string;
  audioPreviewUrl?: string;
}

interface PodcastShow {
  name: string;
  description: string;
  imageUrl?: string;
  spotifyUrl: string;
  totalEpisodes: number;
}

interface PodcastData {
  show: PodcastShow;
  episodes: Episode[];
}

const Podcast = () => {
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPodcastData();
  }, []);

  const fetchPodcastData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use relative path - will be proxied to backend
      const response = await fetch('/api/podcast/episodes');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPodcastData(data);
    } catch (err) {
      console.error('Error fetching podcast data:', err);
      setError('Failed to load podcast episodes. Using mock data.');

      // Fallback to mock data
      setPodcastData({
        show: {
          name: "The PR Measurement Podcast",
          description: "Weekly insights on PR measurement, analytics, and evaluation strategies from Philip Odiakose",
          imageUrl: "/api/placeholder/300/300",
          spotifyUrl: "https://open.spotify.com/show/5xnBGHhsdklfMvw0bnLp39",
          totalEpisodes: 25
        },
        episodes: [
          {
            id: "1",
            title: "Measuring PR Success in the Digital Age",
            description: "Learn how to effectively measure and evaluate PR campaigns in today's digital landscape. We explore key metrics, tools, and methodologies that modern PR professionals need to demonstrate value and ROI.",
            date: "March 15, 2024",
            duration: "45 min",
            spotifyUrl: "https://open.spotify.com/show/5xnBGHhsdklfMvw0bnLp39",
            imageUrl: "/api/placeholder/300/300",
            audioPreviewUrl: null
          },
          {
            id: "2",
            title: "The Future of PR Analytics",
            description: "Exploring emerging trends and technologies in PR measurement and evaluation. From AI-powered sentiment analysis to predictive analytics, discover what's next for PR measurement.",
            date: "March 8, 2024",
            duration: "38 min",
            spotifyUrl: "https://open.spotify.com/show/5xnBGHhsdklfMvw0bnLp39",
            imageUrl: "/api/placeholder/300/300",
            audioPreviewUrl: null
          },
          {
            id: "3",
            title: "Data-Driven PR Strategies",
            description: "How to use data analytics to inform and optimize your PR strategies. Learn practical approaches to collecting, analyzing, and acting on PR data to improve campaign performance.",
            date: "March 1, 2024",
            duration: "42 min",
            spotifyUrl: "https://open.spotify.com/show/5xnBGHhsdklfMvw0bnLp39",
            imageUrl: "/api/placeholder/300/300",
            audioPreviewUrl: null
          },
          {
            id: "4",
            title: "Building PR Dashboards That Matter",
            description: "Creating meaningful PR dashboards and reports that stakeholders actually use. Tips for visualization, key metrics selection, and storytelling with data.",
            date: "February 22, 2024",
            duration: "35 min",
            spotifyUrl: "https://open.spotify.com/show/5xnBGHhsdklfMvw0bnLp39",
            imageUrl: "/api/placeholder/300/300",
            audioPreviewUrl: null
          },
          {
            id: "5",
            title: "Crisis Communication Measurement",
            description: "How to measure and evaluate crisis communication efforts. Understanding sentiment shifts, reach analysis, and reputation recovery metrics during challenging times.",
            date: "February 15, 2024",
            duration: "52 min",
            spotifyUrl: "https://open.spotify.com/show/5xnBGHhsdklfMvw0bnLp39",
            imageUrl: "/api/placeholder/300/300",
            audioPreviewUrl: null
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading podcast episodes...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !podcastData) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              The PR Measurement Podcast
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPodcastData}
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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {podcastData.show.name}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            {podcastData.show.description}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 flex-wrap gap-2">
            <span className="text-sm text-gray-500">
              {podcastData.show.totalEpisodes} episodes available
            </span>
            <a
              href={podcastData.show.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <Spotify className="h-4 w-4 mr-1" />
              Listen on Spotify
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <button
              onClick={fetchPodcastData}
              disabled={loading}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh Episodes
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <div className="space-y-6">
              {podcastData.episodes.map((episode) => (
                <div key={episode.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    {episode.imageUrl && (
                      <img
                        src={episode.imageUrl}
                        alt={episode.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{episode.date}</span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Headphones className="h-4 w-4 mr-1" />
                          {episode.duration}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{episode.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{episode.description}</p>
                      <div className="flex items-center space-x-4">
                        <a
                          href={episode.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700 transition duration-300"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Listen on Spotify
                        </a>
                        {episode.audioPreviewUrl && (
                          <button className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300">
                            <Headphones className="h-5 w-5 mr-2" />
                            Preview
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-6">Listen On</h3>
              <div className="space-y-4">
                <a
                  href={podcastData.show.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-300 border border-green-200"
                >
                  <Spotify className="h-6 w-6 mr-3 text-green-600" />
                  <div className="flex-1">
                    <span className="font-medium text-green-800">Spotify</span>
                    <p className="text-sm text-green-600">Listen to all episodes</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-green-600" />
                </a>
                <a
                  href="#"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 opacity-75"
                >
                  <Mic className="h-6 w-6 mr-3 text-gray-600" />
                  <div className="flex-1">
                    <span className="text-gray-700">Apple Podcasts</span>
                    <p className="text-sm text-gray-500">Coming soon</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 opacity-75"
                >
                  <Headphones className="h-6 w-6 mr-3 text-gray-600" />
                  <div className="flex-1">
                    <span className="text-gray-700">Google Podcasts</span>
                    <p className="text-sm text-gray-500">Coming soon</p>
                  </div>
                </a>
              </div>

              {podcastData.show.imageUrl && (
                <div className="mt-6">
                  <img
                    src={podcastData.show.imageUrl}
                    alt={podcastData.show.name}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Podcast;