import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css'; // We'll create this CSS file

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="page-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="legal-content">
          <div className="section">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information to provide better services to our users. The types of information we collect include:
            </p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, company details</li>
              <li><strong>Business Information:</strong> Company size, industry, purchase history</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
            </ul>
          </div>

          <div className="section">
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect for the following purposes:
            </p>
            <ul>
              <li>To provide and maintain our services</li>
              <li>To process transactions and manage orders</li>
              <li>To communicate with you about products, services, and promotions</li>
              <li>To improve our Platform and user experience</li>
              <li>To ensure Platform security and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div className="section">
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul>
              <li><strong>Suppliers:</strong> Necessary information to fulfill your orders</li>
              <li><strong>Service Providers:</strong> Companies that help us operate our business</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale</li>
            </ul>
          </div>

          <div className="section">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, 
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul>
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and data storage</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
            </ul>
          </div>

          <div className="section">
            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
              Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </div>

          <div className="section">
            <h2>6. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>

          <div className="section">
            <h2>7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Platform and hold certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
          </div>

          <div className="section">
            <h2>8. Third-Party Links</h2>
            <p>
              Our Platform may contain links to other websites that are not operated by us. We have no control over and 
              assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </div>

          <div className="section">
            <h2>9. Children's Privacy</h2>
            <p>
              Our Platform is not intended for use by children under the age of 18. We do not knowingly collect personally 
              identifiable information from children under 18.
            </p>
          </div>

          <div className="section">
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "last updated" date.
            </p>
          </div>

          <div className="section">
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@sourcebd.com</p>
              <p><strong>Phone:</strong> +880 XXXX-XXXXXX</p>
              <p><strong>Address:</strong> Dhaka, Bangladesh</p>
            </div>
          </div>

          <div className="navigation-links">
            <Link to="/terms-of-service" className="btn btn-outline">
              View Terms of Service
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

export default PrivacyPolicy;