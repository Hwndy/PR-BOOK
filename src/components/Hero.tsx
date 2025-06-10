import { ChevronRight, TrendingUp, Award, BookOpen, User, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import PurchaseModal from './PurchaseModal';

const Hero = () => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isorderOnly, setIsorderOnly] = useState(true);

  const handleorder = () => {
    setIsorderOnly(true);
    setIsPurchaseModalOpen(true);
  };
  return (
    <section id="home" className="pt-20 sm:pt-28 pb-12 sm:pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-12">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <span className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold font-futura mb-4 sm:mb-6">
              #1 Best-Selling Author
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-futura leading-tight tracking-tight mb-6 sm:mb-8">
              The Science of <span className="text-yellow-400">Public Relations</span>
            </h1>
            <div className="max-w-lg">
              <h2 className="text-2xl sm:text-3xl font-bold font-futura text-yellow-400 mb-6 sm:mb-8 tracking-tight">
                A Comprehensive Guide to Measurement and Evaluation
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-base sm:text-lg font-futura leading-relaxed whitespace-none">How do we finally bridge the gap between "good vibes" and "real impact"? This question has driven the creation of this comprehensive guide.
                </p>
                <p className="text-base sm:text-lg font-futura leading-relaxed whitespace-normal">
                  Today's PR professionals need more than just creativity they need proven tools to demonstrate value and drive results. This book equips you with the frameworks and methodologies to not just look good, but prove it and continuously improve.
                </p>
                <p className="text-base sm:text-lg font-futura leading-relaxed whitespace-normal">
                  Join me on this journey as we rethink success metrics and embrace an evidence-driven approach to public relations and communications.
                </p>
                <p className="text-base sm:text-lg font-futura text-yellow-400 whitespace-normal">
                  Welcome to the future of PR measurement and evaluation.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-6">
              <button
                onClick={handleorder}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 sm:px-8 rounded-md shadow-lg transition duration-300 flex items-center justify-center touch-target"
              >
                Order Now <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <Link
                to="/book"
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border border-white/30 font-medium py-3 px-6 sm:px-8 rounded-md transition duration-300 flex items-center justify-center touch-target"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center space-x-3 touch-target">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">Author  </span>
              </div>
              <div className="flex items-center space-x-3 touch-target">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">PR Measurement Specialist</span>
              </div>
              <div className="flex items-center space-x-3 touch-target">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">Media Analyst Podcaster</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative mt-6 md:mt-0 ">
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 rounded-2xl p-1">
              <div className="bg-blue-900/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/front cover.jpg"
                  alt="Philip Odiakose - Author"
                  className="w-full h-auto rounded-t-xl"
                  loading="eager"
                />
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between mb-3 sm:mb-4 gap-2">
                    {/* <span className="text-yellow-400 font-semibold text-sm sm:text-base">order Special</span> */}
                    {/* <span className="bg-yellow-500 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">Save 20%</span> */}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">The Science of Public Relations</h3>
                  {/* <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                    Get exclusive discount when you order today!
                  </p> */}
                </div>
              </div>
            </div>

            {/* <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-3 sm:p-4 shadow-xl animate-pulse-slow hidden sm:block"> */}
              {/* <div className="flex items-center space-x-2"> */}
                {/* <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white rounded-full flex items-center justify-center"> */}
                  {/* <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" /> */}
                {/* </div> */}
                {/* <div> */}
                  {/* <p className="text-white font-bold text-xs sm:text-base">Available Now!!</p> */}
                  {/* <p className="text-white text-xs">MAY 2025</p> */}
                {/* </div> */}
              {/* </div> */}
            {/* </div> */}

            <div className="block sm:hidden mt-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-3 shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs">Coming Soon</p>
                  <p className="text-white text-xs">MAY 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        isorderOnly={isorderOnly}
      />
    </section>
  );
};

export default Hero;
