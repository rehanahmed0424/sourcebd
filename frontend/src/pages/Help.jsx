import React from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  return (
    <div className="help-page">
      {/* Hero Section */}
      <section className="help-hero">
        <div className="container">
          <div className="help-hero-content">
            <h1>How can we help you?</h1>
            <p>
              Find answers to common questions or contact our support team
            </p>
          </div>
        </div>
      </section>

      {/* Help Topics Section */}
      <section className="help-topics-section section">
        <div className="container">
          <div className="section-title">
            <h2>Help Topics</h2>
            <p>Browse our main help categories</p>
          </div>
          <div className="topics-grid">
            <div className="topic-card">
              <div className="topic-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h3>Buying on SourceBd</h3>
              <p>
                Learn how to find products, place orders, and manage purchases
              </p>
              <Link to="#" className="btn btn-outline">Explore</Link>
            </div>
            <div className="topic-card">
              <div className="topic-icon">
                <i className="fas fa-store"></i>
              </div>
              <h3>Selling on SourceBd</h3>
              <p>
                Guidance for suppliers to list products and manage orders
              </p>
              <Link to="#" className="btn btn-outline">Explore</Link>
            </div>
            <div className="topic-card">
              <div className="topic-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Safety & Security</h3>
              <p>
                Tips for secure transactions and protecting your account
              </p>
              <Link to="#" className="btn btn-outline">Explore</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions</p>
          </div>
          <div className="faq-grid">
            <div className="faq-card">
              <h3>How do I create an account on SourceBd?</h3>
              <p>
                Creating an account on SourceBd is simple. Click on the "Sign In" button at the top right corner of the page, then select "Create Account." You'll need to provide your email address, create a password, and select whether you're registering as a buyer or supplier. After verifying your email, your account will be active.
              </p>
            </div>
            <div className="faq-card">
              <h3>How can I verify a supplier's credibility?</h3>
              <p>
                SourceBd offers several ways to verify suppliers. Look for the "Verified" badge on supplier profiles, which indicates they've passed our verification process. You can also check their transaction history, customer reviews, and response rate. For added assurance, we recommend starting with smaller orders before committing to large purchases.
              </p>
            </div>
            <div className="faq-card">
              <h3>What payment methods are accepted?</h3>
              <p>
                SourceBd supports multiple payment methods including bank transfers, credit cards, and secure online payment gateways. We also offer Trade Assurance protection for eligible orders. The available payment options will be displayed during the checkout process based on your location and the supplier's preferences.
              </p>
            </div>
            <div className="faq-card">
              <h3>How does the shipping process work?</h3>
              <p>
                Shipping arrangements are made between buyers and suppliers. After confirming an order, the supplier will typically provide shipping options and costs. SourceBd partners with various logistics providers to offer competitive shipping rates. You can track your order through the "My Orders" section once shipping details are provided by the supplier.
              </p>
            </div>
            <div className="faq-card">
              <h3>What is the minimum order quantity (MOQ)?</h3>
              <p>
                The Minimum Order Quantity (MOQ) varies by product and supplier. MOQs are set by suppliers based on their production capabilities and profit margins. You can find the MOQ for each product on its listing page. If you need a quantity below the stated MOQ, you can contact the supplier directly to discuss possible arrangements.
              </p>
            </div>
            <div className="faq-card">
              <h3>How can I become a verified supplier?</h3>
              <p>
                To become a verified supplier on SourceBd, you need to complete our verification process which includes submitting business documentation, proof of manufacturing capabilities, and passing our quality assessment. Visit our "For Suppliers" section and click on "Become a Verified Supplier" to start the application process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="help-contact-section section">
        <div className="container">
          <div className="section-title">
            <h2>Still need help? Contact us</h2>
            <p>Our support team is ready to assist you</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email Support</h3>
              <p>
                Send us an email and we'll respond within 24 hours
              </p>
              <div className="contact-info">support@sourcebd.com</div>
              <Link to="mailto:support@sourcebd.com" className="btn btn-outline">Send Email</Link>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <h3>Call Us</h3>
              <p>
                Speak directly with our support team during business hours
              </p>
              <div className="contact-info">+880 1700-000000</div>
              <Link to="tel:+8801700000000" className="btn btn-outline">Call Now</Link>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3>Live Chat</h3>
              <p>
                Chat with our support agents in real-time
              </p>
              <div className="contact-info">Available 24/7</div>
              <Link to="#" className="btn btn-primary">Start Chat</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section section">
        <div className="container">
          <div className="section-title">
            <h2>Helpful Resources</h2>
            <p>Additional materials to help you succeed on SourceBd</p>
          </div>
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>Buyer's Guide</h3>
              <p>
                Comprehensive guide to sourcing products on SourceBd
              </p>
              <Link to="#" className="btn btn-outline">Download Guide</Link>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-play-circle"></i>
              </div>
              <h3>Video Tutorials</h3>
              <p>
                Step-by-step video guides for buyers and suppliers
              </p>
              <Link to="#" className="btn btn-outline">Watch Videos</Link>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <i className="fas fa-newspaper"></i>
              </div>
              <h3>Blog & Articles</h3>
              <p>
                Tips, trends, and insights for B2B trading in Bangladesh
              </p>
              <Link to="#" className="btn btn-outline">Read Articles</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;