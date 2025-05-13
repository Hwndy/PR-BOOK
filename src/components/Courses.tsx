import React from 'react';
import { BookOpen, Brain, Clock, Award, ChevronRight } from 'lucide-react';

const courses = [
  {
    title: "PR Measurement Fundamentals",
    duration: "21 days",
    price: "₦49,999",
    description: "Master the basics of PR measurement and evaluation with proven methodologies.",
    features: [
      "Comprehensive measurement frameworks",
      "Data collection techniques",
      "Basic analytics tools",
      "Report creation"
    ]
  },
  {
    title: "Advanced Analytics for PR",
    duration: "30 days",
    price: "₦79,999",
    description: "Deep dive into advanced PR analytics and data-driven decision making.",
    features: [
      "Advanced statistical analysis",
      "Predictive modeling",
      "Custom metrics development",
      "Strategic insights"
    ]
  },
  {
    title: "Digital PR Measurement",
    duration: "14 days",
    price: "₦39,999",
    description: "Learn to measure and evaluate digital PR campaigns effectively.",
    features: [
      "Social media analytics",
      "Digital engagement metrics",
      "Online sentiment analysis",
      "ROI calculation"
    ]
  }
];

const Courses = () => {
  const handleEnroll = (courseTitle: string, price: string) => {
    const paystack = new (window as any).PaystackPop();
    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: 'customer@email.com',
      amount: parseInt(price.replace(/[^\d]/g, '')) * 100, // Convert price to kobo
      currency: 'NGN',
      callback: (response: any) => {
        console.log('Enrollment complete! Reference:', response.reference);
        // Handle successful enrollment
      },
      onClose: () => {
        console.log('Transaction was not completed, window closed.');
      },
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            PR Measurement Courses
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Transform your PR measurement skills with our specialized courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <span className="ml-2 text-sm text-gray-500">{course.duration}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">{course.title}</h3>
                <p className="text-gray-600 mb-6">{course.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {course.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Award className="h-5 w-5 text-blue-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleEnroll(course.title, course.price)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-300 flex items-center justify-center"
                >
                  Enroll Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;