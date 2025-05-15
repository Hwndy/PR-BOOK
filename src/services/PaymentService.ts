const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://pr-book.onrender.com/api'
  : 'http://localhost:5001/api';

export const PaymentService = {
  initializePayment: async (paymentData: {
    email: string;
    amount: string;
    productName: string;
    quantity: number;
  }) => {
    try {
      const response = await fetch(`${API_URL}/initialize-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  },

  verifyPayment: async (reference: string) => {
    try {
      const response = await fetch(`${API_URL}/verify-payment/${reference}`);
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }
};