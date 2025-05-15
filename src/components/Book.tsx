import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PurchaseModal from './PurchaseModal';

const Book = () => {
  const navigate = useNavigate();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPreorderOnly, setIsPreorderOnly] = useState(false);

  const handlePurchase = () => {
    // Open purchase modal with all formats
    setIsPreorderOnly(false);
    setIsPurchaseModalOpen(true);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <img
              src="/book cover.jpg"
              alt="THESCIENCEOFPUBLICRELATIONS Logo"
              className="rounded-lg shadow-2xl w-full max-w-md mx-auto lg:max-w-none"
              loading="eager"
            />
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-bold font-futura text-gray-900 mb-6 sm:mb-8 tracking-tight">
              THE SCIENCE OF PUBLIC RELATIONS
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Transform your PR strategy with data-driven insights and proven methodologies. Learn how to measure, analyze, and optimize your PR campaigns for maximum impact.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Here is what you will find inside</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  
                  'Clear, jargon-free guidance on modern PR measurement',
                  'Globally aligned tools and models (yes, AMEC fans — this one’s for you)',
                  'How to report & present PR metrics that matter',
                  'Real-life case studies from African markets to global brands, drawn from years in PR monitoring, measurement, intelligence, and performance audits',
                  'A step-by-step guide to move from tactical executor to strategic communicator in the boardroom'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">This Book is for</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
    'Students of mass communication and Public relations who want clarity (not confusion) in measurement and evaluation',
                  'Rising PR executives who are tired of “just reporting mentions” and want to lead with insight',
                  'Senior professionals looking to sharpen their edge and embrace global best practices in measurement'
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
                Purchase Now
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        isPreorderOnly={isPreorderOnly}
      />
    </section>
  );
};

export default Book;