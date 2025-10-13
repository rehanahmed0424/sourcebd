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
            <div className="terms-links">
              <Link to="/terms-of-service">Terms of Service</Link><span> | </span>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <br />
            </div>
            <ul className="footer-links">
              <li><Link to="https://www.facebook.com/iamShakibKhanbd"><i className="fab fa-facebook"></i> Facebook</Link></li>
              <li><Link to="https://www.linkedin.com/in/rehan-ahmed-33a380364/"><i className="fab fa-linkedin"></i> LinkedIn</Link></li>
              <li><Link to="https://x.com/Rehanahmedmitul"><i className="fab fa-twitter"></i> Twitter</Link></li>
              <li><Link to="https://www.instagram.com/theshakibkhan/"><i className="fab fa-instagram"></i> Instagram</Link></li>
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