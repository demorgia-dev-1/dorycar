// import api from './api';
// import io from 'socket.io-client';
// import { API_BASE_URL } from './api';
// import axios from 'axios';

// const socket = io('/', {
//   path: '/socket.io',
//   autoConnect: false
// });

// export const rideService = {
  
//   userProfile: async () => {
//     const response = await axios.get(`/me`)
//     return response.data
//   },
//   // Ride CRUD operations
//   createRide: async (rideData) => {
//     console.log(" Payload to backend:", rideData);
//     const response = await axios.post(`${API_BASE_URL}/rides/create`, rideData);
//     return response.data;
//   },
  
//   searchRides: async ({ origin, destination, date }) => {
//     const params = new URLSearchParams();
//     if (origin) params.append("origin", origin);
//     if (destination) params.append("destination", destination);
//     if (date instanceof Date && !isNaN(date)) {
//       params.append("date", date.toISOString());
//     }

//     const res = await api.get(`/rides/search?${params.toString()}`);
//     return res.data;
//   },

//   getRides: async () => {
//     const response = await axios.get(`${API_BASE_URL}/rides`);
//     return response.data;
//   },

//   getUserById: async (userId) => {
//     const res = await api.get(`/users/${userId}`);
//     return res.data;
//   }
// ,  
//   // Interest management
//   expressInterest: async (rideId) => {
//     const response = await axios.post(`${API_BASE_URL}/rides/${rideId}/interest`);
//     return response.data;
//   },

//   acceptInterest: async (rideId, userId) => {
//     const response = await axios.post(`${API_BASE_URL}/rides/${rideId}/accept/${userId}`);
//     return response.data;
//   },

//   startRide: async (rideId) => {
//     const response = await axios.put(`${API_BASE_URL}/rides/${rideId}/start`);
//     return response.data
//   },

//   cancelRide: async (rideId, cancellationReason) => {
//     const response = await axios.put(`${API_BASE_URL}/rides/${rideId}/cancel`, {cancellationReason});
//     return response.data;
//   },

//   completeRide: async (rideId) => {
//     const response = await axios.put(`${API_BASE_URL}/rides/${rideId}/complete`);
//     return response.data;
//   },

//   submitReview: async ({ rideId, toUserId, rating, comment }) => {
//     const response = await axios.post(`/rides/${rideId}/review`, {
//       toUserId,
//       rating,
//       comment
//     });
//     return response.data;
//   },
  

//   // Chat functionality
//   getMessages: async (rideId) => {
//     const res = await axios.get(`/rides/${rideId}/messages`);
//     return res.data;
//   },

//   sendMessage: async (rideId, content) => {
//     const res = await axios.post(`/rides/${rideId}/messages`, { content });
//     return res.data;
//   },

//   // Optional real-time hooks if you're using socket-based chat
//   connectToChat: () => { /* socket connect logic */ },
//   joinRideChat: (rideId) => { /* join room logic */ },
//   leaveRideChat: (rideId) => { /* leave room logic */ },
//   onNewMessage: (callback) => { /* socket on message */ },
//   offNewMessage: () => { /* remove socket listener */ },
// };

// src/services/api.js
import axios from "axios";
import { io } from "socket.io-client";

export const API_BASE_URL = "http://localhost:5000/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Socket instance
const socket = io("http://localhost:5000", {
  path: "/socket.io",
  autoConnect: false,
});

// Export rideService
export const rideService = {
  userProfile: async () => (await api.get("/me")).data,

  createRide: async (rideData) =>
    (await api.post("/rides/create", rideData)).data,

  searchRides: async ({ origin, destination, date }) => {
    const params = new URLSearchParams();
    if (origin) params.append("origin", origin);
    if (destination) params.append("destination", destination);
    if (date instanceof Date && !isNaN(date)) {
      params.append("date", date.toISOString());
    }
    return (await api.get(`/rides/search?${params.toString()}`)).data;
  },

  getRides: async () => (await api.get("/rides")).data,

  expressInterest: async (rideId) =>
    (await api.post(`/rides/${rideId}/interest`)).data,

  acceptRide: async (rideId, userId) =>
    (await api.post(`/rides/${rideId}/accept/${userId}`)).data,

  startRide: async (rideId) => (await api.put(`/rides/${rideId}/start`)).data,

  cancelRide: async (rideId, reason) =>
    (await api.put(`/rides/${rideId}/cancel`, { cancellationReason: reason }))
      .data,

  completeRide: async (rideId) =>
    (await api.put(`/rides/${rideId}/complete`)).data,

  submitReview: async ({ rideId, toUserId, rating, comment }) =>
    (
      await api.post(`/rides/${rideId}/review`, {
        toUserId,
        rating,
        comment,
      })
    ).data,

  getMessages: async (rideId) =>
    (await api.get(`/rides/${rideId}/messages`)).data,

  sendMessage: async (rideId, content) =>
    (await api.post(`/rides/${rideId}/messages`, { content })).data,

  // Real-time chat using socket.io
  connectToChat: () => {
    if (!socket.connected) socket.connect();
  },

  joinRideChat: (rideId) => {
    socket.emit("join-ride-chat", rideId);
  },

  leaveRideChat: (rideId) => {
    socket.emit("leave-ride-chat", rideId);
  },

  onNewMessage: (callback) => {
    socket.on("new-message", callback);
  },

  offNewMessage: () => {
    socket.off("new-message");
  },
};
