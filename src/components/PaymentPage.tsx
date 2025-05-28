import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, AlertCircle } from 'lucide-react';

// Component props type
type PaymentPageProps = object;

// Paystack types
interface PaystackResponse {
  reference: string;
  status: string;
  message: string;
  transaction: string;
}

interface PaystackPop {
  newTransaction(options: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    reference: string;
    metadata: {
      product_name?: string;
      is_order?: boolean;
      [key: string]: any;
    };
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
  }): void;
}

// Extend Window interface to include Paystack
declare global {
  interface Window {
    PaystackPop: {
      new(): PaystackPop;
    };
  }
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Get parameters from query params with fallbacks
  const email = queryParams.get('email') || '';
  const amount = queryParams.get('amount') || '2999';
  // Check both 'productName' and 'product' for backward compatibility
  const productName = queryParams.get('productName') || queryParams.get('product') || 'The Science of Public Relations (Digital Edition)';
  const quantity = parseInt(queryParams.get('quantity') || '1');

  // Log the parameters for debugging
  console.log('Payment parameters:', { email, amount, productName, quantity });

  const [paymentStatus, setPaymentStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | null;
  }>({ message: '', type: null });

  const [isProcessing, setIsProcessing] = useState(false);

  // Function to load Paystack script with retry mechanism
  const loadPaystackScript = (retryCount = 0, maxRetries = 3) => {
    return new Promise<void>((resolve, reject) => {
      // Check if script is already in the DOM
      const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');

      // If script already exists and Paystack is defined, resolve immediately
      if (existingScript && typeof window.PaystackPop !== 'undefined') {
        console.log('Paystack script already loaded');
        resolve();
        return;
      }

      // If script exists but Paystack is not defined, remove it to try again
      if (existingScript) {
        console.log('Removing existing Paystack script to reload');
        existingScript.remove();
      }

      // Create and add the script
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.id = 'paystack-script';

      script.onload = () => {
        console.log('Paystack script loaded, checking if initialized...');

        // Give a small delay to ensure the script is fully initialized
        setTimeout(() => {
          if (typeof window.PaystackPop !== 'undefined') {
            console.log('Paystack initialized successfully');
            resolve();
          } else {
            console.error('Paystack script loaded but PaystackPop is undefined');

            // Retry if we haven't reached max retries
            if (retryCount < maxRetries) {
              console.log(`Retrying Paystack script load (${retryCount + 1}/${maxRetries})`);
              script.remove();
              loadPaystackScript(retryCount + 1, maxRetries)
                .then(resolve)
                .catch(reject);
            } else {
              reject(new Error('Failed to initialize Paystack after multiple attempts'));
            }
          }
        }, 1000); // Wait 1 second to ensure script is initialized
      };

      script.onerror = () => {
        console.error('Failed to load Paystack script');

        // Retry if we haven't reached max retries
        if (retryCount < maxRetries) {
          console.log(`Retrying Paystack script load (${retryCount + 1}/${maxRetries})`);
          loadPaystackScript(retryCount + 1, maxRetries)
            .then(resolve)
            .catch(reject);
        } else {
          reject(new Error('Failed to load Paystack script after multiple attempts'));
        }
      };

      document.head.appendChild(script);
    });
  };

  // Function to verify payment with the server
  const verifyPayment = useCallback(async (reference: string) => {
    try {
      const response = await fetch('https://pr-book.onrender.com/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();

      if (data.status) {
        // Payment verified successfully
        setIsProcessing(false);
        setPaymentStatus({
          message: 'Payment successful! Redirecting to confirmation page...',
          type: 'success'
        });

        // Redirect to success page after a short delay
        setTimeout(() => {
          navigate(`/payment-success?reference=${reference}&amount=${amount}`);
        }, 1500);
      } else {
        // Payment verification failed
        setIsProcessing(false);
        setPaymentStatus({
          message: 'Payment verification failed. Please contact support with your reference number.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);

      setIsProcessing(false);
      setPaymentStatus({
        message: 'Unable to verify payment. Please contact support with your reference number.',
        type: 'error'
      });
    }
  }, [navigate]);

  // Define initializePayment function with useCallback
  const initializePayment = useCallback(async () => {
    console.log('Initializing payment...');
    setIsProcessing(true);

    try {
      // Make sure Paystack is loaded first
      await loadPaystackScript();

      // Double-check that Paystack is available
      if (typeof window.PaystackPop === 'undefined') {
        console.error('PaystackPop is still undefined after loading script');
        throw new Error('Paystack not loaded properly');
      }

      // Log what we're sending to the server
      console.log('Initializing payment with:', { email, amount, productName });

      // Validate required fields
      if (!email) {
        throw new Error('Email is required for payment');
      }

      if (!amount) {
        throw new Error('Amount is required for payment');
      }

      if (!productName) {
        throw new Error('Product name is required for payment');
      }

      // First, initialize payment on the server to store order in database
      const initResponse = await fetch('https://pr-book.onrender.com/api/initialize-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount,
          productName
        }),
      });

      const initData = await initResponse.json();

      if (!initData.status) {
        throw new Error(initData.message || 'Failed to initialize payment');
      }

      // Get the reference and access code from the server response
      const reference = initData.data.reference;
      const accessCode = initData.data.access_code;

      console.log('Payment initialized on server, reference:', reference);

      // If we have an access code, use the hosted checkout page (more reliable)
      if (accessCode) {
        console.log('Using hosted checkout with access code:', accessCode);
        setPaymentStatus({
          message: 'Redirecting to secure payment page...',
          type: 'info'
        });

        // Redirect to Paystack hosted checkout
        window.location.href = `https://checkout.paystack.com/${accessCode}`;
        return;
      }

      // Fallback to popup if no access code is available
      console.log('No access code available. Initializing Paystack popup...');

      try {
        // Initialize Paystack inline with a try-catch block
        const paystack = new window.PaystackPop();
        console.log('PaystackPop instance created successfully');

        paystack.newTransaction({
          key: 'pk_live_2f49e5fc90b7dc3fb5465f8a684bf4e0b0405608', // Replace with your actual Paystack public key
          email: email,
          amount: parseInt(amount) * 100, // Convert to kobo
          currency: 'NGN',
          reference: reference,
          metadata: {
            product_name: productName,
            is_order: true
          },
          callback: function(response: PaystackResponse) {
            console.log('Payment complete! Reference:', response.reference);

            // Verify payment on server
            verifyPayment(response.reference);
          },
          onClose: function() {
            console.log('Transaction was not completed, window closed.');
            setIsProcessing(false);
            setPaymentStatus({
              message: 'Payment window was closed. You can try again when you\'re ready.',
              type: 'info'
            });
          }
        });
      } catch (paystackError) {
        console.error('Error initializing Paystack popup:', paystackError);

        // Try an alternative approach - direct redirect to Paystack
        setPaymentStatus({
          message: 'Having trouble with the payment popup. Trying an alternative method...',
          type: 'info'
        });

        // Even without an access code, we can try the direct URL with reference
        // This might not work, but it's worth a try as a last resort
        window.location.href = `https://checkout.paystack.com/pay/${reference}`;
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({
        message: error instanceof Error ? error.message : 'Payment initialization failed',
        type: 'error'
      });
      setIsProcessing(false);
    }
  }, [email, amount, productName, verifyPayment, loadPaystackScript]);

  // Initialize payment on component mount
  useEffect(() => {
    // Only proceed if we have an email
    if (!email) return;

    // Add a small delay before initializing to ensure the component is fully mounted
    const timer = setTimeout(() => {
      console.log('Component fully mounted, loading Paystack script...');

      // Load Paystack script first
      loadPaystackScript()
        .then(() => {
          console.log('Paystack script loaded successfully in useEffect');
          // Initialize payment after script is loaded
          initializePayment();
        })
        .catch(error => {
          console.error('Error loading Paystack:', error);
          setIsProcessing(false);
          setPaymentStatus({
            message: 'Payment service is currently unavailable. Please try again later.',
            type: 'error'
          });
        });
    }, 500); // 500ms delay

    // Cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, [email, initializePayment, loadPaystackScript]);

  const handleGoBack = () => {
    navigate('/book#order');
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

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your order</h1>

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
          <div className="space-y-3">
            <button
              onClick={initializePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-md transition duration-300 flex items-center justify-center"
            >
              Proceed to Payment
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>Having trouble with the payment popup?</p>
              <button
                onClick={async () => {
                  try {
                    setIsProcessing(true);

                    // Log what we're sending to the server
                    console.log('Sending to server:', { email, amount, productName });

                    // Initialize payment on the server first
                    const initResponse = await fetch('https://pr-book.onrender.com/api/initialize-payment', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email: email || 'customer@example.com', // Provide a fallback email
                        amount: amount || '2999',
                        productName: productName || 'The Science of Public Relations'
                      }),
                    });

                    const initData = await initResponse.json();

                    if (!initData.status) {
                      throw new Error(initData.message || 'Failed to initialize payment');
                    }

                    // Check if we have an access code from Paystack
                    if (initData.data.access_code) {
                      // Use access code for direct checkout (preferred method)
                      window.location.href = `https://checkout.paystack.com/${initData.data.access_code}`;
                    } else {
                      // Fallback to using the popup if no access code is available
                      console.log('No access code available, falling back to popup payment');
                      setPaymentStatus({
                        message: 'Preparing payment popup...',
                        type: 'info'
                      });

                      // Load Paystack script and use popup
                      await loadPaystackScript();

                      if (typeof window.PaystackPop === 'undefined') {
                        throw new Error('Paystack not loaded properly');
                      }

                      const paystack = new window.PaystackPop();
                      paystack.newTransaction({
                        key: PAYSTACK_PUBLIC_KEY,
                        email,
                        amount: parseInt(amount) * 100,
                        currency: 'NGN',
                        metadata: {
                          product_name: productName,
                          quantity: quantity
                        },
                        callback: function(response: PaystackResponse) {
                          console.log('Payment complete! Reference:', response.reference);
                          verifyPayment(response.reference);
                        },
                        onClose: function() {
                          setIsProcessing(false);
                          setPaymentStatus({
                            message: 'Payment window was closed. You can try again when you\'re ready.',
                            type: 'info'
                          });
                        }
                      });
                    }
                  } catch (error) {
                    console.error('Direct checkout error:', error);
                    setIsProcessing(false);
                    setPaymentStatus({
                      message: 'Payment service is currently unavailable. Please try again later.',
                      type: 'error'
                    });
                  }
                }}
                className="text-blue-600 hover:text-blue-800 underline mt-1"
              >
                Try Direct Checkout Instead
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600">Redirecting to payment gateway...</p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>Your payment is securely processed by Paystack. You will receive a confirmation email once your order is complete.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
