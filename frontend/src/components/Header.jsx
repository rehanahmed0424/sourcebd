import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount] = useState(3);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <header style={{ backgroundColor: '#2d4d31' }}>
      <div className="container">
        <div className="header-top">
          <div className="logo">
            <Link to="/">Source<span>Bd</span></Link>
          </div>
          
          <div className="search-bar">
            <input type="text" placeholder="Search for products, suppliers, or categories..." />
            <button><i className="fas fa-search"></i></button>
          </div>
          
          <div className="header-actions">
            {user ? (
              <div className="profile-dropdown">
                <button 
                  className="profile-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(!isProfileOpen);
                  }}
                >
                  <div className="profile-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <span className="profile-name">{user.firstName || user.name}</span>
                  <i className={`fas fa-chevron-${isProfileOpen ? 'up' : 'down'}`}></i>
                </button>
                
                {isProfileOpen && (
                  <div className="dropdown-card">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <div className="user-avatar">
                          <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user.firstName || user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown-body">
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="dropdown-item">
                        <i className="fas fa-user"></i>
                        <span>My Profile</span>
                      </Link>
                      
                      <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="dropdown-item">
                        <i className="fas fa-shopping-bag"></i>
                        <span>My Orders</span>
                      </Link>
                      
                      <Link to="/quotes" onClick={() => setIsProfileOpen(false)} className="dropdown-item">
                        <i className="fas fa-file-invoice"></i>
                        <span>My Quotes</span>
                      </Link>
                      
                      <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="dropdown-item">
                        <i className="fas fa-cog"></i>
                        <span>Settings</span>
                      </Link>
                    </div>
                    
                    <div className="dropdown-footer">
                      <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="sign-in-link">
                  <i className="fas fa-user"></i> Sign In
                </Link>
              </>
            )}
            
            <Link to="/cart" className="cart-link">
              <i className="fas fa-shopping-cart"></i> 
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            {/* New About Us and Contact buttons */}
            <Link to="/about" className="header-link">
              <i className="fas fa-info-circle"></i> About Us
            </Link>
            
            <Link to="/contact" className="header-link">
              <i className="fas fa-envelope"></i> Contact
            </Link>
            
            <Link to="/help" className="header-link">
              <i className="fas fa-question-circle"></i> Help
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;