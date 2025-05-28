import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Quote, User, Calendar, Award, Check, CheckCircle, Users, Trophy, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PurchaseModal from './PurchaseModal';

// Testimonials/Quotes data
const testimonials = [
  {
    quote: "With this book, Philip Odiakose has cemented Africa's role in the global conversation on PR measurement. He brings a fresh perspective, blending international best practices with the realities of the African media landscape. This is the blueprint we have been waiting for ",
    author: "John Ehiguese",
    title: "Founder and CEO of Mediacraft Associates",
    image: "/testimonials/john.png"
  },
  {
    quote: "Philip's work is a brilliant contribution to the global PR measurement space. It combines proven frameworks with fresh, relatable context — a book that transcends borders and speaks to professionals at all levels.",
    author: "Johna Burke",
    title: "CEO and Global Managing Director of AMEC (Association for the Measurement and Evaluation of Communication)",
    image: "/testimonials/johna.png"
  },
  {
    quote: "This book is not just about measurement, rather it is about how and why it truly matters. The breakdown and settling of clear Public Relations objectives in Chapter 2, is something every communication professional should stick on their office wall. Philip makes it extremely impossible to hide behind 'busy work' Public Relations, as if it cannot be measured, it can never be valued.",
    author: "Yomi Badejo-Okusanya (YBO)",
    title: "Lead Partner, CMC Connect LLP (Perception Consulting), a Fellow of NIPR and NIMN, Ex. President, African Public Relations Association (APRA) and Inaugural Chair, Nigeria Public Relations Week.",
    image: "/testimonials/yomi.png"
  },
  {
    quote: "Philip Odiakose delivers a sharp, insightful take on one of PR's most essential practices: setting and measuring clear objectives. This book offers real value to anyone serious about elevating their impact in communications. Philip draws a critical and often-missed line between goals and objectives, showing why specificity and alignment with business strategy are non-negotiable. His emphasis on balancing hard data with human insights reflects his deep understanding of how modern PR must operate.",
    author: "Todd Murphy",
    title: "President at Truescope, U.S., FIBEP President and AMEC Member.",
    image: "/testimonials/todd.png"
  },
  {
    quote: "At last, we have a comprehensive handbook for measurement and evaluation in Public Relations. The author, Philip Odiakose, has not only provided a valuable resource but helped to elucidate the complexities of M&E in PR and has simplified the global processes for practitioners who once regarded it as intimidating. Today’s realities in PR expect that every practitioner of PR must speak the “Boardroom language” which means backing claims with data that impacts the business's bottom line, known as Return on Investment (ROI). Every PR professional needs this book to ensure their voice counts and is heard effectively.",
    author: "Nkechi Ali-Balogun",
    title: " Ph.D., FNIPR, Principal Consultant/CEO at NECCI Consulting",
    image: "/testimonials/Nkechi.png"
  },
  {
    quote: "Philip doesn’t just talk about PR measurement—he lives it! His insights on the ethics of evaluation in Chapter 1 and busting PR measurement myths in Chapter 8 should be a wake-up call for professionals still relying on outdated metrics like AVEs. This book will save the industry from itself ",
    author: "Francois van Dyk",
    title: "AMEC Chair of Middle East and Africa and Head of Operations, Ornico, South Africa.",
    image: "/testimonials/francois.png"
  },
  {
    quote: "In a world where output is often confused with outcome, this book offers a valuable guide for measuring the effectiveness of public relations efforts. This insightful book presents a comprehensive framework for analyzing PR initiatives, using world-class case studies to illustrate best practices. Philip equips PR professionals with essential skills to demonstrate real value, transforming data into actionable insights that shape strategy and drive impact. Whether you are a seasoned expert or new to the field, this book serves as a roadmap to mastering PR measurement and showcasing success in an ever-evolving landscape. A must-read for anyone serious about proving and improving PR effectiveness.",
    author: "Dr. Nkiru Olumide-Ojo",
    title: "Corporate Executive, Long time PR Practitioner.",
    image: "/testimonials/nkiru.png"
  }
];

// Book chapters preview
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
  },
  {
    number: "04",
    title: "Qualitative Analysis Techniques",
    description: "Complementing numbers with meaningful qualitative insights for comprehensive evaluation."
  },
  {
    number: "05",
    title: "The African PR Measurement Landscape",
    description: "Understanding the unique challenges and opportunities for PR measurement in African markets."
  },
  {
    number: "06",
    title: "The African PR Measurement Landscape",
    description: "Understanding the unique challenges and opportunities for PR measurement in African markets."
  }
];

