import axios from 'axios';
import { io } from 'socket.io-client';
export const socket = io('http://localhost:5000');


export const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const updateUser = async (userId, data) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};


// Ride services
export const rideService = {
  userProfile: async () => {
    const response = await api.get(`/me`)
    return response.data
  },
  createRide: async (rideData) => {
    const response = await api.post(`/rides/create`, rideData);
    return response.data;
  },
  // searchRides: async ({ origin, destination, date }) => {
  //   const params = new URLSearchParams();
  
  //   if (origin) params.append("origin", origin);
  //   if (destination) params.append("destination", destination);
  //   if (date instanceof Date && !isNaN(date)) {
  //     params.append("date", date.toISOString());
  //   }
  
  //   const response = await api.get(`${API_BASE_URL}/rides/search?${params.toString()}`);
  //   return response.data;
  // },

  searchRides: async ({ origin, destination, date }) => {
    const params = new URLSearchParams();
    if (origin) params.append("origin", origin);
    if (destination) params.append("destination", destination);
    if (date instanceof Date && !isNaN(date)) {
      params.append("date", date.toISOString());
    }

    const res = await api.get(`/rides/search?${params.toString()}`);
    return res.data;
  },

  getRides: async () => {
    const response = await api.get(`/rides`);
    return response.data;
  },

  acceptRide: async (rideId, userId) => {
    const response = await api.post(`/rides/${rideId}/accept/${userId}`);
    return response.data;
  },

  startRide: async(rideId) => {
    const response = await api.put(`/rides/${rideId}/start`);
    return response.data;
  },

  expressInterest: async (rideId) => {
    const response = await api.post(`/rides/${rideId}/interest`);
    return response.data;
  },

  cancelRide: async (rideId, cancellationReason) => {
    const response = await api.put(`/rides/${rideId}/cancel`, {cancellationReason});
    return response.data;
  },

  completeRide: async (rideId) => {
    const response = await api.put(`/rides/${rideId}/complete`);
    return response.data;
  },

  submitReview: async ({ rideId, toUserId, rating, comment }) => {
    const response = await api.post(`/rides/${rideId}/review`, {
      toUserId,
      rating,
      comment
    });
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