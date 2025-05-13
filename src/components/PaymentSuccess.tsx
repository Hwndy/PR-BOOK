import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ChevronRight, Download } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [reference, setReference] = useState(queryParams.get('reference') || 'N/A');
  
  useEffect(() => {
    // In a real implementation, you would verify the payment on the server
    console.log('Payment reference:', reference);
  }, [reference]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for pre-ordering "The Science of Public Relations"
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Reference:</span>
            <span className="font-medium">{reference}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-green-600">Completed</span>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">1</span>
              </div>
              <span className="text-gray-600">
                You will receive a confirmation email with your pre-order details.
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">2</span>
              </div>
              <span className="text-gray-600">
                We'll notify you when the book is available for download or shipping.
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">3</span>
              </div>
              <span className="text-gray-600">
                Your exclusive bonuses will be available in your confirmation email.
              </span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate('/book')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-md transition duration-300 flex items-center justify-center"
          >
            Back to Book Page <ChevronRight className="ml-2 h-5 w-5" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
