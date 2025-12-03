import api from './api';

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  accessToken?: string;
  user_id?: number;
  customer_id?: number;
  courier_id?: number;
}

interface Restaurant {
  id: number;
  name: string;
  rating: number;
  price_range: number;
}

interface Product {
  id: number;
  name: string;
  cost: number;
}

interface CreateOrderRequest {
  customer_id: number;
  restaurant_id: number;
  address_id: number;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

interface Order {
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

export const authService = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth', credentials);
    if (response.data.accessToken) {
      global.authToken = response.data.accessToken;
    }
    return response.data;
  },
};

export const restaurantService = {
  getAll: async (rating?: number, priceRange?: number): Promise<Restaurant[]> => {
    const params: any = {};
    if (rating) params.rating = rating;
    if (priceRange) params.price_range = priceRange;
    
    const response = await api.get('/api/restaurants', { params });
    // Backend returns { message: "Success", data: [...] }
    return response.data.data || response.data;
  },
  
  getById: async (id: number): Promise<Restaurant> => {
    const response = await api.get(`/api/restaurants/${id}`);
    return response.data.data || response.data;
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
  
  updateStatus: async (orderId: number, status: string): Promise<{ status: string }> => {
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
