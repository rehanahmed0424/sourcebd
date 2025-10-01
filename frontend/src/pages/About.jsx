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

  const values = [
    {
      title: "Trust & Transparency",
      description: "We verify all suppliers and maintain complete transparency in all transactions to build lasting trust.",
      icon: "fas fa-handshake"
    },
    {
      title: "Partnership",
      description: "We believe in building relationships, not just facilitating transactions.",
      icon: "fas fa-users"
    },
    {
      title: "Quality",
      description: "We are committed to connecting buyers with suppliers who meet international quality standards.",
      icon: "fas fa-award"
    }
  ];

  const team = [
    {
      name: "Rehan Ahmed",
      role: "Founder & CEO",
      description: "20+ years in international trade and supply chain management"
    },
    {
      name: "Abdullah Al Jobayer",
      role: "Chief Technology Officer",
      description: "Former tech lead at major e-commerce platform"
    },
    {
      name: "Rifah Tasnim Jui",
      role: "Chief Operations Officer",
      description: "Operations expert with 15 years in manufacturing"
    }
  ];

  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
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

      {/* Our Story Section */}
      <section className="about-story section">
        <div className="container">
          <div className="section-title">
            <h2>Our Story</h2>
            <p>From vision to reality - our journey in transforming B2B trade</p>
          </div>
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
      </section>

      {/* Mission & Vision Section */}
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

      {/* Values Section */}
      <section className="values-section section">
        <div className="container">
          <div className="section-title">
            <h2>Our Values</h2>
            <p>The core principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  <i className={value.icon}></i>
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section section">
        <div className="container">
          <div className="section-title">
            <h2>Our Impact</h2>
            <p>Building bridges between Bangladesh and the world</p>
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

      {/* Team Section */}
      <section className="team-section section">
        <div className="container">
          <div className="section-title">
            <h2>Leadership Team</h2>
            <p>Meet the passionate individuals driving SourceBd forward</p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <i className="fas fa-user-circle"></i>
                </div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join the SourceBd Community Today</h2>
            <p>
              Whether you're a buyer looking for quality products or a supplier wanting to reach global markets, SourceBd provides the platform and tools you need to succeed in today's competitive marketplace.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;