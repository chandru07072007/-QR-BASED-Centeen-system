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
        <div className="cart-container-new">
            {/* Header */}
            <header className="cart-nav">
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
                        <button className="nav-link" onClick={() => navigate('/menu')}>MENU</button>
                        <button className="nav-link" onClick={() => navigate('/my-orders')}>MY ORDERS</button>
                        <button className="nav-link active">CART</button>
                        <button className="btn-logout-new" onClick={handleLogout}>
                            LOGOUT
                        </button>
                    </nav>
                </div>
            </header>

            {/* Page Header */}
            <div className="cart-page-header">
                <h1 className="cart-page-title">YOUR ORDER</h1>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
                <div className="empty-cart-new">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add some delicious items from the menu!</p>
                    <button className="btn-browse-menu" onClick={() => navigate('/menu')}>
                        BROWSE MENU
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-content-wrapper">
                        <div className="cart-items-new">
                            {cart.map(item => (
                                <div key={item._id} className="cart-item-new">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="cart-item-image-new"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';
                                        }}
                                    />

                                    <div className="cart-item-info">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <p className="cart-item-price-single">₹{item.price} each</p>
                                    </div>

                                    <div className="cart-item-controls">
                                        <div className="quantity-controls-new">
                                            <button
                                                className="qty-btn-new"
                                                onClick={() => decreaseQuantity(item._id)}
                                            >
                                                −
                                            </button>
                                            <span className="qty-display-new">{item.quantity}</span>
                                            <button
                                                className="qty-btn-new"
                                                onClick={() => increaseQuantity(item._id)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="cart-item-total-new">₹{item.price * item.quantity}</p>

                                        <button
                                            className="btn-remove-new"
                                            onClick={() => removeFromCart(item._id)}
                                            title="Remove item"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="cart-summary-new">
                            <h2 className="summary-title">ORDER SUMMARY</h2>

                            <div className="summary-details">
                                <div className="summary-row-new">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="summary-row-new">
                                    <span>Tax (5%)</span>
                                    <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row-new summary-total">
                                    <span>Total</span>
                                    <span>₹{(totalAmount * 1.05).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="cart-actions-new">
                                <button
                                    className="btn-split-bill"
                                    onClick={handleSplitBill}
                                >
                                    💰 SPLIT BILL
                                </button>
                                <button
                                    className="btn-proceed-payment"
                                    onClick={handleProceedToPayment}
                                >
                                    PROCEED TO PAYMENT →
                                </button>
                            </div>

                            <button
                                className="btn-clear-cart-new"
                                onClick={clearCart}
                            >
                                CLEAR CART
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Split Bill Modal */}
            {showSplitModal && (
                <div className="modal-overlay-new" onClick={() => setShowSplitModal(false)}>
                    <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">SPLIT BILL</h2>
                        <p className="modal-description">Enter the number of people to split the bill equally</p>

                        <div className="split-input-group-new">
                            <label>Number of People:</label>
                            <input
                                type="number"
                                min="1"
                                value={splitCount}
                                onChange={(e) => setSplitCount(parseInt(e.target.value) || 1)}
                                className="split-input"
                            />
                        </div>

                        <div className="split-calculation-new">
                            <div className="calc-row-new">
                                <span>Total Amount:</span>
                                <span className="calc-amount">₹{(totalAmount * 1.05).toFixed(2)}</span>
                            </div>
                            <div className="calc-row-new">
                                <span>Number of People:</span>
                                <span className="calc-amount">{splitCount}</span>
                            </div>
                            <div className="calc-divider"></div>
                            <div className="calc-row-new calc-highlight">
                                <span>Per Person:</span>
                                <span className="calc-amount-large">₹{((totalAmount * 1.05) / splitCount).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="modal-actions-new">
                            <button
                                className="btn-modal-cancel"
                                onClick={() => setShowSplitModal(false)}
                            >
                                CANCEL
                            </button>
                            <button
                                className="btn-modal-confirm"
                                onClick={handleConfirmSplit}
                            >
                                PROCEED TO PAYMENT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
