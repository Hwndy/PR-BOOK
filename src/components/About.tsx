import { CheckCircle, Users, Trophy, Globe, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-8 sm:p-10">
            <div className="flex items-center mb-8">
              <User className="h-6 w-6 text-blue-600 mr-4" />
              <h3 className="text-2xl font-bold font-futura text-gray-900">About the TSoPR</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 mb-6">
              <div className="w-full sm:w-1/3">
                <img
                  src="/logo.png"
                  alt="Philip Odiakose - Author"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="w-full sm:w-2/3 space-y-8">
                <p className="text-base  font-futura leading-relaxed tracking-wide">
                  TheScienceOfPublicRelations.com is more than just a book title it is a movement, a mindset, and a resource hub for the future of public relations.
                  For too long, the PR and communications industry has leaned on creativity, instinct, and storytelling. But today's landscape demands more it demands proof.
                  Organizations are asking the hard questions: "So what?" and "Show me the impact." That is where we come in.
                </p>
                
                <p className="text-base  font-futura leading-relaxed tracking-wide">
                  This platform is built to bridge the gap between good vibes and real results. Here, we dive deep into the science behind public relations not just through the book,
                  but through curated learnings, evolving trends, methodologies, real-world case studies, podcasts, and insights on PR performance audits, media intelligence, and measurement frameworks that matter.
                </p>

                <p className="text-base font-futura leading-relaxed tracking-wide">
                  Whether you are a student beginning your journey, a PR executive growing your expertise, or a seasoned professional this is your space to explore and elevate your practice.
                  Authored by Philip Odiakose, a leading voice in PR measurement and evaluation.
                </p>

                <p className="text-base font-futura leading-relaxed tracking-wide">
                  Welcome to the future of PR rooted in truth, driven by data.
                </p>

                <div className="pt-4">
                  <span className="block font-bold text-lg">Philip Odiakose</span>
                  {/* <span className="text-gray-600">Chief Media Analyst</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
