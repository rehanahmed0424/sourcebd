import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          {/* Only keeping the social links column */}
          <div className="footer-column">
            <h3>Stay Connected</h3>
            <ul className="footer-links">
              <li><Link to="#"><i className="fab fa-facebook"></i> Facebook</Link></li>
              <li><Link to="#"><i className="fab fa-linkedin"></i> LinkedIn</Link></li>
              <li><Link to="#"><i className="fab fa-twitter"></i> Twitter</Link></li>
              <li><Link to="#"><i className="fab fa-instagram"></i> Instagram</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2025 SourceBd - Bangladesh's Premier B2B Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;