import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const goToStep = (stepNumber) => {
    setError('');
    if (stepNumber === 1) {
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
    } else if (stepNumber === 2) {
      setOtp(['', '', '', '', '', '']);
    } else if (stepNumber === 3) {
      setNewPassword('');
      setConfirmPassword('');
    } else if (stepNumber === 4) {
      // Reset after success
    }
    setStep(stepNumber);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      const response = await axios.post('/api/forgot-password', { email });
      if (response.data.success) {
        goToStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    try {
      const response = await axios.post('/api/reset-password/verify', { email, otp: otpValue });
      if (response.data.success) {
        goToStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/api/reset-password', { email, otp: otp.join(''), newPassword });
      if (response.data.success) {
        goToStep(4);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5 && value) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      otpRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = () => {
    setError('');
    // Simulate resend (replace with actual API call if needed)
    alert('A new OTP has been sent to your email');
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strengthClass = () => {
    const strength = checkPasswordStrength(newPassword);
    if (strength <= 1) return 'strength-weak';
    if (strength === 2) return 'strength-medium';
    if (strength >= 3) return 'strength-strong';
    return '';
  };

  const strengthFeedback = () => {
    const strength = checkPasswordStrength(newPassword);
    if (strength === 0) return 'Very weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Medium';
    if (strength === 3) return 'Strong';
    return 'Very strong';
  };

  return (
    <>
    <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <span>Forgot Password</span>
              </li>
            </ol>
          </nav>
      <main>
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>Reset Your Password</h2>
              <p>Follow the steps to reset your password</p>
            </div>
            <div className="steps">
              <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} id="step1">
                1
                <span className="step-label">Email</span>
              </div>
              <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} id="step2">
                2
                <span className="step-label">OTP</span>
              </div>
              <div className={`step ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`} id="step3">
                3
                <span className="step-label">Password</span>
              </div>
            </div>
            {step === 1 && (
              <form onSubmit={handleSendOtp} id="emailForm">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <button type="submit" className="btn btn-full">Send OTP</button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} id="otpForm">
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP</label>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                    We've sent a 6-digit code to your email
                  </p>
                  <div className="otp-container">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        className="otp-input"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        ref={(el) => (otpRefs.current[index] = el)}
                        required
                      />
                    ))}
                  </div>
                </div>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <button type="submit" className="btn btn-full">Verify OTP</button>
                <div className="form-footer">
                  <p>
                    Didn't receive the code?{' '}
                    <a href="#" onClick={handleResendOtp} id="resendOtp">
                      Resend OTP
                    </a>
                  </p>
                </div>
              </form>
            )}
            {step === 3 && (
              <form onSubmit={handleResetPassword} id="passwordForm">
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <div className="password-strength">
                    <div className={`strength-meter ${strengthClass()}`} id="passwordStrength"></div>
                  </div>
                  <div className="password-feedback" id="passwordFeedback">
                    {strengthFeedback()}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <button type="submit" className="btn btn-full">Reset Password</button>
              </form>
            )}
            {step === 4 && (
              <div id="successMessage">
                <i className="fas fa-check-circle"></i>
                <h3>Password Reset Successful</h3>
                <p>Your password has been reset successfully. You can now login with your new password.</p>
                <Link to="/login" className="btn">Login Now</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;