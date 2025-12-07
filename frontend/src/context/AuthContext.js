// Auth Context
// Manages authentication state and user info

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // Initialize from localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const [isStaff, setIsStaff] = useState(() => {
        const savedIsStaff = localStorage.getItem('isStaff');
        return savedIsStaff === 'true';
    });

    // Save to localStorage when state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        localStorage.setItem('isStaff', isStaff);
    }, [isStaff]);

    // Login function
    const login = (userData, authToken, staffFlag = false) => {
        setUser(userData);
        setToken(authToken);
        setIsStaff(staffFlag);
    };

    // Logout function
    const logout = () => {
        // Clear user-specific cart
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            const cartKey = `cart_${userData._id || userData.id}`;
            localStorage.removeItem(cartKey);
        }

        setUser(null);
        setToken(null);
        setIsStaff(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isStaff');
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!token;
    };

    const value = {
        user,
        token,
        isStaff,
        login,
        logout,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
