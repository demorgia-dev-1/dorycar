import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";
import api from "../services/api";
import io from "socket.io-client";

const AuthContext = createContext(null);

const socket = io("http://localhost:5173");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);

      socket.on("ride-accepted", (data) => {
        toast.info(
          `🎉 Your ride from ${data.origin} to ${data.destination} has been accepted by ${data.driver}`
        );
      });
    }

    return () => {
      socket.off("ride-accepted");
      socket.disconnect();
    };
  }, [user]);

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success("Registration successful!");
      navigate("/login");
      return response;
    } catch (error) {
      const errorMessage = error.message || "Registration failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.user && response.token) {
        const profileRes = await api.get("/users/me");
        setUser(profileRes.data);
        localStorage.setItem("user", JSON.stringify(profileRes.data));
        toast.success("Login successful!");
        navigate("/dashboard");
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem("user", JSON.stringify(merged));
  };

  const value = {
    user,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
