// Main App Component
// Sets up routing and context providers

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Import components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StaffLogin from './components/Auth/StaffLogin';
import Home from './components/User/Home';
import Menu from './components/User/Menu';
import Cart from './components/User/Cart';
import Payment from './components/User/Payment';
import Bill from './components/User/Bill';
import MyOrders from './components/User/MyOrders';
import StaffDashboard from './components/Staff/StaffDashboard';
import PrivateRoute from './components/Common/PrivateRoute';

import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="App">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/staff-login" element={<StaffLogin />} />

                            {/* User Routes - Protected */}
                            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                            <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
                            <Route path="/order" element={<PrivateRoute><Menu /></PrivateRoute>} />
                            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                            <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
                            <Route path="/bill" element={<PrivateRoute><Bill /></PrivateRoute>} />
                            <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />

                            {/* Staff Routes - Protected */}
                            <Route path="/staff" element={<PrivateRoute><StaffDashboard /></PrivateRoute>} />
                        </Routes>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
