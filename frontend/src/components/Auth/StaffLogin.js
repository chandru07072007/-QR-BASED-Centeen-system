// Staff Login Component
// Staff login with hardcoded credentials

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import './Auth.css';

const StaffLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
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
            // Call staff login API
            const response = await authAPI.staffLogin(formData);

            // Store token and staff data
            login(response.data.staff, response.data.token, true);

            // Navigate to staff dashboard
            navigate('/staff');
        } catch (err) {
            setError(err.response?.data?.error || 'Staff login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card staff-card">
                <div className="auth-header">
                    <h1>🔐 Staff Portal</h1>
                    <h2>Staff Login</h2>
                    <div className="staff-info">
                        <p><strong>Default Credentials:</strong></p>
                        <p>Username: <code>admin123</code></p>
                        <p>Password: <code>1234</code></p>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            placeholder="Enter staff username"
                            value={formData.username}
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
                            placeholder="Enter staff password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Staff Login'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        <Link to="/login">← Back to User Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
