import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/forgot-password', { email });
      if (response.data.success) {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reset-password', { email, otp, newPassword });
      if (response.data.success) {
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reset-password', { email, otp, newPassword });
      if (response.data.success) {
        alert('Password reset successful');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <button onClick={handleSendOtp} className="w-full bg-green-700 text-white py-2 px-4 rounded font-semibold hover:bg-green-800">Send OTP</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <button onClick={handleVerifyOtp} className="w-full bg-green-700 text-white py-2 px-4 rounded font-semibold hover:bg-green-800">Reset Password</button>
          </div>
        )}
        {step === 3 && (
          <div>
            <p className="text-green-600 mb-4">Password reset successful!</p>
            <button onClick={() => navigate('/login')} className="w-full bg-green-700 text-white py-2 px-4 rounded font-semibold hover:bg-green-800">Go to Login</button>
          </div>
        )}
        <p className="mt-4 text-center"><Link to="/login" className="text-blue-500 hover:underline">Back to Login</Link></p>
      </form>
    </div>
  );
};

export default ForgotPassword;