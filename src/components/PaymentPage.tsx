import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, AlertCircle } from 'lucide-react';

interface PaymentPageProps {
  // Props can be added if needed
}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get email from query params or use empty string
  const email = queryParams.get('email') || '';
  const amount = queryParams.get('amount') || '2999';
  const productName = queryParams.get('product') || 'The Science of Public Relations (Digital Edition)';
  
  const [paymentStatus, setPaymentStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | null;
  }>({ message: '', type: null });
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initialize payment on component mount
  useEffect(() => {
    if (email) {
      initializePayment();
    }
  }, []);
  
  const initializePayment = () => {
    setIsProcessing(true);
    
    // Create a form to submit to Paystack
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://paystack.com/pay/thescienceofpublicrelations';
    
    // Add email field
    const emailField = document.createElement('input');
    emailField.type = 'hidden';
    emailField.name = 'email';
    emailField.value = email;
    form.appendChild(emailField);
    
    // Add amount field (in kobo)
    const amountField = document.createElement('input');
    amountField.type = 'hidden';
    amountField.name = 'amount';
    amountField.value = (parseInt(amount) * 100).toString();
    form.appendChild(amountField);
    
    // Add metadata
    const metadataField = document.createElement('input');
    metadataField.type = 'hidden';
    metadataField.name = 'metadata';
    metadataField.value = JSON.stringify({
      product_name: productName,
      is_preorder: true
    });
    form.appendChild(metadataField);
    
    // Add callback URL
    const callbackUrlField = document.createElement('input');
    callbackUrlField.type = 'hidden';
    callbackUrlField.name = 'callback_url';
    callbackUrlField.value = `${window.location.origin}/payment-success`;
    form.appendChild(callbackUrlField);
    
    // Add to document and submit
    document.body.appendChild(form);
    form.submit();
    
    // Clean up
    document.body.removeChild(form);
  };
  
  const handleGoBack = () => {
    navigate('/book#pre-order');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Book
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Pre-order</h1>
        
        {paymentStatus.message && (
          <div className={`mb-6 p-4 rounded-md ${
            paymentStatus.type === 'success' ? 'bg-green-100 text-green-800' : 
            paymentStatus.type === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {paymentStatus.type === 'error' ? (
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{paymentStatus.message}</span>
              </div>
            ) : (
              <div className="flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{paymentStatus.message}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">₦{parseInt(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{email}</span>
            </div>
          </div>
        </div>
        
        {!isProcessing ? (
          <button
            onClick={initializePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-md transition duration-300 flex items-center justify-center"
          >
            Proceed to Payment
          </button>
        ) : (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600">Redirecting to payment gateway...</p>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Your payment is securely processed by Paystack. You will receive a confirmation email once your pre-order is complete.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
