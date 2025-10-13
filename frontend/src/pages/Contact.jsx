import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    phoneNumber: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Simulate form submission
    // In a real application, you would make an API call here
    console.log('Form submitted:', formData);
    
    // Show success toast
    toast.success('Message sent successfully! We will get back to you within 24 hours.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      companyName: '',
      phoneNumber: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <h1>Get in Touch With Us</h1>
            <p>
              Have questions about sourcing from Bangladesh? Our team is here to help you with all your B2B needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="contact-main-section section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="section-title">
                <h2>Send us a Message</h2>
                <p>We'll get back to you within 24 hours</p>
              </div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name" 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email" 
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input 
                      type="text" 
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter your company name" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
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
                  <label>Your Message *</label>
                  <textarea 
                    rows="6" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <div className="section-title">
                <h2>Contact Information</h2>
                <p>Reach out to us through any of these channels</p>
              </div>
              
              <div className="contact-info-grid">
                <div className="contact-info-card">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Head Office</h3>
                    <p>
                      123 Commerce Road, Gulshan Avenue<br />
                      Dhaka 1212, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Phone Number</h3>
                    <p>
                      +880 1712 345 678<br />
                      +880 1812 345 678
                    </p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Email Address</h3>
                    <p>
                      info@sourcebd.com<br />
                      support@sourcebd.com
                    </p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Business Hours</h3>
                    <p>
                      Sunday - Thursday: 9:00 AM - 6:00 PM<br />
                      Friday & Saturday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the component remains the same */}
      {/* Offices Section */}
      <section className="offices-section section">
        <div className="container">
          <div className="section-title">
            <h2>Our Offices</h2>
            <p>Visit us at any of our locations across Bangladesh</p>
          </div>
          <div className="offices-grid">
            <div className="office-card">
              <div className="office-icon">
                <i className="fas fa-building"></i>
              </div>
              <h3>Dhaka</h3>
              <div className="office-details">
                <p><strong>Dhaka Head Office</strong></p>
                <p>123 Commerce Road, Gulshan Avenue, Dhaka 1212</p>
                <p>+880 1712 345 678</p>
                <p>dhaka@sourcebd.com</p>
              </div>
            </div>

            <div className="office-card">
              <div className="office-icon">
                <i className="fas fa-ship"></i>
              </div>
              <h3>Chittagong</h3>
              <div className="office-details">
                <p><strong>Chittagong Office</strong></p>
                <p>456 Port Road, Agrabad C/A, Chittagong</p>
                <p>+880 1812 345 678</p>
                <p>chittagong@sourcebd.com</p>
              </div>
            </div>

            <div className="office-card">
              <div className="office-icon">
                <i className="fas fa-mountain"></i>
              </div>
              <h3>Sylhet</h3>
              <div className="office-details">
                <p><strong>Sylhet Office</strong></p>
                <p>789 Tea Garden Road, Zindabazar, Sylhet</p>
                <p>+880 1912 345 678</p>
                <p>sylhet@sourcebd.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <p>Find quick answers to common questions about our platform and services</p>
          </div>
          <div className="faq-grid">
            <div className="faq-card">
              <h3>How do I register as a supplier on SourceBd?</h3>
              <p>
                To register as a supplier, visit our "Become a Supplier" page and complete the registration form. Our team will review your application and contact you within 2 business days. You'll need to provide business documentation for verification purposes.
              </p>
            </div>

            <div className="faq-card">
              <h3>What is the process for sourcing products?</h3>
              <p>
                Our sourcing process is simple: 1) Search for products or suppliers, 2) Send quotation requests to multiple suppliers, 3) Compare offers and negotiate terms, 4) Place your order through our secure platform, and 5) Track your order until delivery.
              </p>
            </div>

            <div className="faq-card">
              <h3>How does SourceBd verify suppliers?</h3>
              <p>
                We have a rigorous verification process that includes checking business licenses, factory audits, quality control certifications, and customer references. Only suppliers that meet our standards receive the "Verified" badge on our platform.
              </p>
            </div>

            <div className="faq-card">
              <h3>What payment methods are accepted?</h3>
              <p>
                We support various payment methods including bank transfers, credit cards, and secure escrow services. For large orders, we can arrange Letters of Credit (L/C) through our banking partners.
              </p>
            </div>

            <div className="faq-card">
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