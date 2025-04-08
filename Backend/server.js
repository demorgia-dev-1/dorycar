require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const auth = require("./middleware/auth");
const socketAuth = require("./middleware/socketAuth");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

io.use(socketAuth);

io.on("connection", (socket) => {
  console.log(` Authenticated: ${socket.user.name} (${socket.user._id})`);

  socket.on("disconnect", () => {
    console.log(` Disconnected: ${socket.user.name}`);
  });
});

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
const authRoutes = require("./routes/authroutes");
const rideRoutes = require("./routes/rideRoutes");
const userRoutes = require("./routes/userRoutes");

// Apply routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/users", userRoutes);

// Protected route example
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "This is a protected route" });
});

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dorycar";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
