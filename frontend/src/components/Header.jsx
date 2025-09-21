import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <div className="container">
        <div className="header-top">
          <div className="logo">Source<span>Bd</span></div>
          <div className="search-bar">
            <input type="text" placeholder="Search for products, suppliers, or categories..." />
            <button><i className="fas fa-search"></i></button>
          </div>
          <div className="header-actions">
            <Link to="/login"><i className="fas fa-user"></i> Sign In</Link>
            <Link to="/cart"><i className="fas fa-shopping-cart"></i> Cart</Link>
            <Link to="/help"><i className="fas fa-question-circle"></i> Help</Link>
          </div>
        </div>
      </div>
      <nav>
        <div className="container">
          <ul className="nav-menu">
            <li><Link to="/">All Categories</Link></li>
            <li><Link to="#">Textile & Leather</Link></li>
            <li><Link to="#">Agriculture</Link></li>
            <li><Link to="#">Electronics</Link></li>
            <li><Link to="#">Food & Beverage</Link></li>
            <li><Link to="#">Machinery</Link></li>
            <li><Link to="#">Chemicals</Link></li>
            <li><Link to="#">Construction</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;