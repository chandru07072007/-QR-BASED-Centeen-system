// Private Route Component
// Protects routes that require authentication

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the component
    return children;
};

export default PrivateRoute;
