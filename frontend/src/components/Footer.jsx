import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>SourceBd</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="#">How It Works</Link></li>
              <li><Link to="#">Success Stories</Link></li>
              <li><Link to="#">Careers</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>For Buyers</h3>
            <ul className="footer-links">
              <li><Link to="#">Browse Categories</Link></li>
              <li><Link to="#">Browse Suppliers</Link></li>
              <li><Link to="#">Submit Buying Request</Link></li>
              <li><Link to="/help">Help Center</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Suppliers</h3>
            <ul className="footer-links">
              <li><Link to="#">Supplier Membership</Link></li>
              <li><Link to="#">Learning Center</Link></li>
              <li><Link to="#">Verification Services</Link></li>
            </ul>
          </div>
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