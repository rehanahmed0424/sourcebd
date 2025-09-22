import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    console.log('About page loaded');
  }, []);

  const stats = {
    verifiedSuppliers: 5000,
    productCategories: 120,
    countriesServed: 50,
    successfulTransactions: 25000,
  };

  return (
    <div>
      <div className="breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li>About Us</li>
        </ol>
      </div>
      <div className="page-header">
        <h1>Connecting Global Buyers with Bangladeshi Suppliers</h1>
        <p>
          SourceBd is Bangladesh's premier B2B marketplace, dedicated to showcasing the best of Bangladeshi manufacturing to the world.
        </p>
      </div>
      <section className="hero">
        <div className="container">
          <h1>Connecting Global Buyers with Bangladeshi Suppliers</h1>
          <p>
            SourceBd is Bangladesh's premier B2B marketplace, dedicated to showcasing the best of Bangladeshi manufacturing to the world.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn">Start Sourcing Today</Link>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Story</h2>
            <p>
              Founded in 2020, SourceBd emerged from a simple vision: to create a seamless bridge between international buyers and the diverse manufacturing capabilities of Bangladesh. Our founders, with decades of experience in international trade and technology, recognized the need for a dedicated platform that could showcase Bangladesh's manufacturing prowess to the world.
              <br /><br />
              Today, we connect thousands of verified suppliers from across Bangladesh with buyers from over 50 countries worldwide. From textiles and garments to agriculture, electronics, and specialized machinery, SourceBd provides a trusted platform for businesses to discover new opportunities and forge lasting partnerships.
              <br /><br />
              Our commitment to quality, verification, and exceptional service has made us the preferred B2B marketplace for businesses looking to source from Bangladesh.
            </p>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Mission & Vision</h2>
            <p>Guiding principles that drive our platform forward</p>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>Our Mission</h3>
              <p>
                To empower businesses worldwide by providing seamless access to Bangladesh's manufacturing capabilities, while ensuring transparency, trust, and mutually beneficial partnerships between buyers and suppliers.
              </p>
            </div>
            <div className="category-item">
              <h3>Our Vision</h3>
              <p>
                To become the world's most trusted B2B platform for sourcing from Bangladesh, recognized for innovation, reliability, and our contribution to the global recognition of Bangladeshi quality and craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Values</h2>
            <p>The core principles that guide everything we do</p>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>Trust & Transparency</h3>
              <p>We verify all suppliers and maintain complete transparency in all transactions to build lasting trust.</p>
            </div>
            <div className="category-item">
              <h3>Partnership</h3>
              <p>We believe in building relationships, not just facilitating transactions.</p>
            </div>
            <div className="category-item">
              <h3>Innovation</h3>
              <p>We continuously evolve our platform to meet the changing needs of global trade.</p>
            </div>
            <div className="category-item">
              <h3>Quality</h3>
              <p>We are committed to connecting buyers with suppliers who meet international quality standards.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Impact</h2>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>{stats.verifiedSuppliers}+</h3>
              <p>Verified Suppliers</p>
            </div>
            <div className="category-item">
              <h3>{stats.productCategories}+</h3>
              <p>Product Categories</p>
            </div>
            <div className="category-item">
              <h3>{stats.countriesServed}+</h3>
              <p>Countries Served</p>
            </div>
            <div className="category-item">
              <h3>{stats.successfulTransactions}+</h3>
              <p>Successful Transactions</p>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Leadership Team</h2>
            <p>Meet the passionate individuals driving SourceBd forward</p>
          </div>
          <div className="category-list">
            <div className="category-item">
              <h3>Abdul Rahman</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="category-item">
              <h3>Fatima Ahmed</h3>
              <p>Chief Technology Officer</p>
            </div>
            <div className="category-item">
              <h3>Mohammad Hassan</h3>
              <p>Chief Operations Officer</p>
            </div>
            <div className="category-item">
              <h3>Nusrat Jahan</h3>
              <p>Chief Marketing Officer</p>
            </div>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="container">
          <h2>Join the SourceBd Community Today</h2>
          <p>
            Whether you're a buyer looking for quality products or a supplier wanting to reach global markets, SourceBd provides the platform and tools you need to succeed in today's competitive marketplace.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn">Register as a Buyer</Link>
            <Link to="/register" className="btn">Become a Supplier</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;