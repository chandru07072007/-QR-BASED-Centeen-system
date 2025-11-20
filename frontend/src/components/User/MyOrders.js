// My Orders Component
// Shows user's order history and real-time status tracking

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../utils/api';
import './User.css';

const MyOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, completed

    useEffect(() => {
        fetchOrders();

        // Auto-refresh every 10 seconds for real-time updates
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getOrders();
            setOrders(response.data.orders);
            setError('');
        } catch (err) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            placed: '#FF9800',
            preparing: '#2196F3',
            ready: '#4CAF50',
            delivered: '#9E9E9E'
        };
        return colors[status] || '#666';
    };

    const getStatusIcon = (status) => {
        const icons = {
            placed: '📝',
            preparing: '👨‍🍳',
            ready: '✅',
            delivered: '🎉'
        };
        return icons[status] || '📦';
    };

    const getStatusText = (status) => {
        const texts = {
            placed: 'Order Placed',
            preparing: 'Preparing',
            ready: 'Ready for Pickup',
            delivered: 'Delivered'
        };
        return texts[status] || status;
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'pending') return ['placed', 'preparing', 'ready'].includes(order.order_status);
        if (filter === 'completed') return order.order_status === 'delivered';
        return true;
    });

    if (loading) {
        return (
            <div className="my-orders-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-orders-container">
            <header className="my-orders-header">
                <button className="btn-back" onClick={() => navigate('/home')}>
                    ← Back
                </button>
                <h1>My Orders</h1>
                <div className="refresh-btn" onClick={fetchOrders}>
                    🔄
                </div>
            </header>

            {error && <div className="error-message">{error}</div>}

            {/* Filter Buttons */}
            <div className="order-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Orders
                </button>
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <h2>No orders found</h2>
                    <p>Start ordering from our menu!</p>
                    <button className="btn btn-primary" onClick={() => navigate('/menu')}>
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="orders-timeline">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="order-timeline-card">
                            {/* Order Header */}
                            <div className="order-timeline-header">
                                <div className="order-info">
                                    <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                                    <p className="order-date">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="order-amount">
                                    <span className="amount-label">Total</span>
                                    <span className="amount-value">₹{order.total_amount}</span>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="status-timeline">
                                <div className={`timeline-step ${['placed', 'preparing', 'ready', 'delivered'].includes(order.order_status) ? 'completed' : ''} ${order.order_status === 'placed' ? 'active' : ''}`}>
                                    <div className="step-icon">📝</div>
                                    <div className="step-label">Placed</div>
                                </div>
                                <div className={`timeline-line ${['preparing', 'ready', 'delivered'].includes(order.order_status) ? 'completed' : ''}`}></div>

                                <div className={`timeline-step ${['preparing', 'ready', 'delivered'].includes(order.order_status) ? 'completed' : ''} ${order.order_status === 'preparing' ? 'active' : ''}`}>
                                    <div className="step-icon">👨‍🍳</div>
                                    <div className="step-label">Preparing</div>
                                </div>
                                <div className={`timeline-line ${['ready', 'delivered'].includes(order.order_status) ? 'completed' : ''}`}></div>

                                <div className={`timeline-step ${['ready', 'delivered'].includes(order.order_status) ? 'completed' : ''} ${order.order_status === 'ready' ? 'active' : ''}`}>
                                    <div className="step-icon">✅</div>
                                    <div className="step-label">Ready</div>
                                </div>
                                <div className={`timeline-line ${order.order_status === 'delivered' ? 'completed' : ''}`}></div>

                                <div className={`timeline-step ${order.order_status === 'delivered' ? 'completed active' : ''}`}>
                                    <div className="step-icon">🎉</div>
                                    <div className="step-label">Delivered</div>
                                </div>
                            </div>

                            {/* Current Status Badge */}
                            <div className="current-status" style={{ backgroundColor: getStatusColor(order.order_status) }}>
                                <span className="status-icon">{getStatusIcon(order.order_status)}</span>
                                <span className="status-text">{getStatusText(order.order_status)}</span>
                            </div>

                            {/* Order Items */}
                            <div className="order-items-summary">
                                <h4>Items ({order.items.length})</h4>
                                <ul className="items-list">
                                    {order.items.map((item, idx) => (
                                        <li key={idx}>
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-quantity">x{item.quantity}</span>
                                            <span className="item-price">₹{item.price * item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Additional Info */}
                            <div className="order-additional-info">
                                {order.split_count > 1 && (
                                    <div className="info-badge">
                                        👥 Split: {order.split_count} people (₹{order.per_person_amount} each)
                                    </div>
                                )}
                                {order.table_number && (
                                    <div className="info-badge">
                                        🪑 Table: {order.table_number}
                                    </div>
                                )}
                                <div className={`info-badge payment-${order.payment_status}`}>
                                    💳 Payment: {order.payment_status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
