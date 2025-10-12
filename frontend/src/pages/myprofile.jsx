import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './myprofile.css';

const MyProfile = () => {
  const { user, isAuthenticated, updateProfile, getAuthHeader } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [stats, setStats] = useState({
    orders: 0,
    rfqs: 0,
    wishlist: 0
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Fetch user statistics
  const fetchUserStats = async () => {
    if (!isAuthenticated) return;

    try {
      // Fetch orders count
      const ordersResponse = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();
        setStats(prev => ({ ...prev, orders: orders.length }));
      }

      // Fetch wishlist count (if you have a wishlist API)
      const wishlistResponse = await fetch('http://localhost:5000/api/wishlist', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (wishlistResponse.ok) {
        const wishlistData = await wishlistResponse.json();
        const wishlistCount = wishlistData.products?.length || 0;
        setStats(prev => ({ ...prev, wishlist: wishlistCount }));
      }

      // For RFQs, we'll use a placeholder since we don't have an RFQ API yet
      // You can replace this with actual RFQ API call when available
      setStats(prev => ({ ...prev, rfqs: 0 }));

    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        country: user.country || 'Bangladesh',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || ''
      });
      if (user.profilePicture) {
        setImagePreview(`http://localhost:5000${user.profilePicture}`);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserStats();
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Append profile picture if changed
      if (profileImage) {
        submitData.append('profilePicture', profileImage);
      }

      await updateProfile(submitData);
      setIsEditing(false);
      setProfileImage(null);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatMemberSince = (createdAt) => {
    if (!createdAt) return 'January 2024';
    
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="container">
          <div className="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    {getInitials(user?.firstName, user?.lastName)}
                  </div>
                )}
                {isEditing && (
                  <div className="avatar-upload">
                    <label htmlFor="profile-picture" className="upload-btn">
                      📷 Change Photo
                    </label>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h3>{user?.firstName} {user?.lastName}</h3>
                <p className="email">{user?.email}</p>
                <p className="member-since">
                  Member since {formatMemberSince(user?.createdAt)}
                </p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">{stats.orders}</div>
                <div className="stat-label">Orders</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.rfqs}</div>
                <div className="stat-label">RFQs</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.wishlist}</div>
                <div className="stat-label">Wishlist</div>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="disabled-field"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Street address"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="profile-section">
              <div className="section-header">
                <h2>Account Statistics</h2>
              </div>
              
              <div className="stats-details">
                <div className="stat-detail">
                  <span className="stat-label">Total Orders:</span>
                  <span className="stat-value">{stats.orders}</span>
                </div>
                <div className="stat-detail">
                  <span className="stat-label">Pending RFQs:</span>
                  <span className="stat-value">{stats.rfqs}</span>
                </div>
                <div className="stat-detail">
                  <span className="stat-label">Wishlist Items:</span>
                  <span className="stat-value">{stats.wishlist}</span>
                </div>
                <div className="stat-detail">
                  <span className="stat-label">Member Since:</span>
                  <span className="stat-value">{formatMemberSince(user?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;