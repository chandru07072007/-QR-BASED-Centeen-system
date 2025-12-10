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
        <div className="home-container-new">
            {/* Header Navigation */}
            <header className="home-nav">
                <div className="nav-content">
                    <div className="nav-logo">
                        <div className="logo-icon">🍽️</div>
                        <div className="logo-text">
                            <span className="logo-title">CANTEEN</span>
                            <span className="logo-subtitle">RESTAURANT</span>
                        </div>
                    </div>
                    <nav className="nav-menu">
                        <a href="#home" className="nav-link active">HOME</a>
                        <a href="#about" className="nav-link">ABOUT US</a>
                        <a href="#menu" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/menu'); }}>MENU</a>
                        <a href="#orders" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/my-orders'); }}>MY ORDERS</a>
                        <a href="#cart" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/cart'); }}>
                            CART ({getCartCount()})
                        </a>
                        <button className="btn-logout-new" onClick={handleLogout}>
                            LOGOUT
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            BEST QUALITY<br />FOOD
                        </h1>
                        <p className="hero-description">
                            Experience the finest dining with fresh ingredients and authentic flavors.
                            Our expert chefs prepare every dish with passion and precision,
                            ensuring you get the best quality food every time.
                        </p>
                        <button className="btn-book-table" onClick={() => navigate('/menu')}>
                            BROWSE MENU
                        </button>
                    </div>
                    <div className="hero-images">
                        <div className="floating-ingredient tomato">🍅</div>
                        <div className="floating-ingredient basil-1">🌿</div>
                        <div className="floating-ingredient basil-2">🌿</div>
                        <div className="floating-ingredient pepper">🌶️</div>

                        <img
                            src="https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=400&fit=crop"
                            alt="Pasta"
                            className="food-img food-img-1"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=500&fit=crop"
                            alt="Main Course"
                            className="food-img food-img-2"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop"
                            alt="Pizza"
                            className="food-img food-img-3"
                        />
                    </div>
                </div>
            </section>

            {/* Welcome Info */}
            <div className="welcome-info">
                <p>👋 Welcome back, <strong>{user?.name}</strong>!</p>
            </div>
        </div>
    );
};

export default Home;
