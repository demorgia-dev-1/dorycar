import { saveAuthData, clearAuthData } from '../utils/auth';

// In your login function
const handleLogin = async (credentials) => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            saveAuthData(data.token, data.data.user);
            // Navigate to dashboard or home page
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
};

// Logout function
const handleLogout = () => {
    clearAuthData();
    // Navigate to login page
};