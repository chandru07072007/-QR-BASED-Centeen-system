// Axios API Configuration
// Centralized API calls with base URL and interceptors

import axios from 'axios';

// Base URL for backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    staffLogin: (data) => api.post('/auth/staff-login', data),
    verifyToken: () => api.get('/auth/verify'),
};

// Menu APIs
export const menuAPI = {
    getAllItems: () => api.get('/menu/items'),
    getItem: (id) => api.get(`/menu/items/${id}`),
    addItem: (data) => api.post('/menu/items', data),
    updateItem: (id, data) => api.put(`/menu/items/${id}`, data),
    deleteItem: (id) => api.delete(`/menu/items/${id}`),
    getCategories: () => api.get('/menu/categories'),
};

// Order APIs
export const orderAPI = {
    createOrder: (data) => api.post('/orders/', data),
    getOrders: () => api.get('/orders/'),
    getOrder: (id) => api.get(`/orders/${id}`),
    updatePaymentStatus: (id, status) => api.put(`/orders/${id}/payment`, { payment_status: status }),
    updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { order_status: status }),
};

// Payment APIs
export const paymentAPI = {
    generateUPI: (data) => api.post('/payment/generate-upi', data),
    verifyPayment: (data) => api.post('/payment/verify', data),
};

// QR Code APIs
export const qrAPI = {
    generateQR: (data) => api.post('/qr/generate', data),
    generateMultipleQR: (data) => api.post('/qr/generate-multiple', data),
};

export default api;
