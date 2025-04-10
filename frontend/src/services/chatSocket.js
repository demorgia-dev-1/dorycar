// src/services/chatSocket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  path: "/socket.io",
  transports: ["websocket"]
});

const chatSocket = {
  connect: () => socket.connect(),
  disconnect: () => socket.disconnect(),
  joinRideChat: (rideId) => socket.emit("join_ride_chat", rideId),
  leaveRideChat: (rideId) => socket.emit("leave_ride_chat", rideId),
  sendMessage: (rideId, message) => socket.emit("send_message", { rideId, message }),
  onMessage: (callback) => socket.on("new_message", callback),
  offMessage: (callback) => socket.off("new_message", callback),
};

export default chatSocket;
