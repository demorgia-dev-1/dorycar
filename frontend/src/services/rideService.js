import api from './api';
import io from 'socket.io-client';

const socket = io('/', {
  path: '/socket.io',
  autoConnect: false
});

export const rideService = {
  // Ride CRUD operations
  createRide: async (rideData) => {
    const response = await api.post('/api/rides/create', rideData);
    return response.data;
  },

  getRides: async () => {
    const response = await api.get('/api/rides');
    return response.data;
  },

  // Interest management
  expressInterest: async (rideId) => {
    const response = await api.post(`/api/rides/${rideId}/interest`);
    return response.data;
  },

  acceptInterest: async (rideId, userId) => {
    const response = await api.post(`/api/rides/${rideId}/accept/${userId}`);
    return response.data;
  },

  // Chat functionality
  getMessages: async (rideId) => {
    const response = await api.get(`/api/rides/${rideId}/messages`);
    return response.data;
  },

  sendMessage: async (rideId, content) => {
    const response = await api.post(`/api/rides/${rideId}/messages`, { content });
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