const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pr-book.onrender.com';

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
      headers: {
        ...this.getAuthHeaders(),
        'Accept': 'application/json'
      },
      credentials: 'include',
      mode: 'cors',
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

  // Resource management endpoints
  async getResourcePosts() {
    return this.request('/api/resources/posts');
  }

  async getResourcePost(postId: string) {
    return this.request(`/api/resources/posts/${postId}`);
  }

  async createResourcePost(post: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image?: string;
    imageUrl?: string;
    tags?: string;
    author?: string;
    status?: string;
    readTime?: string;
    seoTitle?: string;
    seoDescription?: string;
    slug?: string;
  }, imageFile?: File) {
    // If there's an image file, use FormData
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      // Append all other fields
      Object.entries(post).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${this.baseURL}/api/resources/posts`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Resource creation failed');
      }

      return response.json();
    } else {
      // No file upload, use JSON
      return this.request('/api/resources/posts', {
        method: 'POST',
        body: JSON.stringify(post)
      });
    }
  }

  async updateResourcePost(postId: string, post: {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    image?: string;
    imageUrl?: string;
    tags?: string;
    author?: string;
    status?: string;
    readTime?: string;
    seoTitle?: string;
    seoDescription?: string;
    slug?: string;
  }, imageFile?: File) {
    // If there's an image file, use FormData
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      // Append all other fields
      Object.entries(post).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${this.baseURL}/api/resources/posts/${postId}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Resource update failed');
      }

      return response.json();
    } else {
      // No file upload, use JSON
      return this.request(`/api/resources/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(post)
      });
    }
  }

  async deleteResourcePost(postId: string) {
    return this.request(`/api/resources/posts/${postId}`, {
      method: 'DELETE'
    });
  }

  async uploadResourceImage(formData: FormData) {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/api/resources/upload-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      credentials: 'include',
      mode: 'cors',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    return response.json();
  }

  async exportOrders() {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/api/admin/orders/export`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    return response.blob();
  }
}

export const apiClient = new ApiClient();
