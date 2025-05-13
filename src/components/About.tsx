import { CheckCircle, Users, Trophy, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-12">

          {/* Left Column: Image + Stats */}
          <div className="w-full lg:w-1/2">
            {/* Image */}
            <div className="mb-6 sm:mb-8 relative">
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-blue-100 rounded-lg"></div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-blue-100 rounded-lg"></div>
              <div className="relative z-10 overflow-hidden rounded-lg shadow-xl">
                <img
                  src="/author.jpg"
                  alt="Philip Odiakose - Author"
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-1 sm:mb-2" />
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">35+</h4>
                <p className="text-sm sm:text-base text-gray-600">Expert Analysts</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-1 sm:mb-2" />
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">15+</h4>
                <p className="text-sm sm:text-base text-gray-600">Industry Awards</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-1 sm:mb-2" />
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">42</h4>
                <p className="text-sm sm:text-base text-gray-600">Countries Served</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-1 sm:mb-2" />
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">500+</h4>
                <p className="text-sm sm:text-base text-gray-600">Successful Projects</p>
              </div>
            </div>
          </div>

          {/* Right Column: Bio */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              About PHILIPODIAKOSE
            </h2>

            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Philip Odiakose is the Founder and Chief Media Analyst at
              P+ Measurement Services, Nigeria's first independent public
              relations measurement, evaluation, and performance audit
              consultancy. With over 15 years of experience in media
              monitoring, media intelligence, evaluation, reputation
              analysis, and C-suite reputation evaluation, Philip has
              built a name as one of Africa's most passionate and
              forward-thinking voices in PR measurement.
            </p>

            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-8">
              At P+, he leads a team that helps brands across Africa, by setting the short and long-term strategic direction for brands' media monitoring, measurement, and media performance audit. From fintech to financial services, healthcare, insurance, pension management, asset management, power distribution and generation, technology, FMCGs, real estate, telecoms/IT, tobacco, ride-hailing, government agencies, Civil Society Organisations and NGOs, Philip and his team have worked with organizations in nearly every sector, helping them track PR performance, benchmark competitors, and make smarter and data-driven PR decisions.
            </p>

            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-8">
              He is a proud alumnus of the University of Benin and holds certifications in Public Relations Evaluation and Improvement Techniques from the Metropolitan School of Business and Management, UK, as well as in Marketing and Communication from the International Business Management Institute, Berlin, Germany. Philip is a Founding Member of the AMEC (International Association for the Measurement and Evaluation of Communication) Initiative Lab, a Judge for the AMEC Global Awards, and has been honored with several industry recognitions including nominations at LAPRIGA and multiple PR Industry awards. More than anything, Philip is a teacher at heart.
            </p>

            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              He's facilitated numerous training sessions, sharing insights with public relations leaders and communication heads from all sectors. He is a member of several professional bodies, including AMEC, the Nigerian Institute of Public Relations (NIPR), the Association of Media and Communication Researchers of Nigeria (AMCRON), the Institute of Strategic Management of Nigeria (ISMN), and the Chartered Institute of Operations Management of Nigeria (CIOM).
              When he isn't immersed in reports and dashboards, Philip hosts "The Chronicles of a Pensive Soul," a podcast that explores human psychology and the stories behind our decisions. As the author of "THE SCIENCE OF PUBLIC RELATIONS: A Comprehensive Guide for Measurement and Evaluation" — the first of its kind in Africa — Philip continues to champion education and awareness for better PR measurement frameworks, valid metrics, and real accountability in the public relations and communications industry.
            </p>

            <Link
              to="/contact"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-md shadow-md transition duration-300 inline-flex items-center justify-center touch-target"
            >
              Learn more About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
