import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css'; // We'll create this CSS file

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="page-header">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="legal-content">
          <div className="section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using SourceBd ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. 
              If you do not agree to abide by the above, please do not use this Platform.
            </p>
          </div>

          <div className="section">
            <h2>2. User Responsibilities</h2>
            <p>
              As a user of the Platform, you agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the Platform only for lawful purposes</li>
              <li>Not engage in any fraudulent, deceptive, or harmful activities</li>
              <li>Respect intellectual property rights of others</li>
            </ul>
          </div>

          <div className="section">
            <h2>3. Account Registration</h2>
            <p>
              You must register for an account to access certain features of the Platform. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
          </div>

          <div className="section">
            <h2>4. Transactions and Payments</h2>
            <p>
              All transactions conducted through the Platform are subject to the following terms:
            </p>
            <ul>
              <li>Prices are listed in USD unless otherwise specified</li>
              <li>Payment must be completed before order processing</li>
              <li>Orders are subject to supplier confirmation and stock availability</li>
              <li>Cancellation policies vary by supplier</li>
            </ul>
          </div>

          <div className="section">
            <h2>5. Intellectual Property</h2>
            <p>
              All content on the Platform, including text, graphics, logos, and software, is the property of SourceBd 
              or its content suppliers and protected by international copyright laws.
            </p>
          </div>

          <div className="section">
            <h2>6. Limitation of Liability</h2>
            <p>
              SourceBd shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of or inability to use the Platform.
            </p>
          </div>

          <div className="section">
            <h2>7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to the Platform for conduct that 
              we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </div>

          <div className="section">
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes 
              through the Platform or via email. Continued use of the Platform after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div className="section">
            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without 
              regard to its conflict of law provisions.
            </p>
          </div>

          <div className="section">
            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> legal@sourcebd.com</p>
              <p><strong>Phone:</strong> +880 XXXX-XXXXXX</p>
              <p><strong>Address:</strong> Dhaka, Bangladesh</p>
            </div>
          </div>

          <div className="navigation-links">
            <Link to="/privacy-policy" className="btn btn-outline">
              View Privacy Policy
            </Link>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;