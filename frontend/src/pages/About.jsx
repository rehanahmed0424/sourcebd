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
    <main>
      <section className="breadcrumb-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <span>About Us</span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="page-header section">
        <div className="container">
          <div className="page-header-content">
            <h1>Connecting Global Buyers with Bangladeshi Suppliers</h1>
            <p>
              SourceBd is Bangladesh's premier B2B marketplace, dedicated to showcasing the best of Bangladeshi manufacturing to the world.
            </p>
          </div>
        </div>
      </section>

      <section className="about-hero section">
        <div className="container">
          <div className="about-hero-content">
            <h1>Connecting Global Buyers with Bangladeshi Suppliers</h1>
            <p>
              SourceBd is Bangladesh's premier B2B marketplace, dedicated to showcasing the best of Bangladeshi manufacturing to the world.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Start Sourcing Today</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story-section section">
        <div className="container">
          <div className="section-title">
            <h2>Our Story</h2>
            <div className="story-content">
              <p>
                Founded in 2020, SourceBd emerged from a simple vision: to create a seamless bridge between international buyers and the diverse manufacturing capabilities of Bangladesh. Our founders, with decades of experience in international trade and technology, recognized the need for a dedicated platform that could showcase Bangladesh's manufacturing prowess to the world.
              </p>
              <p>
                Today, we connect thousands of verified suppliers from across Bangladesh with buyers from over 50 countries worldwide. From textiles and garments to agriculture, electronics, and specialized machinery, SourceBd provides a trusted platform for businesses to discover new opportunities and forge lasting partnerships.
              </p>
              <p>
                Our commitment to quality, verification, and exceptional service has made us the preferred B2B marketplace for businesses looking to source from Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision-section section">
        <div className="container">
          <div className="section-title">
            <h2>Our Mission & Vision</h2>
            <p>Guiding principles that drive our platform forward</p>
          </div>
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Our Mission</h3>
              <p>
                To empower businesses worldwide by providing seamless access to Bangladesh's manufacturing capabilities, while ensuring transparency, trust, and mutually beneficial partnerships between buyers and suppliers.
              </p>
            </div>
            <div className="vision-card">
              <div className="card-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3>Our Vision</h3>
              <p>
                To become the world's most trusted B2B platform for sourcing from Bangladesh, recognized for innovation, reliability, and our contribution to the global recognition of Bangladeshi quality and craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section section">
        <div className="container">
          <div className="section-title">
            <h2>Our Values</h2>
            <p>The core principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Trust & Transparency</h3>
              <p>We verify all suppliers and maintain complete transparency in all transactions to build lasting trust.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Partnership</h3>
              <p>We believe in building relationships, not just facilitating transactions.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Innovation</h3>
              <p>We continuously evolve our platform to meet the changing needs of global trade.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-award"></i>
              </div>
              <h3>Quality</h3>
              <p>We are committed to connecting buyers with suppliers who meet international quality standards.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section section">
        <div className="container">
          <div className="section-title">
            <h2>Our Impact</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.verifiedSuppliers}+</h3>
              <p>Verified Suppliers</p>
            </div>
            <div className="stat-card">
              <h3>{stats.productCategories}+</h3>
              <p>Product Categories</p>
            </div>
            <div className="stat-card">
              <h3>{stats.countriesServed}+</h3>
              <p>Countries Served</p>
            </div>
            <div className="stat-card">
              <h3>{stats.successfulTransactions}+</h3>
              <p>Successful Transactions</p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section section">
        <div className="container">
          <div className="section-title">
            <h2>Leadership Team</h2>
            <p>Meet the passionate individuals driving SourceBd forward</p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-image">
                <img src="/placeholder-team.jpg" alt="Abdul Rahman" />
              </div>
              <h3>Abdul Rahman</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img src="/placeholder-team.jpg" alt="Fatima Ahmed" />
              </div>
              <h3>Fatima Ahmed</h3>
              <p>Chief Technology Officer</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img src="/placeholder-team.jpg" alt="Mohammad Hassan" />
              </div>
              <h3>Mohammad Hassan</h3>
              <p>Chief Operations Officer</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img src="/placeholder-team.jpg" alt="Nusrat Jahan" />
              </div>
              <h3>Nusrat Jahan</h3>
              <p>Chief Marketing Officer</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join the SourceBd Community Today</h2>
            <p>
              Whether you're a buyer looking for quality products or a supplier wanting to reach global markets, SourceBd provides the platform and tools you need to succeed in today's competitive marketplace.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">Register as a Buyer</Link>
              <Link to="/register" className="btn btn-outline btn-large">Become a Supplier</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;