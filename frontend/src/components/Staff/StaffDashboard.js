// Staff Dashboard Component
// Staff panel for managing menu items and viewing orders

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { menuAPI, orderAPI, qrAPI } from '../../utils/api';
import './Staff.css';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const { logout, isStaff } = useAuth();

    const [activeTab, setActiveTab] = useState('menu'); // menu, orders, qr
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Menu form state
    const [showMenuForm, setShowMenuForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [menuForm, setMenuForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        is_available: true
    });

    // QR Code state
    const [qrCodes, setQrCodes] = useState([]);
    const [tableCount, setTableCount] = useState(5);

    // Check if user is staff
    useEffect(() => {
        if (!isStaff) {
            navigate('/home');
        }
    }, [isStaff, navigate]);

    // Fetch data based on active tab
    useEffect(() => {
        if (activeTab === 'menu') {
            fetchMenuItems();
        } else if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await menuAPI.getAllItems();
            setMenuItems(response.data.items);
        } catch (err) {
            setError('Failed to fetch menu items');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderAPI.getOrders();
            setOrders(response.data.orders);
        } catch (err) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/staff-login');
    };

    // Menu Management Functions
    const handleMenuFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMenuForm({
            ...menuForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddMenuItem = () => {
        setEditingItem(null);
        setMenuForm({
            name: '',
            description: '',
            price: '',
            category: '',
            image_url: '',
            is_available: true
        });
        setShowMenuForm(true);
    };

    const handleEditMenuItem = (item) => {
        setEditingItem(item);
        setMenuForm({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image_url: item.image_url,
            is_available: item.is_available
        });
        setShowMenuForm(true);
    };

    const handleSubmitMenuItem = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                // Update existing item
                await menuAPI.updateItem(editingItem._id, menuForm);
                alert('Menu item updated successfully!');
            } else {
                // Add new item
                await menuAPI.addItem(menuForm);
                alert('Menu item added successfully!');
            }
            setShowMenuForm(false);
            fetchMenuItems();
        } catch (err) {
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDeleteMenuItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await menuAPI.deleteItem(id);
                alert('Menu item deleted successfully!');
                fetchMenuItems();
            } catch (err) {
                alert(err.response?.data?.error || 'Delete failed');
            }
        }
    };

    // Order Management Functions
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await orderAPI.updateOrderStatus(orderId, newStatus);
            alert('Order status updated!');
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.error || 'Update failed');
        }
    };

    // QR Code Generation
    const handleGenerateQRCodes = async () => {
        try {
            setLoading(true);
            const response = await qrAPI.generateMultipleQR({
                table_count: tableCount
            });
            setQrCodes(response.data.qr_codes);
        } catch (err) {
            alert('Failed to generate QR codes');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadQR = (qrImage, tableNumber) => {
        const link = document.createElement('a');
        link.href = qrImage;
        link.download = `table_${tableNumber}_qr.png`;
        link.click();
    };

    return (
        <div className="staff-container">
            {/* Header */}
            <header className="staff-header">
                <h1>🔐 Staff Dashboard</h1>
                <button className="btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            {/* Tabs */}
            <div className="staff-tabs">
                <button
                    className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
                    onClick={() => setActiveTab('menu')}
                >
                    🍽️ Menu Management
                </button>
                <button
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    📋 Orders
                </button>
                <button
                    className={`tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
                    onClick={() => setActiveTab('qr')}
                >
                    📱 QR Codes
                </button>
            </div>

            {/* Content */}
            <div className="staff-content">
                {error && <div className="error-message">{error}</div>}

                {/* Menu Management Tab */}
                {activeTab === 'menu' && (
                    <div className="menu-management">
                        <div className="section-header">
                            <h2>Menu Items</h2>
                            <button className="btn btn-primary" onClick={handleAddMenuItem}>
                                + Add New Item
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading"><div className="spinner"></div></div>
                        ) : (
                            <div className="items-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menuItems.map(item => (
                                            <tr key={item._id}>
                                                <td>
                                                    <img src={item.image_url} alt={item.name} className="table-image" />
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{item.category}</td>
                                                <td>₹{item.price}</td>
                                                <td>
                                                    <span className={`status-badge ${item.is_available ? 'available' : 'unavailable'}`}>
                                                        {item.is_available ? 'Available' : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleEditMenuItem(item)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDeleteMenuItem(item._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="orders-management">
                        <h2>All Orders</h2>
                        {loading ? (
                            <div className="loading"><div className="spinner"></div></div>
                        ) : orders.length === 0 ? (
                            <p className="empty-message">No orders yet</p>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order._id} className="order-card">
                                        <div className="order-header">
                                            <h3>Order #{order._id.slice(-6)}</h3>
                                            <span className={`payment-badge ${order.payment_status}`}>
                                                {order.payment_status}
                                            </span>
                                        </div>

                                        <div className="order-details">
                                            <p><strong>Amount:</strong> ₹{order.total_amount}</p>
                                            {order.split_count > 1 && (
                                                <p><strong>Split:</strong> {order.split_count} people (₹{order.per_person_amount} each)</p>
                                            )}
                                            {order.table_number && (
                                                <p><strong>Table:</strong> {order.table_number}</p>
                                            )}
                                            <p><strong>Status:</strong> {order.order_status}</p>
                                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                                        </div>

                                        <div className="order-items">
                                            <strong>Items:</strong>
                                            <ul>
                                                {order.items.map((item, idx) => (
                                                    <li key={idx}>
                                                        {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="order-actions">
                                            <select
                                                value={order.order_status}
                                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                className="status-select"
                                            >
                                                <option value="placed">Placed</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="ready">Ready</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* QR Codes Tab */}
                {activeTab === 'qr' && (
                    <div className="qr-management">
                        <h2>Generate QR Codes for Tables</h2>

                        <div className="qr-generator">
                            <div className="form-group">
                                <label>Number of Tables:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={tableCount}
                                    onChange={(e) => setTableCount(parseInt(e.target.value) || 1)}
                                    className="form-input"
                                />
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={handleGenerateQRCodes}
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate QR Codes'}
                            </button>
                        </div>

                        {qrCodes.length > 0 && (
                            <div className="qr-grid">
                                {qrCodes.map(qr => (
                                    <div key={qr.table_number} className="qr-card">
                                        <h3>Table {qr.table_number}</h3>
                                        <img src={qr.qr_image} alt={`Table ${qr.table_number} QR`} className="qr-image" />
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleDownloadQR(qr.qr_image, qr.table_number)}
                                        >
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Menu Form Modal */}
            {showMenuForm && (
                <div className="modal-overlay" onClick={() => setShowMenuForm(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>

                        <form onSubmit={handleSubmitMenuItem} className="menu-form">
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={menuForm.name}
                                    onChange={handleMenuFormChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={menuForm.description}
                                    onChange={handleMenuFormChange}
                                    className="form-input"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹):</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={menuForm.price}
                                        onChange={handleMenuFormChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category:</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={menuForm.category}
                                        onChange={handleMenuFormChange}
                                        className="form-input"
                                        placeholder="e.g., Main Course, Snacks"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Image URL:</label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={menuForm.image_url}
                                    onChange={handleMenuFormChange}
                                    className="form-input"
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={menuForm.is_available}
                                        onChange={handleMenuFormChange}
                                    />
                                    Available for order
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowMenuForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingItem ? 'Update' : 'Add'} Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;
