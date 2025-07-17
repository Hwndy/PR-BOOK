import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mic, User, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import Hero from "../components/Hero"

// Interfaces for data types
interface ResourcePost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
}

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  duration?: string;
}

interface BookChapter {
  number: string;
  title: string;
  description: string;
}

// Static book chapters (these don't change often)
const bookChapters: BookChapter[] = [
  {
    number: "01",
    title: "The Evolution of PR Measurement",
    description: "Tracing the historical development of PR measurement from AVEs to modern data-driven approaches."
  },
  {
    number: "02",
    title: "Scientific Frameworks for PR Evaluation",
    description: "Exploring robust methodological frameworks that bring scientific rigor to PR measurement."
  },
  {
    number: "03",
    title: "Quantitative Metrics That Matter",
    description: "Identifying and implementing the most relevant quantitative metrics for your PR objectives."
  }
];

const HomeSummary = () => {
  const [resourcePosts, setResourcePosts] = useState<ResourcePost[]>([]);
  const [podcastEpisodes, setPodcastEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch resources
        const resourcesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/resources/posts`);
        if (resourcesResponse.ok) {
          const resourcesData = await resourcesResponse.json();
          // Get first 2 posts for summary
          const latestResources = resourcesData.posts.slice(0, 2).map((post: any) => ({
            id: post.id,
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            date: post.date
          }));
          setResourcePosts(latestResources);
        }

        // Fetch podcast episodes
        const podcastResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/podcast/episodes`);
        if (podcastResponse.ok) {
          const podcastData = await podcastResponse.json();
          // Get first 2 episodes for summary
          const latestEpisodes = podcastData.episodes.slice(0, 2).map((episode: any) => ({
            id: episode.id,
            title: episode.title,
            description: episode.description,
            publishedAt: episode.publishedAt,
            duration: episode.duration
          }));
          setPodcastEpisodes(latestEpisodes);
        }
      } catch (error) {
        console.error('Error fetching home summary data:', error);
        // Set fallback data
        setResourcePosts([
          {
            id: '1',
            title: "The Evolution of PR Measurement: Beyond AVE",
            category: "Industry Trends",
            excerpt: "Exploring modern approaches to PR measurement...",
            date: "March 15, 2024"
          },
          {
            id: '2',
            title: "Sentiment Analysis: Understanding the Emotional Impact of Coverage",
            category: "Methodology",
            excerpt: "Deep dive into sentiment analysis techniques...",
            date: "March 10, 2024"
          }
        ]);

        setPodcastEpisodes([
          {
            id: '1',
            title: "Measuring PR Success in the Digital Age",
            description: "Discussion on modern PR measurement techniques",
            publishedAt: "2024-03-15T00:00:00Z",
            duration: "45 min"
          },
          {
            id: '2',
            title: "The Future of PR Analytics",
            description: "Exploring upcoming trends in PR analytics",
            publishedAt: "2024-03-08T00:00:00Z",
            duration: "38 min"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading content...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center ">
          <h2 className="text-2xl sm:text-3xl font-bold font-futura text-gray-900 mb-6 tracking-tight">
            Discover The Science of Public Relations
          </h2>
    
        </div>

        {/* About TSoPR Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 mb-12">
          <div className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-blue-600 mr-4" />
              <h3 className="text-xl font-bold font-futura text-gray-900">About the TSoPR</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 mb-6">
              <div className="w-full sm:w-2/3">
                <img
                  src="/logo.png"
                  alt="Philip Odiakose - Author"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="w-full sm:w-2/3 space-y-6">
                <p className="text-base text-justify font-futura font-semibold leading-relaxed tracking-wide">
                  TheScienceOfPublicRelations.com is more than just a book title it is a movement, a mindset, and a resource hub for the future of public relations.
                  For too long, the PR and communications industry has leaned on creativity, instinct, and storytelling. But today's landscape demands more it demands proof.
                  Organizations are asking the hard questions: "So what?" and "Show me the impact." That is where we come in.
                </p>
                
                <p className="text-base text-justify font-futura font-semibold leading-relaxed tracking-wide">
                  This platform is built to bridge the gap between good vibes and real results. Here, we dive deep into the science behind public relations not just through the book,
                  but through curated learnings, evolving trends, methodologies, real-world case studies, podcasts, and insights on PR performance audits, media intelligence, and measurement frameworks that matter.
                </p>

                <p className="text-base text-justify font-futura font-semibold leading-relaxed tracking-wide">
                  Whether you are a student beginning your journey, a PR executive growing your expertise, or a seasoned professional this is your space to explore and elevate your practice.
                  Authored by Philip Odiakose, a leading voice in PR measurement and evaluation.
                </p>

                <p className="text-base text-justify font-futura font-semibold leading-relaxed tracking-wide">
                  Welcome to the future of PR rooted in truth, driven by data.
                </p>

                <div className="pt-4">
                  <span className="block font-bold text-lg">Philip Odiakose</span>
                  {/* <span className="text-gray-600">Chief Media Analyst</span> */}
                </div>
                
              </div>
              
            </div>
          </div>
           <Hero />
        </div>
        {/* <section className="py-16 sm:py-20 md:py-24 bg-gray-50"> */}
         
        {/* </section> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* About Author Summary */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">About the Author</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-1/3">
                  <img
                    src="/author.jpg"
                    alt="Philip Odiakose"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    Philip Odiakose is the Founder and Chief Media Analyst at
                    P+ Measurement Services, Nigeria's first independent public
                    relations measurement, evaluation, and performance audit
                    consultancy. With over 15 years of experience, Philip has
                    built a name as one of Africa's most passionate and
                    forward-thinking voices in PR measurement.
                  </p>
                  <Link
                    to="/about"
                    className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                  >
                    Learn more about Philip
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Book Preview */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Inside the Book</h3>
              </div>
              <div className="space-y-3 mb-4">
                {bookChapters.map((chapter, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-lg font-bold text-blue-600 mr-2">{chapter.number}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                      <p className="text-gray-600 text-sm">{chapter.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/book"
                className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300"
              >
                Explore the full book
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Podcast Summary */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Mic className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">PR Podcast</h3>
              </div>
              <div className="space-y-3 mb-4">
                {podcastEpisodes.map((episode, index) => (
                  <div key={episode.id || index} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 text-sm">{episode.title}</h4>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatDate(episode.publishedAt)}</span>
                      <span>{episode.duration || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/podcast"
                className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300 text-sm"
              >
                Listen to all episodes
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Speaking Summary */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Speaking</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Invite Philip Odiakose to share insights on PR measurement and evaluation at your next event. Available for keynotes, workshops, and panel discussions.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-gray-900 text-sm mb-2">Previous Engagements:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• PR Clinic Lagos NIPR</li>
                  <li>• Lagos Digital PR Summit – NIPR</li>
                  <li>• NIPR Conference Uyo.</li>
                </ul>
              </div>
              <Link
                to="/speaking"
                className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300 text-sm"
              >
                Book a speaking engagement
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Blog Summary */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">PR Insights</h3>
              </div>
              <div className="space-y-3 mb-4">
                {resourcePosts.map((post, index) => (
                  <div key={post.id || index} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 text-sm">{post.title}</h4>
                    <span className="text-xs text-blue-600">{post.category}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/resources"
                className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300 text-sm"
              >
                Read all articles
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 text-white text-center">
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">Ready to transform your PR measurement?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get in touch to learn more about the book, speaking engagements, or PR measurement services.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-md transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSummary;
