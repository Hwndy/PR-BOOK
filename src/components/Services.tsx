import React from 'react';
import { BarChart2, PieChart, TrendingUp, Radio, Users, Newspaper } from 'lucide-react';

// const serviceItems = [
//   {
//     icon: <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
//     title: "Media Monitoring",
//     description: "Comprehensive tracking of your brand across print, broadcast, digital, and social media channels in real-time."
//   },
//   {
//     icon: <PieChart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
//     title: "Performance Analytics",
//     description: "Advanced metrics and benchmarking to evaluate the effectiveness of your PR campaigns against industry standards."
//   },
//   {
//     icon: <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
//     title: "Sentiment Analysis",
//     description: "AI-powered tone evaluation to understand audience perception and emotional response to your communications."
//   },
//   {
//     icon: <Radio className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
//     title: "Share of Voice",
//     description: "Competitive analysis to measure your brand's media presence relative to competitors in your industry."
//   },
//   {
//     icon: <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
//     title: "Audience Insights",
//     description: "Demographic and psychographic data about your audience to refine targeting and messaging strategies."
//   },
//   {
//     icon: <Newspaper className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
//     title: "Coverage Impact",
//     description: "Assessment of reach, engagement, and influence of earned media to quantify campaign ROI."
//   }
// ];

const Services = () => {
  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        <div className="mt-10 sm:mt-16 text-center">
  <a 
    href="https://www.pplusmeasurement.com.ng/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-md shadow-md transition duration-300 inline-block"
  >
    PR Measurement Services
  </a>
</div>

      </div>
    </section>
  );
};

export default Services;