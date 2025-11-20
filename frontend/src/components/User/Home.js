// Home Component
// User home page with canteen info and menu button

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './User.css';

const Home = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="header-content">
                    <h1>🍽️ College Canteen</h1>
                    <div className="header-actions">
                        <button className="btn-icon" onClick={() => navigate('/my-orders')}>
                            📋 My Orders
                        </button>
                        <button className="btn-icon" onClick={() => navigate('/cart')}>
                            🛒 Cart ({getCartCount()})
                        </button>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Welcome Section */}
            <div className="welcome-section">
                <h2>Welcome, {user?.name}! 👋</h2>
                <p>Enjoy delicious meals from our canteen</p>
            </div>

            {/* Banner Section */}
            <div className="banner-section">
                <div className="banner-card">
                    <img
                        src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
                        alt="Canteen Banner"
                        className="banner-image"
                    />
                    <div className="banner-overlay">
                        <h3>Fresh & Delicious Food</h3>
                        <p>Made with love, served with care</p>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="features-section">
                <div className="feature-card">
                    <div className="feature-icon">🍔</div>
                    <h3>Quality Food</h3>
                    <p>Fresh ingredients, hygienic preparation</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Quick Service</h3>
                    <p>Order ahead, skip the queue</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">💳</div>
                    <h3>Easy Payment</h3>
                    <p>UPI, Cards, and more</p>
                </div>
            </div>

            {/* Main Action Button */}
            <div className="action-section">
                <button
                    className="btn-large btn-primary"
                    onClick={() => navigate('/menu')}
                >
                    🍽️ View Menu & Order Now
                </button>
            </div>

            {/* Info Cards */}
            <div className="info-section">
                <div className="info-card">
                    <h4>⏰ Timings</h4>
                    <p>Mon - Sat: 8:00 AM - 6:00 PM</p>
                    <p>Sunday: Closed</p>
                </div>
                <div className="info-card">
                    <h4>📍 Location</h4>
                    <p>Ground Floor, Main Building</p>
                    <p>College Campus</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
