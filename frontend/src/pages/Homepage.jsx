import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse, testimonialsResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products/featured'),
          fetch('/api/testimonials'),
        ]);

        if (!categoriesResponse.ok || !productsResponse.ok || !testimonialsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoriesData = await categoriesResponse.json();
        const productsData = await productsResponse.json();
        const testimonialsData = await testimonialsResponse.json();

        setCategories(categoriesData);
        setFeaturedProducts(productsData);
        setTestimonials(testimonialsData);
      } catch (err) {
        setError(err.message);
        // Fallback data if API fails
        setCategories([
          { id: 1, name: "Textile & Apparel", description: "Garments, fabrics, yarns and accessories", items: ["Ready-made garments", "Fabrics & textiles", "Yarns & fibers", "Accessories & trims"] },
          { id: 2, name: "Agriculture", description: "Fresh produce, processed foods, spices", items: ["Fruits & vegetables", "Grains & cereals", "Spices & herbs", "Processed foods"] },
          { id: 3, name: "Electronics", description: "Consumer electronics, components, gadgets", items: ["Mobile phones", "Computers & laptops", "Home appliances", "Electronic components"] },
          { id: 4, name: "Machinery", description: "Industrial equipment, tools, parts", items: ["Textile machinery", "Food processing equipment", "Construction machinery", "Packaging machines"] },
        ]);
        setFeaturedProducts([
          { id: 1, name: "Eco-Friendly Jute Bags", supplier: "Dhaka Jute Mills Ltd.", priceRange: "$2.50 - $4.00", moq: 500, image: "https://via.placeholder.com/250x200?text=Jute+Bags", verified: true },
          { id: 2, name: "100% Cotton T-Shirts", supplier: "Chittagong Textiles", priceRange: "$4.20 - $6.50", moq: 100, image: "https://via.placeholder.com/250x200?text=T-Shirts", verified: true },
          { id: 3, name: "Genuine Leather Wallets", supplier: "Sylhet Leather Co.", priceRange: "$8.00 - $12.00", moq: 50, image: "https://via.placeholder.com/250x200?text=Leather", verified: false },
          { id: 4, name: "Ceramic Dinner Set", supplier: "Rajshahi Ceramics", priceRange: "$25.00 - $40.00", moq: 20, image: "https://via.placeholder.com/250x200?text=Ceramics", verified: true },
        ]);
        setTestimonials([
          { id: 1, text: "SourceBd has transformed how we source products from Bangladesh. The platform is easy to use, and we've found reliable suppliers for our textile business.", author: "Ahmed Rahman, Fashion Importer, UK" },
          { id: 2, text: "As a small business owner, finding trustworthy suppliers was always a challenge. SourceBd's verification system gives me confidence in my sourcing decisions.", author: "Sarah Johnson, Boutique Owner, Australia" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <p>Showing demo data instead</p>
      </div>
    );
  }

  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Bangladesh's Premier B2B Marketplace</h1>
            <p>Connect with verified suppliers, source quality products, and grow your business with SourceBd</p>
            <div className="hero-buttons">
              <Link to="/products" className="btn">Start Sourcing</Link>
              <Link to="/register-supplier" className="btn btn-outline">Become a Supplier</Link>
              {/* Placeholder for admin authentication */}
              {isAdmin && <Link to="/admin" className="btn">Admin Panel</Link>}
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Browse by Categories</h2>
            <p>Explore products across various industries from verified Bangladeshi suppliers</p>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <div key={category.id} className="category-item">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <ul>
                  {category.items &&
                    category.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <Link to={`/category/${category.id}`} className="btn btn-outline">Explore</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <div className="section-title">
            <h2>Featured Products</h2>
            <p>Quality products from verified suppliers across Bangladesh</p>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.verified && <div className="product-badge">Verified</div>}
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <span className="product-supplier">{product.supplier}</span>
                  <div className="product-price">{product.priceRange}</div>
                  <Link to={`/product/${product.id}`} className="btn">Request Quote</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <div className="section-title">
            <h2>How SourceBd Works</h2>
            <p>Simple steps to source products from Bangladeshi suppliers</p>
          </div>
          <div className="steps-how">
            <div className="step-how">
              <div className="step-number">1</div>
              <h3>Search Products</h3>
              <p>Simply search or browse products from Bangladesh suppliers</p>
            </div>
            <div className="step-how">
              <div className="step-number">2</div>
              <h3>Get Quotes</h3>
              <p>Send quotation requests to multiple suppliers with your specific requirements</p>
            </div>
            <div className="step-how">
              <div className="step-number">3</div>
              <h3>Compare & Negotiate</h3>
              <p>Receive quotes, compare offers, and negotiate directly with suppliers</p>
            </div>
            <div className="step-how">
              <div className="step-number">4</div>
              <h3>Secure Payment & Ship</h3>
              <p>Use our secure payment system and arrange shipping</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>What Our Buyers Say</h2>
            <p>Hear from businesses that have successfully sourced through SourceBd</p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial">
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-author">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Source from Bangladesh?</h2>
          <p>Join thousands of businesses that have discovered quality products and reliable suppliers through SourceBd</p>
          <Link to="/register" className="btn">Create Free Account</Link>
        </div>
      </section>
    </main>
  );
};

// Placeholder for admin authentication (replace with actual logic)
const isAdmin = true; // Example; use context or state from authentication

export default Home;