import { useEffect } from 'react';
import { getAuthData, isAuthenticated } from './utils/auth';

function App() {
    useEffect(() => {
        if (isAuthenticated()) {
            const { token, user } = getAuthData();
            // Initialize your app with the stored auth data
            // Set up your auth context or state management
        }
    }, []);

    // ... rest of your App component
}