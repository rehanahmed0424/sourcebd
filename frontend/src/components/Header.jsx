import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <header>
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
                  <i className="fas fa-user-circle"></i>
                  <span>{user.firstName || user.name}</span>
                  <i className={`fas fa-chevron-${isProfileOpen ? 'up' : 'down'}`}></i>
                </button>
                
                {isProfileOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setIsProfileOpen(false)}>
                      <i className="fas fa-user"></i> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setIsProfileOpen(false)}>
                      <i className="fas fa-shopping-bag"></i> My Orders
                    </Link>
                    <Link to="/quotes" onClick={() => setIsProfileOpen(false)}>
                      <i className="fas fa-file-invoice"></i> My Quotes
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="logout-btn">
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
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
              Cart{cartCount > 0 && <span className="cart-count">({cartCount})</span>}
            </Link>
            
            <Link to="/help" className="help-link">
              <i className="fas fa-question-circle"></i> Help
            </Link>
          </div>
        </div>
      </div>
      
      <nav>
        <div className="container">
          <ul className="nav-menu">
            <li><Link to="/category/all">All Categories</Link></li>
            <li><Link to="/category/textile">Textile & Leather</Link></li>
            <li><Link to="/category/agriculture">Agriculture</Link></li>
            <li><Link to="/category/electronics">Electronics</Link></li>
            <li><Link to="/category/food">Food & Beverage</Link></li>
            <li><Link to="/category/machinery">Machinery</Link></li>
            <li><Link to="/category/chemicals">Chemicals</Link></li>
            <li><Link to="/category/construction">Construction</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;