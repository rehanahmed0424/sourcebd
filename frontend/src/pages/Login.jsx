import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      if (response.data.message === 'Login successful') {
        // Use the AuthContext login function with token and user data
        login(response.data.token, response.data.user);
        setError('success');
        
        // Redirect after successful login
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="page-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue sourcing with SourceBd</p>
        </div>
      </div>
      
      <div className="container">
        <div className="form-container">
          <div className="form-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
                className={error && error !== 'success' ? 'error-input' : ''}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
                className={error && error !== 'success' ? 'error-input' : ''}
              />
            </div>
            
            <div className="form-footer-links">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            
            {error && (
              <div className={`message ${error === 'success' ? 'success-message' : 'error-message'}`}>
                {error === 'success' ? 'Login successful! Redirecting...' : error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="form-footer">
              <p>
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;