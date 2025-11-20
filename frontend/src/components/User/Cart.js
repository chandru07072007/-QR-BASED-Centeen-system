// Cart Component
// Shows cart items with quantity controls and bill split option

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './User.css';

const Cart = () => {
    const navigate = useNavigate();
    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        getTotalAmount,
        clearCart
    } = useCart();
    const { logout } = useAuth();

    const [showSplitModal, setShowSplitModal] = useState(false);
    const [splitCount, setSplitCount] = useState(1);

    const totalAmount = getTotalAmount();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleProceedToPayment = () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Navigate to payment with split info
        navigate('/payment', {
            state: {
                splitCount: 1,
                totalAmount: totalAmount
            }
        });
    };

    const handleSplitBill = () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        setShowSplitModal(true);
    };

    const handleConfirmSplit = () => {
        if (splitCount < 1) {
            alert('Please enter a valid number of people');
            return;
        }
        setShowSplitModal(false);
        // Navigate to payment with split info
        navigate('/payment', {
            state: {
                splitCount: splitCount,
                totalAmount: totalAmount
            }
        });
    };

    return (
        <div className="cart-container">
            {/* Header */}
            <header className="cart-header">
                <button className="btn-back" onClick={() => navigate('/menu')}>
                    ← Back to Menu
                </button>
                <h1>Your Cart</h1>
                <button className="btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            {/* Cart Items */}
            {cart.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add some delicious items from the menu!</p>
                    <button className="btn btn-primary" onClick={() => navigate('/menu')}>
                        Browse Menu
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item._id} className="cart-item">
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="cart-item-image"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/100?text=Food';
                                    }}
                                />

                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-price">₹{item.price}</p>

                                    <div className="quantity-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => decreaseQuantity(item._id)}
                                        >
                                            −
                                        </button>
                                        <span className="qty-display">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => increaseQuantity(item._id)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="cart-item-total">
                                    <p className="item-total">₹{item.price * item.quantity}</p>
                                    <button
                                        className="btn-remove"
                                        onClick={() => removeFromCart(item._id)}
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (5%)</span>
                            <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{(totalAmount * 1.05).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="cart-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={handleSplitBill}
                        >
                            💰 Split Bill
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleProceedToPayment}
                        >
                            Proceed to Payment →
                        </button>
                    </div>

                    <button
                        className="btn-clear-cart"
                        onClick={clearCart}
                    >
                        Clear Cart
                    </button>
                </>
            )}

            {/* Split Bill Modal */}
            {showSplitModal && (
                <div className="modal-overlay" onClick={() => setShowSplitModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Split Bill</h2>
                        <p>Enter the number of people to split the bill equally</p>

                        <div className="split-input-group">
                            <label>Number of People:</label>
                            <input
                                type="number"
                                min="1"
                                value={splitCount}
                                onChange={(e) => setSplitCount(parseInt(e.target.value) || 1)}
                                className="form-input"
                            />
                        </div>

                        <div className="split-calculation">
                            <div className="calc-row">
                                <span>Total Amount:</span>
                                <span className="amount">₹{(totalAmount * 1.05).toFixed(2)}</span>
                            </div>
                            <div className="calc-row">
                                <span>Number of People:</span>
                                <span className="amount">{splitCount}</span>
                            </div>
                            <div className="calc-row highlight">
                                <span>Per Person:</span>
                                <span className="amount">₹{((totalAmount * 1.05) / splitCount).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowSplitModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleConfirmSplit}
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
