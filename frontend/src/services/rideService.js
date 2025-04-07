// import api from './api';
import io from 'socket.io-client';
import { API_BASE_URL } from './api';
import axios from 'axios';
import { search } from '../../../Backend/routes/rideRoutes';

const socket = io('/', {
  path: '/socket.io',
  autoConnect: false
});

export const rideService = {
  // Ride CRUD operations
  createRide: async (rideData) => {
    console.log("📦 Payload to backend:", rideData);
    const response = await axios.post(`${API_BASE_URL}/rides/create`, rideData);
    return response.data;
  },

  searchRides: async () => {
    const response = await axios.get(`${API_BASE_URL}/rides/search`);
    return response.data
  },

  getRides: async () => {
    const response = await axios.get(`${API_BASE_URL}/rides`);
    return response.data;
  },

  // Interest management
  expressInterest: async (rideId) => {
    const response = await axios.post(`${API_BASE_URL}/rides/${rideId}/interest`);
    return response.data;
  },

  acceptInterest: async (rideId, userId) => {
    const response = await axios.post(`${API_BASE_URL}/rides/${rideId}/accept/${userId}`);
    return response.data;
  },

  startRide: async (rideId) => {
    const response = await axios.put(`${API_BASE_URL}/rides/${rideId}/start`);
    return response.data
  },

  cancelRide: async (rideId, cancellationReason) => {
    const response = await axios.put(`${API_BASE_URL}/rides/${rideId}/cancel`, {cancellationReason});
    return response.data;
  },

  completeRide: async (rideId) => {
    const response = await axios.put(`${API_BASE_URL}/rides/${rideId}/complete`);
    return response.data;
  },

  // Chat functionality
  getMessages: async (rideId) => {
    const response = await axios.get(`${API_BASE_URL}/rides/${rideId}/messages`);
    return response.data;
  },

  sendMessage: async (rideId, content) => {
    const response = await axios.post(`${API_BASE_URL}/rides/${rideId}/messages`, { content });
    return response.data;
  },

  // Socket.IO chat methods
  connectToChat: () => {
    if (!socket.connected) {
      socket.connect();
    }
  },

  disconnectFromChat: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },

  joinRideChat: (rideId) => {
    socket.emit('join_ride_chat', rideId);
  },

  leaveRideChat: (rideId) => {
    socket.emit('leave_ride_chat', rideId);
  },

  onNewMessage: (callback) => {
    socket.on('new_message', callback);
  },

  offNewMessage: (callback) => {
    socket.off('new_message', callback);
  }
};