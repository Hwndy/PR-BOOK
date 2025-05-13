import React from 'react';
import { Play, AlignJustify as Spotify, Headphones, Mic } from 'lucide-react';

const episodes = [
  {
    title: "Measuring PR Success in the Digital Age",
    date: "March 15, 2024",
    duration: "45 min",
    description: "Learn how to effectively measure and evaluate PR campaigns in today's digital landscape."
  },
  {
    title: "The Future of PR Analytics",
    date: "March 8, 2024",
    duration: "38 min",
    description: "Exploring emerging trends and technologies in PR measurement and evaluation."
  },
  {
    title: "Data-Driven PR Strategies",
    date: "March 1, 2024",
    duration: "42 min",
    description: "How to use data analytics to inform and optimize your PR strategies."
  }
];

const Podcast = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            The PR Measurement Podcast
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Weekly insights on PR measurement, analytics, and evaluation strategies
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <div className="space-y-6">
              {episodes.map((episode, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{episode.date}</span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Headphones className="h-4 w-4 mr-1" />
                      {episode.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{episode.title}</h3>
                  <p className="text-gray-600 mb-4">{episode.description}</p>
                  <button className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300">
                    <Play className="h-5 w-5 mr-2" />
                    Listen Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-6">Listen On</h3>
              <div className="space-y-4">
                <a href="#" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300">
                  <Spotify className="h-6 w-6 mr-3" />
                  <span>Spotify</span>
                </a>
                <a href="#" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300">
                  <Mic className="h-6 w-6 mr-3" />
                  <span>Apple Podcasts</span>
                </a>
                <a href="#" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300">
                  <Headphones className="h-6 w-6 mr-3" />
                  <span>Google Podcasts</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Podcast;