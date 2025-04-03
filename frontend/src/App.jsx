import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Navbar from './components/Navbar';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import CreateRide from './components/rides/CreateRide';
import RideList from './components/rides/RideList';
import PrivateRoute from './components/PrivateRoute';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <div className="App">
          <Navbar />
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="rides">
              <Route index element={<PrivateRoute><RideList /></PrivateRoute>} />
              <Route path="create" element={<PrivateRoute><CreateRide /></PrivateRoute>} />
            </Route>
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;