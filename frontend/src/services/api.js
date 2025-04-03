import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ride services
export const rideService = {
  createRide: async (rideData) => {
    const response = await api.post('/api/rides/create', rideData);
    return response.data;
  },

  searchRides: async (searchData) => {
    const response = await api.get('/api/rides/search', { params: searchData });
    return response.data;
  },

  getRides: async () => {
    const response = await api.get('/api/rides');
    return response.data;
  },

  acceptRide: async (rideId) => {
    const response = await api.post(`/api/rides/${rideId}/accept`);
    return response.data;
  },

  cancelRide: async (rideId) => {
    const response = await api.post(`/api/rides/${rideId}/cancel`);
    return response.data;
  },

  completeRide: async (rideId) => {
    const response = await api.post(`/api/rides/${rideId}/complete`);
    return response.data;
  }
};

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