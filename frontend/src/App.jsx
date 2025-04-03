import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import CreateRide from './components/rides/CreateRide';
import RideList from './components/rides/RideList';
import PrivateRoute from './components/PrivateRoute';
import theme from './theme';

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/rides/create"
                element={
                  <PrivateRoute>
                    <CreateRide />
                  </PrivateRoute>
                }
              />
              <Route
                path="/rides"
                element={
                  <PrivateRoute>
                    <RideList />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;