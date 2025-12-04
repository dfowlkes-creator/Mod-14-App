import api from './api';

//
// Types
//

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  user_id?: number;
  customer_id?: number;
  courier_id?: number;
}

export interface Restaurant {
  id: number;
  name: string;
  rating: number;
  price_range: number;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  cost: number;
  description?: string;
}

export interface CreateOrderRequest {
  customer_id: number;
  restaurant_id: number;
  address_id: number;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface Order {
  id: number;
  customer_id: number;
  customer_name: string;
  restaurant_id: number;
  restaurant_name: string;
  courier_id?: number;
  courier_name?: string;
  status: string;
  timestamp: string;
  products: Array<{
    id: number;
    product_name: string;
    quantity: number;
    unit_cost: number;
    total_cost: number;
  }>;
  total_cost: number;
}

//
// Services
//

export const authService = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    console.log('🔐 POST to: /api/auth');

    const response = await api.post('/api/auth', credentials);

    // The backend might send success as boolean or string — normalize here.
    const raw: any = response.data;

    const success: boolean =
      typeof raw.success === 'string'
        ? raw.success === 'true'
        : !!raw.success;

    const normalized: AuthResponse = {
      ...raw,
      success,
    };

    if (normalized.accessToken) {
      // Store token globally
      (global as any).authToken = normalized.accessToken;

      // And on the axios instance for subsequent requests
      const anyApi = api as any;
      if (anyApi.defaults && anyApi.defaults.headers) {
        anyApi.defaults.headers.common =
          anyApi.defaults.headers.common || {};
        anyApi.defaults.headers.common['Authorization'] =
          `Bearer ${normalized.accessToken}`;
      }
    }

    return normalized;
  },
};

export const restaurantService = {
  getAll: async (
    rating?: number,
    priceRange?: number
  ): Promise<Restaurant[]> => {
    const params: Record<string, number> = {};
    if (rating) params.rating = rating;
    if (priceRange) params.price_range = priceRange;

    const response = await api.get('/api/restaurants', { params });
    // Backend returns { message: "Success", data: [...] } or just [...]
    return response.data.data ?? response.data;
  },

  getById: async (id: number): Promise<Restaurant> => {
    const response = await api.get(`/api/restaurants/${id}`);
    return response.data.data ?? response.data;
  },
};

export const productService = {
  getByRestaurant: async (restaurantId: number): Promise<Product[]> => {
    const response = await api.get('/api/products', {
      params: { restaurant: restaurantId },
    });
    return response.data;
  },
};

export const orderService = {
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  getCustomerOrders: async (customerId: number): Promise<Order[]> => {
    const response = await api.get('/api/orders', {
      params: { type: 'customer', id: customerId },
    });
    return response.data;
  },

  updateStatus: async (
    orderId: number,
    status: string
  ): Promise<{ status: string }> => {
    const response = await api.post(`/api/order/${orderId}/status`, { status });
    return response.data;
  },
};

export const userService = {
  getById: async (userId: number) => {
    const response = await api.get(`/api/user/${userId}`);
    return response.data;
  },
};
