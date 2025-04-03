const API_URL = 'http://localhost:5000/api';

const authService = {
  register: async (userData) => {
    try {
      console.log('Attempting registration with:', userData); // Debug log
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password
        })
      });

      console.log('Response received:', response); // Debug log
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  login: async (email, password) => {
    // Login implementation
  },

  logout: () => {
    localStorage.removeItem('user');
  }
};

export default authService;