import React from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Book = () => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    // Navigate to the book page with pre-order section
    navigate('/book#pre-order');
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <img
              src="/book cover.jpg"
              alt="THESCIENCEOFPUBLICRELATIONS Logo"
              className="rounded-lg shadow-2xl w-full max-w-md mx-auto lg:max-w-none"
              loading="eager"
            />
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              THE SCIENCE OF PUBLIC RELATIONS
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Transform your PR strategy with data-driven insights and proven methodologies. Learn how to measure, analyze, and optimize your PR campaigns for maximum impact.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">What You'll Learn</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Advanced PR measurement frameworks',
                  'Data-driven decision making',
                  'ROI calculation methods',
                  'Performance optimization strategies',
                  'Industry best practices'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Bonus Materials</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'PR Measurement Toolkit ($97 value)',
                  'Video Masterclass Series ($147 value)',
                  'Private Community Access ($53 value)'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-md shadow-md transition duration-300 flex items-center justify-center sm:justify-start touch-target"
              >
                View Pre-order Options
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <div className="text-gray-500 text-sm sm:text-base">
                <span className="line-through">₦3,999</span>
                <span className="ml-2 text-green-600">Save 25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Book;