import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ChevronRight } from 'lucide-react';

interface OrderDetails {
  email: string;
  amount: number;
  reference: string;
  productName: string;
  status: string;
  paymentDate: string | Date;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Get all necessary parameters from URL
  const [reference] = useState(
    queryParams.get('reference') || queryParams.get('trxref') || 'N/A'
  );
  const [amount] = useState(queryParams.get('amount') || '0');
  const [email] = useState(queryParams.get('email') || '');
  const [productName] = useState(queryParams.get('productName') || '');

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Use the actual data from URL parameters instead of API call
        setOrderDetails({
          email: email,
          amount: parseInt(amount),
          reference: reference,
          productName: productName,
          status: 'success',
          paymentDate: new Date()
        });
      } catch (error) {
        console.error('Error in fetchOrderDetails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [reference, amount, email, productName]);

  // Format amount to Nigerian Naira
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for ordering "{orderDetails?.productName}"
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-gray-900">
                    {formatAmount(orderDetails?.amount || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900">{orderDetails?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-semibold text-gray-900">
                    {orderDetails?.productName?.includes('Paperback') ? 'Paperback' : 'E-Book'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-semibold text-gray-900">{orderDetails?.reference}</span>
                </div>
              </div>
            </div>

            <div className="text-left mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">What happens next?</h2>
              <p className="text-gray-600">
                You will receive a confirmation email with your order details.
              </p>
            </div>

            <button
              onClick={() => navigate('/book')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-300 flex items-center justify-center"
            >
              Back to Book Page
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
