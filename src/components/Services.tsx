import React from 'react';
import { BarChart2, PieChart, TrendingUp, Radio, Users, Newspaper } from 'lucide-react';

const serviceItems = [
  {
    icon: <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
    title: "Media Monitoring",
    description: "Comprehensive tracking of your brand across print, broadcast, digital, and social media channels in real-time."
  },
  {
    icon: <PieChart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
    title: "Performance Analytics",
    description: "Advanced metrics and benchmarking to evaluate the effectiveness of your PR campaigns against industry standards."
  },
  {
    icon: <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
    title: "Sentiment Analysis",
    description: "AI-powered tone evaluation to understand audience perception and emotional response to your communications."
  },
  {
    icon: <Radio className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
    title: "Share of Voice",
    description: "Competitive analysis to measure your brand's media presence relative to competitors in your industry."
  },
  {
    icon: <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
    title: "Audience Insights",
    description: "Demographic and psychographic data about your audience to refine targeting and messaging strategies."
  },
  {
    icon: <Newspaper className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
    title: "Coverage Impact",
    description: "Assessment of reach, engagement, and influence of earned media to quantify campaign ROI."
  }
];

const Services = () => {
  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Our PR Measurement Services
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600">
            Comprehensive media evaluation tools that deliver actionable insights for strategic communications
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {serviceItems.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            >
              <div className="p-5 sm:p-6 md:p-8">
                <div className="mb-4 sm:mb-5 transition-transform duration-300 transform group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {service.description}
                </p>
              </div>
              <div className="bg-gray-50 px-5 sm:px-6 md:px-8 py-3 sm:py-4">
                <a
                  href="#"
                  className="text-blue-600 font-medium hover:text-blue-800 transition duration-300 flex items-center touch-target"
                >
                  Learn more
                  <svg className="w-4 h-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-16 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-md shadow-md transition duration-300 touch-target">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;