import React from 'react';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    title: "The Evolution of PR Measurement: Beyond AVE",
    category: "Industry Trends",
    date: "May 15, 2025",
    image: "https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg",
    excerpt: "How modern PR measurement has moved beyond traditional advertising value equivalents to more sophisticated metrics."
  },
  {
    title: "Sentiment Analysis: Understanding the Emotional Impact of Coverage",
    category: "Methodology",
    date: "April 28, 2025",
    image: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg",
    excerpt: "A deep dive into how AI-powered sentiment analysis is revolutionizing PR measurement and evaluation."
  },
  {
    title: "Measuring Social Media Impact: Beyond Likes and Shares",
    category: "Digital PR",
    date: "April 10, 2025",
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
    excerpt: "Advanced strategies for quantifying the true impact of your social media communications efforts."
  }
];

const Blog = () => {
  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            PR Measurement Insights
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Latest trends, methodologies, and best practices in PR measurement and evaluation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div 
              key={index} 
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
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <a 
                  href="#" 
                  className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-8 rounded-md transition duration-300">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;