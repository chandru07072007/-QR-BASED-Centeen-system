// Login Component
// User login page with email and password

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Call login API
            const response = await authAPI.login(formData);

            // Store token and user data
            login(response.data.user, response.data.token, false);

            // Navigate to home page
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split-container">
            <div className="auth-image-section">
                <div className="food-image-wrapper">
                    <img
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=1000&fit=crop"
                        alt="Delicious Burger"
                        className="food-image"
                    />
                </div>
            </div>

            <div className="auth-form-section">
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <h2>Login</h2>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>I agree terms & condition</span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-orange" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="auth-links">
                        <p>
                            Already have an account? <Link to="/register">Sign up</Link>
                        </p>
                        <p>
                            Are you staff? <Link to="/staff-login">Staff Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
