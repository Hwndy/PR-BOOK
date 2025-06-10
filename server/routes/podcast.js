const express = require('express');
const axios = require('axios');
const router = express.Router();

// Spotify API configuration
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_SHOW_ID = '5xnBGHhsdklfMvw0bnLp39'; // Extracted from the URL

// Cache for Spotify access token
let spotifyToken = null;
let tokenExpiry = null;

// Get Spotify access token
const getSpotifyToken = async () => {
  try {
    // Check if we have a valid token
    if (spotifyToken && tokenExpiry && Date.now() < tokenExpiry) {
      return spotifyToken;
    }

    // Get new token
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        }
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

    return spotifyToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Spotify');
  }
};

// Get podcast episodes from Spotify
router.get('/episodes', async (req, res) => {
  try {
    // Check if Spotify credentials are configured
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      console.log('Spotify credentials not configured, returning mock data');
      return res.json(getMockEpisodes());
    }

    const token = await getSpotifyToken();
    
    // Fetch show details
    const showResponse = await axios.get(`https://api.spotify.com/v1/shows/${SPOTIFY_SHOW_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        market: 'US'
      }
    });

    // Fetch episodes
    const episodesResponse = await axios.get(`https://api.spotify.com/v1/shows/${SPOTIFY_SHOW_ID}/episodes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        market: 'US',
        limit: 20,
        offset: 0
      }
    });

    const show = showResponse.data;
    const episodes = episodesResponse.data.items;

    // Format episodes for frontend
    const formattedEpisodes = episodes.map(episode => ({
      id: episode.id,
      title: episode.name,
      description: episode.description,
      date: new Date(episode.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      duration: formatDuration(episode.duration_ms),
      spotifyUrl: episode.external_urls.spotify,
      imageUrl: episode.images?.[0]?.url || show.images?.[0]?.url,
      audioPreviewUrl: episode.audio_preview_url
    }));

    res.json({
      show: {
        name: show.name,
        description: show.description,
        imageUrl: show.images?.[0]?.url,
        spotifyUrl: show.external_urls.spotify,
        totalEpisodes: show.total_episodes
      },
      episodes: formattedEpisodes
    });

  } catch (error) {
    console.error('Error fetching podcast episodes:', error.response?.data || error.message);
    
    // Return mock data if Spotify API fails
    res.json(getMockEpisodes());
  }
});

// Helper function to format duration
const formatDuration = (durationMs) => {
  const minutes = Math.floor(durationMs / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  
  return `${minutes} min`;
};

// Mock data fallback
const getMockEpisodes = () => ({
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

module.exports = router;
