import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div>
      <div className="breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li>Contact Us</li>
        </ol>
      </div>
      <div className="page-header">
        <h1>Get in Touch With Us</h1>
        <p>
          Have questions about sourcing from Bangladesh? Our team is here to help you with all your B2B needs.
        </p>
      </div>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Send us a Message</h2>
          </div>
          <div className="category-list">
            <div className="category-item">
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter your full name" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter your email" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" placeholder="Enter your company name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter your phone number" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="supplier">Supplier Registration</option>
                    <option value="buyer">Buyer Assistance</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea placeholder="Enter your message"></textarea>
                </div>
                <button type="submit" className="btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Contact Information</h2>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>Head Office</h3>
              <p>
                123 Commerce Road, Gulshan Avenue<br />
                Dhaka 1212, Bangladesh
              </p>
            </div>
            <div className="category-item">
              <h3>Phone Number</h3>
              <p>
                +880 1712 345 678<br />
                +880 1812 345 678
              </p>
            </div>
            <div className="category-item">
              <h3>Email Address</h3>
              <p>
                info@sourcebd.com<br />
                support@sourcebd.com
              </p>
            </div>
            <div className="category-item">
              <h3>Business Hours</h3>
              <p>
                Sunday - Thursday: 9:00 AM - 6:00 PM<br />
                Friday & Saturday: Closed
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Offices</h2>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>Dhaka</h3>
              <p>
                Dhaka Head Office<br />
                123 Commerce Road, Gulshan Avenue, Dhaka 1212<br />
                +880 1712 345 678<br />
                dhaka@sourcebd.com
              </p>
            </div>
            <div className="category-item">
              <h3>Chittagong</h3>
              <p>
                Chittagong Office<br />
                456 Port Road, Agrabad C/A, Chittagong<br />
                +880 1812 345 678<br />
                chittagong@sourcebd.com
              </p>
            </div>
            <div className="category-item">
              <h3>Sylhet</h3>
              <p>
                Sylhet Office<br />
                789 Tea Garden Road, Zindabazar, Sylhet<br />
                +880 1912 345 678<br />
                sylhet@sourcebd.com
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <p>Find quick answers to common questions about our platform and services</p>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>How do I register as a supplier on SourceBd?</h3>
              <p>
                To register as a supplier, visit our "Become a Supplier" page and complete the registration form. Our team will review your application and contact you within 2 business days. You'll need to provide business documentation for verification purposes.
              </p>
            </div>
            <div className="category-item">
              <h3>What is the process for sourcing products?</h3>
              <p>
                Our sourcing process is simple: 1) Search for products or suppliers, 2) Send quotation requests to multiple suppliers, 3) Compare offers and negotiate terms, 4) Place your order through our secure platform, and 5) Track your order until delivery.
              </p>
            </div>
            <div className="category-item">
              <h3>How does SourceBd verify suppliers?</h3>
              <p>
                We have a rigorous verification process that includes checking business licenses, factory audits, quality control certifications, and customer references. Only suppliers that meet our standards receive the "Verified" badge on our platform.
              </p>
            </div>
            <div className="category-item">
              <h3>What payment methods are accepted?</h3>
              <p>
                We support various payment methods including bank transfers, credit cards, and secure escrow services. For large orders, we can arrange Letters of Credit (L/C) through our banking partners.
              </p>
            </div>
            <div className="category-item">
              <h3>Do you provide logistics and shipping support?</h3>
              <p>
                Yes, we work with trusted logistics partners to provide door-to-door shipping solutions. Our team can help you with customs clearance, documentation, and tracking for both sea and air freight shipments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;