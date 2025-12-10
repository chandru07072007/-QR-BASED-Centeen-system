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
            <div className="my-orders-container-new">
                <div className="loading-new">
                    <div className="spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-orders-container-new">
            {/* Header */}
            <header className="my-orders-nav">
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
                        <button className="nav-link active">MY ORDERS</button>
                        <button className="nav-link" onClick={() => navigate('/cart')}>CART</button>
                        <button className="btn-logout-new" onClick={() => { /* Add logout handler */ }}>
                            LOGOUT
                        </button>
                    </nav>
                </div>
            </header>

            {/* Page Header */}
            <div className="my-orders-page-header">
                <h1 className="my-orders-page-title">MY ORDERS</h1>
                <button className="refresh-btn-new" onClick={fetchOrders}>
                    🔄 Refresh
                </button>
            </div>

            {error && <div className="error-message-new">{error}</div>}

            {/* Filter Buttons */}
            <div className="order-filters-new">
                <button
                    className={`filter-btn-new ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Orders
                </button>
                <button
                    className={`filter-btn-new ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button
                    className={`filter-btn-new ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="empty-state-orders">
                    <h2>No orders found</h2>
                    <p>Start ordering from our menu!</p>
                    <button className="btn-browse-menu" onClick={() => navigate('/menu')}>
                        BROWSE MENU
                    </button>
                </div>
            ) : (
                <div className="orders-timeline-new">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="order-card-new">
                            {/* Order Header */}
                            <div className="order-header-new">
                                <div className="order-info-new">
                                    <h3 className="order-number">ORDER #{order._id.slice(-6).toUpperCase()}</h3>
                                    <p className="order-date-new">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="order-amount-new">
                                    <span className="amount-label-new">Total</span>
                                    <span className="amount-value-new">₹{order.total_amount}</span>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="status-timeline-new">
                                <div className={`timeline-step-new ${['placed', 'preparing', 'ready', 'delivered'].includes(order.order_status) ? 'completed' : ''} ${order.order_status === 'placed' ? 'active' : ''}`}>
                                    <div className="step-icon-new">📝</div>
                                    <div className="step-label-new">Placed</div>
                                </div>
                                <div className={`timeline-line-new ${['preparing', 'ready', 'delivered'].includes(order.order_status) ? 'completed' : ''}`}></div>

                                <div className={`timeline-step-new ${['preparing', 'ready', 'delivered'].includes(order.order_status) ? 'completed' : ''} ${order.order_status === 'preparing' ? 'active' : ''}`}>
                                    <div className="step-icon-new">👨‍🍳</div>
                                    <div className="step-label-new">Preparing</div>
                                </div>
                                <div className={`timeline-line-new ${['ready', 'delivered'].includes(order.order_status) ? 'completed' : ''}`}></div>

                                <div className={`timeline-step-new ${['ready', 'delivered'].includes(order.order_status) ? 'completed' : ''} ${order.order_status === 'ready' ? 'active' : ''}`}>
                                    <div className="step-icon-new">✅</div>
                                    <div className="step-label-new">Ready</div>
                                </div>
                                <div className={`timeline-line-new ${order.order_status === 'delivered' ? 'completed' : ''}`}></div>

                                <div className={`timeline-step-new ${order.order_status === 'delivered' ? 'completed active' : ''}`}>
                                    <div className="step-icon-new">🎉</div>
                                    <div className="step-label-new">Delivered</div>
                                </div>
                            </div>

                            {/* Current Status Badge */}
                            <div className="current-status-new" style={{ backgroundColor: getStatusColor(order.order_status) }}>
                                <span className="status-icon-new">{getStatusIcon(order.order_status)}</span>
                                <span className="status-text-new">{getStatusText(order.order_status)}</span>
                            </div>

                            {/* Order Items */}
                            <div className="order-items-summary-new">
                                <h4 className="items-header">Items ({order.items.length})</h4>
                                <ul className="items-list-new">
                                    {order.items.map((item, idx) => (
                                        <li key={idx}>
                                            <span className="item-name-new">{item.name}</span>
                                            <span className="item-quantity-new">x{item.quantity}</span>
                                            <span className="item-price-new">₹{item.price * item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Additional Info */}
                            <div className="order-additional-info-new">
                                {order.split_count > 1 && (
                                    <div className="info-badge-new">
                                        👥 Split: {order.split_count} people (₹{order.per_person_amount} each)
                                    </div>
                                )}
                                {order.table_number && (
                                    <div className="info-badge-new">
                                        🪑 Table: {order.table_number}
                                    </div>
                                )}
                                <div className={`info-badge-new payment-${order.payment_status}`}>
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
