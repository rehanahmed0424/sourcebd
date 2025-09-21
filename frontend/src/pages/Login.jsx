import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', formData);
      if (response.data.token) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <span>Login</span>
          </li>
        </ol>
      </nav>
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
          <div className="login-options">
            <div className="social-login google">
              <i className="fab fa-google"></i> Login with Google
            </div>
            <div className="social-login facebook">
              <i className="fab fa-facebook-f"></i> Login with Facebook
            </div>
          </div>
          <div className="divider">
            <span>Or login with email</span>
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
              />
            </div>
            <div className="form-footer">
              <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
            </div>
            <button type="submit" className="btn btn-full">Sign In</button>
            <div className="form-footer">
              <p>
                Don’t have an account? <Link to="/register" className="text-blue-500 hover:underline">Sign Up</Link>
              </p>
            </div>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;