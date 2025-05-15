const API_BASE_URL = 'http://localhost:5001/api';

export const PaymentService = {
  initializePayment: async (paymentData: {
    email: string;
    amount: string;
    productName: string;
    quantity: number;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/initialize-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  },

  verifyPayment: async (reference: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-payment/${reference}`);
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }
};