const BookPage = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // State for email input in order section
  const [orderEmail, setorderEmail] = useState('');
  const [orderEmailError, setorderEmailError] = useState('');

  // Function to validate email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // State for payment processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | null;
  }>({ message: '', type: null });

  // State for purchase modal
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isorderOnly, setIsorderOnly] = useState(false);

  // Function to handle order button click
  const handleorder = () => {
    // Reset payment status
    setPaymentStatus({ message: '', type: null });

    // Set order only mode
    setIsorderOnly(true);

    // Open purchase modal
    setIsPurchaseModalOpen(true);
  };

  // Note: Server-side verification is commented out for now
  // In a production environment, you would implement server-side verification
  // to ensure the payment was successful and to update your database

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <img
                src="/book cover.jpg"
                alt="The Science of Public Relations Book Cover"
                className="rounded-lg shadow-2xl w-full max-w-md mx-auto lg:max-w-none"
                loading="eager"
              />
            </div>

            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                THE SCIENCE OF <span className="text-yellow-400">PUBLIC RELATIONS</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6 font-medium">
                A Comprehensive Guide to Measurement and Evaluation
              </p>
              <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
                The first definitive guide to PR measurement and evaluation in Africa,
                bridging the gap between theory and practice with data-driven methodologies
                and actionable frameworks.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center lg:justify-start">
                <button
                  onClick={handleorder}
                  className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 sm:px-8 rounded-md shadow-lg transition duration-300 flex items-center justify-center touch-target"
                >
                  order Now <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author's Note Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Author's Note</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex items-center mb-6">
                <img
                  src="/author.jpg"
                  alt="Philip Odiakose"
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Philip Odiakose</h3>
                  <p className="text-gray-600">Founder, P+ Measurement Services</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-gray-600">
                <p className="mb-4">
                  "The Science of Public Relations: A Comprehensive Guide to Measurement and Evaluation" came from a simple but persistent question: how do we finally bridge the gap between "good vibes" and "real impact"?
                </p>
                <p className="mb-4">
                  How do we equip public relations and communications professionals with the right tools to not just look good, but prove it — and get better at it?
                </p>
                <p>
                  I invite you to walk with me through these pages, rethink how we define success, and embrace a smarter, evidence-driven way of practicing public relations and communications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Chapters Section */}
      <section id="chapters" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Inside the Book</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg">
              Explore the key chapters that will transform your approach to PR measurement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {bookChapters.map((chapter, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl font-bold text-blue-600 mr-3">{chapter.number}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{chapter.title}</h3>
                  </div>
                  <p className="text-gray-600">{chapter.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">BOOK PRAISE</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8 sm:p-10">
                <Quote className="h-12 w-12 text-blue-100 mb-6" />

                <div className="relative h-64 overflow-y-auto">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentTestimonial ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <p className="text-sm text-gray-700 italic mb-6 line-clamp-6">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs">{testimonial.author}</h4>
                          <p className="text-gray-600 text-xs line-clamp-2">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300 focus:outline-none hidden md:block"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300 focus:outline-none hidden md:block"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>
      {/* order Section */}
      <section id="order" className="py-12 sm:py-16 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">order Your Copy Today</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-blue-100 text-lg">
              Be among the first to receive "The Science of Public Relations" and get exclusive Bonus
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Special order Price</h3>
                  <p className="text-blue-100 mb-4">Limited time offer with exclusive Discount</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">₦15000</span>
                    {/* <span className="text-blue-200 line-through ml-2">₦15,000</span> */}
                    {/* <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">SAVE 20%</span> */}
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="orderEmail" className="block text-sm font-medium text-white mb-1">
                  Your Email Address (required for order)
                </label>
                <input
                  type="email"
                  id="orderEmail"
                  value={orderEmail}
                  onChange={(e) => setorderEmail(e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${orderEmailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 text-sm sm:text-base`}
                  placeholder="your.email@example.com"
                />
                {orderEmailError && <p className="mt-1 text-sm text-red-300">{orderEmailError}</p>}
              </div>

              {paymentStatus.message && (
                <div className={`mb-4 p-3 rounded-md ${
                  paymentStatus.type === 'success' ? 'bg-green-100 text-green-800' :
                  paymentStatus.type === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {paymentStatus.message}
                </div>
              )}

              <button
                onClick={handleorder}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-8 rounded-md shadow-lg transition duration-300 flex items-center justify-center"
              >
                order Now <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">About the Author</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-12">
            <div className="w-full lg:w-1/3">
              <div className="relative">
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

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <Users className="h-6 w-6 text-blue-600 mb-1" />
                  <p className="text-sm text-gray-600">AMEC Member</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <Trophy className="h-6 w-6 text-blue-600 mb-1" />
                  <p className="text-sm text-gray-600">NIPR Member</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <Globe className="h-6 w-6 text-blue-600 mb-1" />
                  <p className="text-sm text-gray-600">AMCRON Member</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <CheckCircle className="h-6 w-6 text-blue-600 mb-1" />
                  <p className="text-sm text-gray-600">ISMN Member</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  Philip Odiakose is the Founder and Chief Media Analyst at P+ Measurement Services, Nigeria's first independent public relations measurement, evaluation, and performance audit consultancy. With over 15 years of experience in media monitoring, media intelligence, evaluation, reputation analysis, and C-suite reputation evaluation, Philip has built a name as one of Africa's most passionate and forward-thinking voices in PR measurement.
                </p>

                <p className="text-gray-600 mb-6">
                  At P+, he leads a team that helps brands across Africa, by setting the short and long-term strategic direction for brands' media monitoring, measurement, and media performance audit. From fintech to financial services, healthcare, insurance, pension management, asset management, power distribution and generation, technology, FMCGs, real estate, telecoms/IT, tobacco, ride-hailing, government agencies, Civil Society Organisations and NGOs, Philip and his team have worked with organizations in nearly every sector.
                </p>

                <p className="text-gray-600 mb-6">
                  He is a proud alumnus of the University of Benin and holds certifications in Public Relations Evaluation and Improvement Techniques from the Metropolitan School of Business and Management, UK, as well as in Marketing and Communication from the International Business Management Institute, Berlin, Germany. Philip is a Founding Member of the AMEC Initiative Lab, a Judge for the AMEC Global Awards, and has been honored with several industry recognitions including nominations at LAPRIGA and multiple PR Industry awards.
                </p>

                <p className="text-gray-600">
                  When he isn't immersed in reports and dashboards, Philip hosts "The Chronicles of a Pensive Soul," a podcast that explores human psychology and the stories behind our decisions. As the author of "THE SCIENCE OF PUBLIC RELATIONS: A Comprehensive Guide to Measurement and Evaluation" — the first of its kind in Africa — Philip continues to champion education and awareness for better PR measurement frameworks, valid metrics, and real accountability in the public relations and communications industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        email={orderEmail}
        isorderOnly={isorderOnly}
      />
    </div>
  );
};

export default BookPage;
