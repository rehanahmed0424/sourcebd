import React from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  return (
    <div>
      <div className="breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li>Help Center</li>
        </ol>
      </div>
      <div className="page-header">
        <h1>How can we help you?</h1>
        <p>
          Find answers to common questions or contact our support team
        </p>
      </div>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Search our help center</h2>
          </div>
          <div className="category-item">
            <form>
              <div className="form-group">
                <input type="text" placeholder="Search" />
                <button type="submit" className="btn">Search</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Help Topics</h2>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>Buying on SourceBd</h3>
              <p>
                Learn how to find products, place orders, and manage purchases
              </p>
              <Link to="#" className="btn">Explore</Link>
            </div>
            <div className="category-item">
              <h3>Selling on SourceBd</h3>
              <p>
                Guidance for suppliers to list products and manage orders
              </p>
              <Link to="#" className="btn">Explore</Link>
            </div>
            <div className="category-item">
              <h3>Safety & Security</h3>
              <p>
                Tips for secure transactions and protecting your account
              </p>
              <Link to="#" className="btn">Explore</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions</p>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>How do I create an account on SourceBd?</h3>
              <p>
                Creating an account on SourceBd is simple. Click on the "Sign In" button at the top right corner of the page, then select "Create Account." You'll need to provide your email address, create a password, and select whether you're registering as a buyer or supplier. After verifying your email, your account will be active.
              </p>
            </div>
            <div className="category-item">
              <h3>How can I verify a supplier's credibility?</h3>
              <p>
                SourceBd offers several ways to verify suppliers. Look for the "Verified" badge on supplier profiles, which indicates they've passed our verification process. You can also check their transaction history, customer reviews, and response rate. For added assurance, we recommend starting with smaller orders before committing to large purchases.
              </p>
            </div>
            <div className="category-item">
              <h3>What payment methods are accepted?</h3>
              <p>
                SourceBd supports multiple payment methods including bank transfers, credit cards, and secure online payment gateways. We also offer Trade Assurance protection for eligible orders. The available payment options will be displayed during the checkout process based on your location and the supplier's preferences.
              </p>
            </div>
            <div className="category-item">
              <h3>How does the shipping process work?</h3>
              <p>
                Shipping arrangements are made between buyers and suppliers. After confirming an order, the supplier will typically provide shipping options and costs. SourceBd partners with various logistics providers to offer competitive shipping rates. You can track your order through the "My Orders" section once shipping details are provided by the supplier.
              </p>
            </div>
            <div className="category-item">
              <h3>What is the minimum order quantity (MOQ)?</h3>
              <p>
                The Minimum Order Quantity (MOQ) varies by product and supplier. MOQs are set by suppliers based on their production capabilities and profit margins. You can find the MOQ for each product on its listing page. If you need a quantity below the stated MOQ, you can contact the supplier directly to discuss possible arrangements.
              </p>
            </div>
            <div className="category-item">
              <h3>How can I become a verified supplier?</h3>
              <p>
                To become a verified supplier on SourceBd, you need to complete our verification process which includes submitting business documentation, proof of manufacturing capabilities, and passing our quality assessment. Visit our "For Suppliers" section and click on "Become a Verified Supplier" to start the application process.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Still need help? Contact us</h2>
            <p>Our support team is ready to assist you</p>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>Email Support</h3>
              <p>
                Send us an email and we'll respond within 24 hours
              </p>
              <p>support@sourcebd.com</p>
            </div>
            <div className="category-item">
              <h3>Call Us</h3>
              <p>
                Speak directly with our support team during business hours
              </p>
              <p>+880 1700-000000</p>
            </div>
            <div className="category-item">
              <h3>Live Chat</h3>
              <p>
                Chat with our support agents in real-time
              </p>
              <Link to="#" className="btn">Start Chat</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Helpful Resources</h2>
            <p>Additional materials to help you succeed on SourceBd</p>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>Buyer's Guide</h3>
              <p>
                Comprehensive guide to sourcing products on SourceBd
              </p>
              <Link to="#" className="btn">Download Guide</Link>
            </div>
            <div className="category-item">
              <h3>Video Tutorials</h3>
              <p>
                Step-by-step video guides for buyers and suppliers
              </p>
              <Link to="#" className="btn">Watch Videos</Link>
            </div>
            <div className="category-item">
              <h3>Blog & Articles</h3>
              <p>
                Tips, trends, and insights for B2B trading in Bangladesh
              </p>
              <Link to="#" className="btn">Read Articles</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;