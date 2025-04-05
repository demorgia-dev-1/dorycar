import axios from 'axios';

export const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Ride services
export const rideService = {
  createRide: async (rideData) => {
    const response = await api.post(`/rides/create`, rideData);
    return response.data;
  },

  searchRides: async (searchData) => {
    const response = await api.get(`/rides/search`, { params: searchData });
    return response.data;
  },

  getRides: async () => {
    const response = await api.get(`/rides`);
    return response.data;
  },

  acceptRide: async (rideId, userId) => {
    const response = await api.post(`/rides/${rideId}/accept/${userId}`);
    return response.data;
  },

  expressInterest: async (rideId) => {
    const response = await api.post(`/rides/${rideId}/interest`);
    return response.data;
  },

  cancelRide: async (rideId) => {
    const response = await api.post(`/rides/${rideId}/cancel`);
    return response.data;
  },

  completeRide: async (rideId) => {
    const response = await api.post(`/rides/${rideId}/complete`);
    return response.data;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;