import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mic, User, MessageSquare, Calendar, ChevronRight } from 'lucide-react';

// Book chapters preview (shortened from BookPage)
const bookChapters = [
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

// Podcast episodes (shortened from Podcast)
const podcastEpisodes = [
  {
    title: "Measuring PR Success in the Digital Age",
    date: "March 15, 2024",
    duration: "45 min"
  },
  {
    title: "The Future of PR Analytics",
    date: "March 8, 2024",
    duration: "38 min"
  }
];

// Blog posts (shortened from Blog)
const blogPosts = [
  {
    title: "The Evolution of PR Measurement: Beyond AVE",
    category: "Industry Trends"
  },
  {
    title: "Sentiment Analysis: Understanding the Emotional Impact of Coverage",
    category: "Methodology"
  }
];

const HomeSummary = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Discover The Science of Public Relations
          </h2>
          {/* <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-600">
            Explore all aspects of PR measurement and evaluation through our comprehensive resources
          </p> */}
        </div>

        {/* About TSoPR Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 mb-12">
          <div className="p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">About the TSoPR</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="w-full sm:w-1/3">
                <img
                  src="/logo.png"
                  alt="Philip Odiakose - Author"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="w-full sm:w-2/3">
                <p className="text-gray-600 text-sm sm:text-base text-justify font-bold font-futura leading-relaxed mb-4">
                  TheScienceOfPublicRelations.com is more than just a book title — it is a movement, a mindset, and a resource hub for the future of public relations.
                  For too long, the PR and communications industry has leaned on creativity, instinct, and storytelling. But today's landscape demands more — it demands proof.
                  Organizations are asking the hard questions: "So what?" and "Show me the impact." That is where we come in.
                  This platform is built to bridge the gap between good vibes and real results. Here, we dive deep into the science behind public relations — not just through the book,
                  but through curated learnings, evolving trends, methodologies, real-world case studies, podcasts, and insights on PR performance audits, media intelligence, and measurement frameworks that matter.
                </p>
                <p className="text-gray-600 text-sm sm:text-base text-justify font-bold font-futura leading-relaxed">
                  Whether you are a student beginning your journey, a PR executive growing your expertise, or a seasoned professional — this is your space to explore and elevate your practice.
                  Authored by Philip Odiakose, a leading voice in PR measurement and evaluation.
                  <br /><br />
                  Welcome to the future of PR — rooted in truth, driven by data.
                  <br /><br />
                  <span className="block font-bold mt-2">Philip Odiakose<br />Chief Media Analyst</span>
                </p>
              </div>
            </div>
          </div>
        </div>

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
                  <div key={index} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 text-sm">{episode.title}</h4>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{episode.date}</span>
                      <span>{episode.duration}</span>
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
                  <li>• PR Analytics Summit, Lagos</li>
                  <li>• Digital PR Conference, Abuja</li>
                  <li>• Media Measurement Forum, Port Harcourt</li>
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
                {blogPosts.map((post, index) => (
                  <div key={index} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 text-sm">{post.title}</h4>
                    <span className="text-xs text-blue-600">{post.category}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/blog"
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
