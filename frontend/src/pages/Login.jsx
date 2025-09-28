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
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      if (response.data.message === 'Login successful') {
        login(response.data.token, response.data.user);
        setError('success');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="breadcrumb-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <span>Login</span>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      
      <section className="page-header section">
        <div className="container">
          <div className="page-header-content">
            <h1>Welcome Back</h1>
            <p>Sign in to continue sourcing with SourceBd</p>
          </div>
        </div>
      </section>
      
      <section className="form-section section">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>
            
            <div className="social-login-options">
              <button type="button" className="social-login-btn google" disabled={loading}>
                <i className="fab fa-google"></i> Login with Google
              </button>
              <button type="button" className="social-login-btn facebook" disabled={loading}>
                <i className="fab fa-facebook-f"></i> Login with Facebook
              </button>
            </div>
            
            <div className="divider">
              <span>Or login with email</span>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
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
                className="btn btn-primary btn-full"
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
      </section>
    </main>
  );
};

export default Login;