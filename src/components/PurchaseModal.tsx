import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Book format types and prices
const BOOK_FORMATS = {
  PAPERBACK: {
    name: 'Paperback',
    price: 15000, // ₦12,000 (20% off from ₦15,000)
    isorder: false
  },
  EBOOK: {
    name: 'E-Book',
    price: 10000, // ₦8,000 (20% off from ₦10,000)
    isorder: true
  }
};

type BookFormat = keyof typeof BOOK_FORMATS;

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  isorderOnly?: boolean;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  email = '',
  isorderOnly = false
}) => {
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>('EBOOK');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(BOOK_FORMATS.EBOOK.price);
  const [userEmail, setUserEmail] = useState(email);
  const [emailError, setEmailError] = useState('');

  // Update total price when format or quantity changes
  useEffect(() => {
    setTotalPrice(BOOK_FORMATS[selectedFormat].price * quantity);
  }, [selectedFormat, quantity]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Set default format based on which button was clicked
      setSelectedFormat(isorderOnly ? 'EBOOK' : 'PAPERBACK');
      setQuantity(1);
      setUserEmail(email);
      setEmailError('');
    }
  }, [isOpen, email, isorderOnly]);

  // Validate email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle format selection
  const handleFormatSelect = (format: BookFormat) => {
    setSelectedFormat(format);
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    // Always require an email for tracking purposes
    if (!userEmail) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(userEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Close the modal
    onClose();

    // Format the product name
    const productName = `The Science of Public Relations (${BOOK_FORMATS[selectedFormat].name})`;

    // Navigate to payment page
    navigate(`/payment?email=${encodeURIComponent(userEmail)}&amount=${totalPrice}&productName=${encodeURIComponent(productName)}&quantity=${quantity}`);
  };

  if (!isOpen) return null;

  // Create simple modal with basic HTML elements to ensure text visibility
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Purchase Book</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Format Selection */}
          <div className="mb-6">
            <p className="block text-gray-700 text-sm font-bold mb-3">
              Select Format:
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                className={`flex-1 py-3 px-4 border rounded-md ${
                  selectedFormat === 'PAPERBACK'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-700'
                }`}
                onClick={() => handleFormatSelect('PAPERBACK')}
              >
                Paperback
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 border rounded-md ${
                  selectedFormat === 'EBOOK'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-700'
                }`}
                onClick={() => handleFormatSelect('EBOOK')}
              >
                E-Book
              </button>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <p className="block text-gray-700 text-sm font-bold mb-3">
              Quantity:
            </p>
            <div className="flex items-center">
              <button
                type="button"
                className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <div className="w-16 mx-2 text-center font-medium text-lg">
                {quantity}
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          {/* Email input */}
          <div className="mb-6">
            <p className="block text-gray-700 text-sm font-bold mb-2">
              Your Email Address (required for order)
            </p>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className={`w-full px-3 py-2 border ${
                emailError ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              placeholder="your.email@example.com"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          {/* Total Price */}
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-700">Total Price:</p>
              <p className="text-2xl font-bold text-blue-600">
                ₦{totalPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <button
            type="button"
            onClick={handleProceedToPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-md"
          >
            Proceed to Payment
          </button>

          <div className="text-center mt-4 text-xs text-gray-500">
            Powered by Paystack
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
