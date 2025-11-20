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
        <div className="menu-container">
            {/* Header */}
            <header className="menu-header">
                <button className="btn-back" onClick={() => navigate('/home')}>
                    ← Back
                </button>
                <h1>Menu</h1>
                <div className="header-actions">
                    <button className="btn-icon" onClick={() => navigate('/my-orders')}>
                        📋
                    </button>
                    <button className="btn-icon" onClick={() => navigate('/cart')}>
                        🛒 ({getCartCount()})
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Table Number Display (if from QR scan) */}
            {tableNumber && (
                <div className="table-info">
                    <p>📍 Table Number: <strong>{tableNumber}</strong></p>
                </div>
            )}

            {/* Category Filter */}
            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Menu Items Grid */}
            <div className="menu-grid">
                {filteredItems.map(item => (
                    <div key={item._id} className="menu-card">
                        <div className="menu-image-container">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="menu-image"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image';
                                }}
                            />
                            {!item.is_available && (
                                <div className="unavailable-badge">Out of Stock</div>
                            )}
                        </div>

                        <div className="menu-content">
                            <h3>{item.name}</h3>
                            <p className="menu-description">{item.description}</p>
                            <div className="menu-footer">
                                <span className="menu-price">₹{item.price}</span>
                                <span className="menu-category">{item.category}</span>
                            </div>

                            {item.is_available && (
                                <div className="menu-actions">
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleBuyNow(item)}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="empty-state">
                    <p>No items found in this category</p>
                </div>
            )}

            {/* Floating Cart Button */}
            {getCartCount() > 0 && (
                <button
                    className="floating-cart-btn"
                    onClick={() => navigate('/cart')}
                >
                    🛒 View Cart ({getCartCount()})
                </button>
            )}
        </div>
    );
};

export default Menu;
