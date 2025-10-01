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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError('');
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      if (response.data.success) {
        goToStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { 
        email, 
        otp: otpValue 
      });
      if (response.data.success) {
        goToStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', { 
        email, 
        otp: otp.join(''), 
        newPassword 
      });
      if (response.data.success) {
        goToStep(4);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
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
    } else if (value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
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

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      if (response.data.success) {
        setError('A new OTP has been sent to your email');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
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

      <main>
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>Reset Your Password</h2>
              <p>Follow the steps to reset your password</p>
            </div>
            
            {/* Progress Steps */}
            <div className="steps-container">
              <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <span className="step-label">Email</span>
              </div>
              <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <span className="step-label">OTP</span>
              </div>
              <div className={`step ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
                <div className="step-number">3</div>
                <span className="step-label">Password</span>
              </div>
            </div>

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleSendOtp}>
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
                    disabled={loading}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button 
                  type="submit" 
                  className="btn btn-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
                <div className="form-footer">
                  <p>
                    Remember your password? <Link to="/login">Login here</Link>
                  </p>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP</label>
                  <p className="otp-description">
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
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button 
                  type="submit" 
                  className="btn btn-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
                <div className="form-footer">
                  <p>
                    Didn't receive the code?{' '}
                    <button 
                      type="button" 
                      className="resend-link"
                      onClick={handleResendOtp}
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword}>
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
                    disabled={loading}
                  />
                  {newPassword && (
                    <div className="password-strength">
                      <div className="strength-info">
                        <span>Password strength:</span>
                        <span className={`strength-text ${strengthClass()}`}>
                          {strengthFeedback()}
                        </span>
                      </div>
                      <div className={`strength-meter ${strengthClass()}`}>
                        <div className="strength-bar"></div>
                      </div>
                    </div>
                  )}
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
                    disabled={loading}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button 
                  type="submit" 
                  className="btn btn-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            )}

            {/* Step 4: Success Message */}
            {step === 4 && (
              <div className="success-message">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3>Password Reset Successful</h3>
                <p>Your password has been reset successfully. You can now login with your new password.</p>
                <Link to="/login" className="btn btn-full">Login Now</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;