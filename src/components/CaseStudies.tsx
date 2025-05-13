import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    title: "Global Tech Company Reputation Management",
    category: "Technology",
    metrics: { sentiment: "+28%", visibility: "+64%", engagement: "+42%" },
    image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    description: "How we helped a leading tech firm measure and improve their brand sentiment during a major product launch.",
  },
  {
    title: "Financial Services Media Crisis Evaluation",
    category: "Finance",
    metrics: { sentiment: "+15%", visibility: "+37%", engagement: "+22%" },
    image: "https://images.pexels.com/photos/7681097/pexels-photo-7681097.jpeg",
    description: "Measuring the effectiveness of crisis communications during a sensitive regulatory challenge.",
  },
  {
    title: "Healthcare Brand Awareness Campaign",
    category: "Healthcare",
    metrics: { sentiment: "+41%", visibility: "+92%", engagement: "+78%" },
    image: "https://images.pexels.com/photos/3846508/pexels-photo-3846508.jpeg",
    description: "Comprehensive evaluation of a national awareness campaign for a healthcare provider network.",
  }
];

const CaseStudies = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <section id="case-studies" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Our Success Stories
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Real results from our data-driven approach to PR measurement and evaluation
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/2">
            <div className="relative h-full">
              <img 
                src={caseStudies[activeIndex].image} 
                alt={caseStudies[activeIndex].title}
                className="w-full h-96 lg:h-full object-cover rounded-xl shadow-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-8 rounded-b-xl">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-3">
                  {caseStudies[activeIndex].category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {caseStudies[activeIndex].title}
                </h3>
                <p className="text-white/80 mb-4">
                  {caseStudies[activeIndex].description}
                </p>
                <div className="flex space-x-6">
                  <div>
                    <p className="text-xs text-white/70">Sentiment</p>
                    <p className="text-xl font-bold text-white">{caseStudies[activeIndex].metrics.sentiment}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Visibility</p>
                    <p className="text-xl font-bold text-white">{caseStudies[activeIndex].metrics.visibility}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Engagement</p>
                    <p className="text-xl font-bold text-white">{caseStudies[activeIndex].metrics.engagement}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Featured Case Studies
                </h3>
                <div className="space-y-6">
                  {caseStudies.map((study, index) => (
                    <div 
                      key={index}
                      className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                        activeIndex === index 
                          ? 'bg-blue-50 border-l-4 border-blue-600' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {study.title}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {study.description}
                      </p>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-blue-600">
                          {study.category}
                        </span>
                        {activeIndex === index && (
                          <span className="text-sm font-medium text-blue-600">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <a 
                  href="#" 
                  className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                >
                  View all case studies
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;