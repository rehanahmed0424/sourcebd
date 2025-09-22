import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3); // Hardcoded cart count for now

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
            <Link to="/Login"><i className="fas fa-user"></i> Sign In</Link>
            <Link to="/Cart"><i className="fas fa-shopping-cart"></i> Cart{cartCount > 0 && ` (${cartCount})`}</Link>
            <Link to="/Help"><i className="fas fa-question-circle"></i> Help</Link>
          </div>
        </div>
      </div>
      <nav>
        <div className="container">
          <ul className="nav-menu">
            <li><Link to="/Category">All Categories</Link></li> {/* Updated to /Category */}
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