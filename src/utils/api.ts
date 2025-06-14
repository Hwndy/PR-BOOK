const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request('/api/admin/dashboard-stats');
  }

  async getOrders(params: {
    page?: number;
    search?: string;
    status?: string;
    limit?: number;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return this.request(`/api/admin/orders?${queryParams}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async deleteOrder(orderId: string) {
    return this.request(`/api/admin/orders/${orderId}`, {
      method: 'DELETE'
    });
  }

  async getCustomers() {
    return this.request('/api/admin/customers');
  }

  async getAnalytics(range: string = '12months') {
    return this.request(`/api/admin/analytics?range=${range}`);
  }

  async getContent() {
    return this.request('/api/admin/content');
  }

  async updateContent(content: any) {
    return this.request('/api/admin/content', {
      method: 'POST',
      body: JSON.stringify(content)
    });
  }

  async exportOrders() {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/api/admin/orders/export`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    return response.blob();
  }

  // Public/Payment related endpoints
  async initializePayment(email: string, amount: number, productName: string) {
    return this.request<any>('/api/initialize-payment', {
      method: 'POST',
      body: JSON.stringify({ email, amount, productName }),
    });
  }

  async verifyPayment(reference: string) {
    return this.request<any>('/api/verify-payment', {
      method: 'POST',
      body: JSON.stringify({ reference }),
    });
  }

  async getOrderDetails(reference: string) {
    // Ensure this endpoint does not require auth if it's for post-payment verification by customer
    // If it does, then the getAuthHeaders() will automatically add it if a token is present.
    return this.request<any>(`/api/order/${reference}`);
  }
}

export const apiClient = new ApiClient();
