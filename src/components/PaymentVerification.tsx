import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) {
      setVerificationStatus('failed');
      return;
    }

    // Removed PaymentService verification logic
    // You'll need to implement a new verification method here
    setVerificationStatus('failed');

  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        {verificationStatus === 'verifying' && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we verify your payment.</p>
          </div>
        )}
        {verificationStatus === 'success' && (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        )}
        {verificationStatus === 'failed' && (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-4">There was an error verifying your payment.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;