// src/components/rides/RideChat.jsx

import React, { useState, useEffect, useRef } from "react";
import chatSocket from "../../services/chatSocket";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { rideService } from "../../services/api";
import { useParams } from "react-router-dom";

const RideChat = ({currentUser }) => {

  const { rideId } = useParams(); // ✅ alias driverId to rideId

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

// Scroll to bottom when messages change
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
console.log("rideService keys:", Object.keys(rideService));


// Fetch chat history on load
useEffect(() => {
  const loadMessages = async () => {
    try {
      const data = await rideService.getMessages(rideId);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };
  loadMessages();
}, [rideId]);

// Setup socket listeners
useEffect(() => {
  chatSocket.connect();
  chatSocket.joinRideChat(rideId);

  const messageListener = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  chatSocket.onMessage(messageListener);

  return () => {
    chatSocket.leaveRideChat(rideId);
    chatSocket.disconnect();
  };
}, [rideId]);


  // Handle send
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const updated = await rideService.sendMessage(rideId, input.trim());
      setMessages(updated.messages || []); // or push latest only if API returns new one
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: "auto", mt: 15 }}>
      <Typography variant="h6" gutterBottom>
        Ride Chat
      </Typography>

      <List sx={{ maxHeight: 400, overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <ListItem
            key={index}
            sx={{
              justifyContent:
                msg.sender?._id === currentUser._id ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                maxWidth: "75%",
                bgcolor:
                  msg.sender?._id === currentUser._id ? "primary.main" : "#f1f1f1",
                color:
                  msg.sender?._id === currentUser._id ? "white" : "black",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {msg.sender?.name || "Unknown"}
              </Typography>
              <Typography variant="body1">{msg.content}</Typography>
            </Box>
          </ListItem>
        ))}
        <div ref={bottomRef}></div>
      </List>

      <Box display="flex" mt={2} gap={1}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default RideChat;
