import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import apiClient from '../../utils/api';

interface OrderDetails {
  email: string;
  amount: number;
  reference: string;
  productName: string;
  status: string;
  paymentDate: string | Date;
}

type VerifiedOrderStatus = 'pending' | 'success' | 'failed' | 'error' | null;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const initialReference = queryParams.get('reference') || queryParams.get('trxref') || 'N/A';
  // Store initial URL params in case they are needed for fallback display on error/failure
  const initialAmount = queryParams.get('amount') || '0';
  const initialEmail = queryParams.get('email') || '';
  const initialProductName = queryParams.get('productName') || 'your recent purchase';


  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifiedOrderStatus, setVerifiedOrderStatus] = useState<VerifiedOrderStatus>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);


  useEffect(() => {
    setLoading(true);

    if (initialReference === 'N/A') {
      setVerifiedOrderStatus('error');
      setVerificationError("No payment reference found.");
      setLoading(false);
      return;
    }

    const verifyOrderStatus = async () => {
      try {
        const apiResponse = await apiClient.getOrderDetails(initialReference);

        if (apiResponse.status === true && apiResponse.data) {
          const backendStatus = apiResponse.data.status.toLowerCase();
          setOrderDetails({
            email: apiResponse.data.email,
            amount: apiResponse.data.amount / 100, // Assuming amount from backend is in kobo
            reference: apiResponse.data.reference,
            productName: apiResponse.data.productName,
            status: backendStatus,
            paymentDate: apiResponse.data.paymentDate ? new Date(apiResponse.data.paymentDate) : new Date(),
          });

          if (backendStatus === 'success') {
            setVerifiedOrderStatus('success');
          } else if (backendStatus === 'pending') {
            setVerifiedOrderStatus('pending');
          } else {
            setVerifiedOrderStatus('failed');
            setVerificationError(apiResponse.message || `Payment status: ${backendStatus}`);
          }
        } else {
          setVerifiedOrderStatus('failed');
          setVerificationError(apiResponse.message || "Failed to verify payment status.");
          setOrderDetails({ // Fallback details for display
            email: initialEmail,
            amount: parseInt(initialAmount) / 100,
            reference: initialReference,
            productName: initialProductName,
            status: 'failed',
            paymentDate: new Date(),
          });
        }
      } catch (error: any) {
        setVerifiedOrderStatus('error');
        setVerificationError(error.message || "Could not verify payment status. Please check your internet connection or contact support.");
        setOrderDetails(null); // No reliable details to show
      } finally {
        setLoading(false);
      }
    };

    verifyOrderStatus();
  }, [initialReference, initialAmount, initialEmail, initialProductName]);

  // Format amount to Nigerian Naira
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2 // Show kobo for currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg font-semibold text-gray-700">Verifying your payment...</p>
      </div>
    );
  }

  // Error or Failed States
  if (verifiedOrderStatus === 'error' || verifiedOrderStatus === 'failed') {
    const title = verifiedOrderStatus === 'error' ? "Error Verifying Payment" : "Payment Unsuccessful";
    const message = verificationError || (verifiedOrderStatus === 'error' ? "Please contact support for assistance." : "We could not confirm your payment.");
    const IconComponent = verifiedOrderStatus === 'error' ? AlertCircle : XCircle;
    const iconColor = verifiedOrderStatus === 'error' ? "text-orange-500" : "text-red-500";

    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4`}>
            <IconComponent className={`h-8 w-8 ${iconColor}`} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          {orderDetails && ( // Display some details even on failure if available
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left text-sm">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Transaction Details:</h3>
              <p><span className="font-medium">Reference:</span> {orderDetails.reference}</p>
              {orderDetails.productName && <p><span className="font-medium">Product:</span> {orderDetails.productName}</p>}
              {orderDetails.amount > 0 && <p><span className="font-medium">Amount:</span> {formatAmount(orderDetails.amount)}</p>}
            </div>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-300 flex items-center justify-center"
          >
            Go to Homepage
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Pending State
  if (verifiedOrderStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h1>
          <p className="text-gray-600 mb-6">
            Your payment is currently being processed. We will notify you via email at <span className="font-semibold">{orderDetails?.email || initialEmail}</span> once confirmed.
          </p>
          {orderDetails && (
            <div className="bg-gray-100 rounded-lg p-6 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-semibold text-gray-900">{orderDetails.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">{formatAmount(orderDetails.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-semibold text-gray-900 break-all">{orderDetails.reference}</span>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-300 flex items-center justify-center"
          >
            Back to Homepage
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Success State
  if (verifiedOrderStatus === 'success' && orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for ordering "{orderDetails.productName}"
            </p>

            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-gray-900">
                    {formatAmount(orderDetails.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900">{orderDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-semibold text-gray-900">
                    {orderDetails.productName?.toLowerCase().includes('paperback') ? 'Paperback' : 'E-Book'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-semibold text-gray-900 break-all">{orderDetails.reference}</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {orderDetails.paymentDate instanceof Date ? orderDetails.paymentDate.toLocaleDateString() : orderDetails.paymentDate}
                  </span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold px-2 py-0.5 rounded-full text-xs bg-green-200 text-green-800">
                    {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">What happens next?</h2>
              <p className="text-gray-600 text-sm">
                You will receive an email confirmation with your order details at <span className="font-medium">{orderDetails.email}</span>.
                {orderDetails.productName?.toLowerCase().includes('e-book') && " It will contain a secure link to access your e-book."}
                Please check your spam or junk folder if you don't see it within a few minutes.
              </p>
            </div>

            <button
              onClick={() => navigate(orderDetails.productName?.toLowerCase().includes('e-book') ? '/book' : '/')} // Or a dedicated "my orders" page
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-300 flex items-center justify-center"
            >
              {orderDetails.productName?.toLowerCase().includes('e-book') ? 'Back to Book Page' : 'Return to Homepage'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for any unexpected state not explicitly handled
  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
          <AlertCircle className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Information</h1>
        <p className="text-gray-600 mb-6">
          We are currently processing your payment information. Please wait a moment or refresh the page. If this persists, contact support.
        </p>
        <Link
          to="/"
          className="w-full block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-300 text-center"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
