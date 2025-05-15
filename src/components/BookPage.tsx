import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Quote, User, Calendar, Award, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PurchaseModal from './PurchaseModal';

// Testimonials/Quotes data
const testimonials = [
  {
    quote: "With this book, Philip Odiakose has cemented Africa’s role in the global conversation on PR measurement. He brings a fresh perspective, blending international best practices with the realities of the African media landscape. This is the blueprint we have been waiting for ",
    author: "John Ehiguese",
    title: "Founder and CEO of Mediacraft Associates",
    image: "https://mail.google.com/mail/u/0?ui=2&ik=edfa255ca6&attid=0.12&permmsgid=msg-f:1832050335100915988&th=196cc012ba535114&view=fimg&fur=ip&permmsgid=msg-f:1832050335100915988&sz=s0-l75-ft&attbid=ANGjdJ_zdcp-Tj1JPQXoKePQBLv5AjgU6PhGLs0jtDJ0RrJxy71QGPA4xphIQnXkOcAKZIuxLl9XPp3_G-bAe8-bWE3s9iNMaUe6CwqKGzDHXcA5FIa0Oaild4HF444&disp=emb&realattid=ii_man5cym814&zw"
  },
  {
    quote: "Philip’s work is a brilliant contribution to the global PR measurement space. It combines proven frameworks with fresh, relatable context — a book that transcends borders and speaks to professionals at all levels.",
    author: "Johna Burke",
    title: "CEO and Global Managing Director of AMEC (Association for the Measurement and Evaluation of Communication)",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
  },
  {
    quote: "This book is not just about measurement, rather it is about how and why it truly matters. The breakdown and settling of clear Public Relations objectives in Chapter 2, is something every communication professional should stick on their office wall. Philip makes it extremely impossible to hide behind ‘busy work’ Public Relations, as if it cannot be measured, it can never be valued.",
    author: "Yomi Badejo-Okusanya (YBO)",
    title: "Lead Partner, CMC Connect LLP (Perception Consulting), a Fellow of NIPR and NIMN, Ex. President, African Public Relations Association (APRA) and Inaugural Chair, Nigeria Public Relations Week.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
  },
  {
    quote: "Philip Odiakose delivers a sharp, insightful take on one of PR’s most essential practices: setting and measuring clear objectives. This book offers real value to anyone serious about elevating their impact in communications. Philip draws a critical and often-missed line between goals and objectives, showing why specificity and alignment with business strategy are non-negotiable. His emphasis on balancing hard data with human insights reflects his deep understanding of how modern PR must operate.",
    author: "Todd Murphy",
    title: "President at Truescope, U.S., FIBEP President and AMEC Member.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
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

  // State for email input in pre-order section
  const [preOrderEmail, setPreOrderEmail] = useState('');
  const [preOrderEmailError, setPreOrderEmailError] = useState('');

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
  const [isPreorderOnly, setIsPreorderOnly] = useState(false);

  // Function to handle pre-order button click
  const handlePreOrder = () => {
    // Reset payment status
    setPaymentStatus({ message: '', type: null });

    // Set pre-order only mode
    setIsPreorderOnly(true);

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
                  onClick={handlePreOrder}
                  className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 sm:px-8 rounded-md shadow-lg transition duration-300 flex items-center justify-center touch-target"
                >
                  Pre-order Now <ChevronRight className="ml-2 h-5 w-5" />
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What Readers Say</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8 sm:p-10">
                <Quote className="h-12 w-12 text-blue-100 mb-6" />

                <div className="relative h-48 overflow-hidden">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentTestimonial ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <p className="text-xl text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                          <p className="text-gray-600">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
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

      {/* Pre-order Section */}
      <section id="pre-order" className="py-12 sm:py-16 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pre-order Your Copy Today</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-blue-100 text-lg">
              Be among the first to receive "The Science of Public Relations" and get exclusive Bonus
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Special Pre-order Price</h3>
                  <p className="text-blue-100 mb-4">Limited time offer with exclusive Discount</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">₦12,000</span>
                    <span className="text-blue-200 line-through ml-2">₦15,000</span>
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">SAVE 20%</span>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="preOrderEmail" className="block text-sm font-medium text-white mb-1">
                  Your Email Address (required for pre-order)
                </label>
                <input
                  type="email"
                  id="preOrderEmail"
                  value={preOrderEmail}
                  onChange={(e) => setPreOrderEmail(e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${preOrderEmailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 text-sm sm:text-base`}
                  placeholder="your.email@example.com"
                />
                {preOrderEmailError && <p className="mt-1 text-sm text-red-300">{preOrderEmailError}</p>}
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
                onClick={handlePreOrder}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-8 rounded-md shadow-lg transition duration-300 flex items-center justify-center"
              >
                Pre-order Now <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        email={preOrderEmail}
        isPreorderOnly={isPreorderOnly}
      />
    </div>
  );
};

export default BookPage;
