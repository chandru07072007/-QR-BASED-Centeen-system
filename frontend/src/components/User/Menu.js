// Menu Component
// Displays menu items with Add to Cart and Buy Now options

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { menuAPI } from '../../utils/api';
import './User.css';

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart, getCartCount } = useCart();
    const { logout } = useAuth();

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [tableNumber, setTableNumber] = useState(null);

    // Get table number from URL query params (for QR code scan)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const table = params.get('table');
        if (table) {
            setTableNumber(table);
        }
    }, [location]);

    // Fetch menu items
    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await menuAPI.getAllItems();
            setMenuItems(response.data.items);
        } catch (err) {
            setError('Failed to load menu items');
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories
    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    // Filter items by category
    const filteredItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    // Handle Add to Cart
    const handleAddToCart = (item) => {
        addToCart(item);
        alert(`${item.name} added to cart!`);
    };

    // Handle Buy Now - add to cart and navigate to cart
    const handleBuyNow = (item) => {
        addToCart(item);
        navigate('/cart');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="menu-container-new">
            {/* Header */}
            <header className="menu-nav">
                <div className="nav-content">
                    <div className="nav-logo">
                        <div className="logo-icon">🍽️</div>
                        <div className="logo-text">
                            <span className="logo-title">CANTEEN</span>
                            <span className="logo-subtitle">RESTAURANT</span>
                        </div>
                    </div>
                    <nav className="nav-menu">
                        <button className="nav-link" onClick={() => navigate('/home')}>HOME</button>
                        <a href="#menu" className="nav-link active">MENU</a>
                        <button className="nav-link" onClick={() => navigate('/my-orders')}>MY ORDERS</button>
                        <button className="nav-link" onClick={() => navigate('/cart')}>
                            CART ({getCartCount()})
                        </button>
                        <button className="btn-logout-new" onClick={handleLogout}>
                            LOGOUT
                        </button>
                    </nav>
                </div>
            </header>

            {/* Page Header */}
            <div className="menu-page-header">
                <h1 className="menu-page-title">APPETIZERS</h1>
            </div>

            {/* Table Number Display (if from QR scan) */}
            {tableNumber && (
                <div className="table-info-new">
                    <p>📍 Table Number: <strong>{tableNumber}</strong></p>
                </div>
            )}

            {/* Filter and Sort Bar */}
            <div className="menu-controls">
                <div className="view-controls">
                    <button className="view-btn">
                        <span className="grid-icon">⊞</span>
                    </button>
                    <button className="view-btn active">
                        <span className="list-icon">☰</span>
                    </button>
                    <span className="items-count">Items {filteredItems.length}</span>
                </div>
                <div className="sort-control">
                    <label>Sort by</label>
                    <select className="sort-select">
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Name: A to Z</option>
                        <option>Name: Z to A</option>
                    </select>
                </div>
            </div>

            {/* Category Filter */}
            <div className="category-filter-new">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-btn-new ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Menu Items Grid */}
            <div className="menu-grid-new">
                {filteredItems.map(item => (
                    <div key={item._id} className="menu-card-new">
                        <div className="menu-image-wrapper">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="menu-image-new"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                                }}
                            />
                            {!item.is_available && (
                                <div className="unavailable-overlay">Out of Stock</div>
                            )}
                        </div>

                        <div className="menu-card-content">
                            <h3 className="menu-item-name">{item.name}</h3>
                            <div className="menu-rating">
                                {'⭐'.repeat(5)}
                            </div>
                            <p className="menu-item-price">₹{item.price}</p>

                            {item.is_available && (
                                <button
                                    className="btn-add-to-order"
                                    onClick={() => handleAddToCart(item)}
                                >
                                    ADD TO ORDER
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="empty-state-new">
                    <p>No items found in this category</p>
                </div>
            )}

            {/* Floating Cart Button */}
            {getCartCount() > 0 && (
                <button
                    className="floating-cart-btn-new"
                    onClick={() => navigate('/cart')}
                >
                    🛒 View Cart ({getCartCount()})
                </button>
            )}
        </div>
    );
};

export default Menu;
