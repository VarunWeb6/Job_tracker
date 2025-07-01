import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';
import api from './services/api';
import { Target } from 'lucide-react';

const App = () => {
    const { user, logout, setUser, setToken } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    setToken(storedToken); // Set token for api instance
                    const { data } = await api.get('/auth/me');
                    setUser(data.user);
                } catch (error) {
                    logout(); // Token is invalid or expired
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, []); // Run only once on app startup

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <Target className="h-12 w-12 text-blue-600 animate-pulse" />
                <p className="mt-4 text-gray-600">Loading Application...</p>
            </div>
        );
    }

    return (
        <div className="App">
            {user ? <Dashboard /> : <AuthForm />}
        </div>
    );
};

export default App;