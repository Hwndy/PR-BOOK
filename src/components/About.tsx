import { CheckCircle, Users, Trophy, Globe, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About TSoPR Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
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
      </div>
    </section>
  );
};

export default About;
