import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    businessType: '',
    country: 'Bangladesh',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/api/register', formData);
      if (response.data.token) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="p-2 border rounded" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="p-2 border rounded" required />
        </div>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded mb-4" required />
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded mb-4" />
        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="w-full p-2 border rounded mb-4" />
        <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full p-2 border rounded mb-4">
          <option value="">Business Type</option>
          <option value="retail">Retail</option>
          <option value="wholesale">Wholesale</option>
          <option value="manufacturer">Manufacturer</option>
        </select>
        <select name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border rounded mb-4">
          <option value="Bangladesh">Bangladesh</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="p-2 border rounded" required />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="p-2 border rounded" required />
        </div>
        <button type="submit" className="w-full bg-green-700 text-white py-2 px-4 rounded font-semibold hover:bg-green-800">Register</button>
        <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;