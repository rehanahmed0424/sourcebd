import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  
  const { isAuthenticated, user } = useAuth();

  // Fallback data functions
  const getFallbackCategories = () => [
    { 
      _id: '1', 
      name: "Textile & Apparel", 
      description: "Garments, fabrics, yarns and accessories",
      image: "/images/textile.jpg"
    },
    { 
      _id: '2', 
      name: "Agriculture", 
      description: "Fresh produce, processed foods, spices",
      image: "/images/agriculture.jpg"
    },
    { 
      _id: '3', 
      name: "Electronics", 
      description: "Consumer electronics, components, gadgets",
      image: "/images/electronics.jpg"
    },
    { 
      _id: '4', 
      name: "Machinery", 
      description: "Industrial equipment, tools, parts",
      image: "/images/machinery.jpg"
    },
  ];

  const getFallbackProducts = () => [
    { _id: '1', name: "Eco-Friendly Jute Bags", supplier: "Dhaka Jute Mills Ltd.", priceRange: "$2.50 - $4.00", moq: 500, image: "/images/jute-bags.jpg", verified: true, featured: true },
    { _id: '2', name: "100% Cotton T-Shirts", supplier: "Chittagong Textiles", priceRange: "$4.20 - $6.50", moq: 100, image: "/images/tshirts.jpg", verified: true, featured: true },
    { _id: '3', name: "Genuine Leather Wallets", supplier: "Sylhet Leather Co.", priceRange: "$8.00 - $12.00", moq: 50, image: "/images/leather.jpg", verified: false, featured: true },
    { _id: '4', name: "Ceramic Dinner Set", supplier: "Rajshahi Ceramics", priceRange: "$25.00 - $40.00", moq: 20, image: "/images/ceramics.jpg", verified: true, featured: true },
  ];

  const getFallbackTestimonials = () => [
    { _id: '1', text: "SourceBd has transformed how we source products from Bangladesh. The platform is easy to use, and we've found reliable suppliers for our textile business.", author: "Ahmed Rahman, Fashion Importer, UK" },
    { _id: '2', text: "As a small business owner, finding trustworthy suppliers was always a challenge. SourceBd's verification system gives me confidence in my sourcing decisions.", author: "Sarah Johnson, Boutique Owner, Australia" },
  ];

  // Check if API is available
  const checkApiHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        const data = await response.json();
        setApiStatus('connected');
        return true;
      }
    } catch (err) {
      console.warn('API server not available, using fallback data');
      setApiStatus('disconnected');
      return false;
    }
    return false;
  };

  // Fetch data with fallback
  const fetchWithFallback = async (endpoint, fallbackEndpoint, fallbackDataFn) => {
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.warn(`Failed to fetch ${endpoint}, trying fallback:`, err.message);
      
      // Try fallback endpoint
      try {
        const fallbackResponse = await fetch(`http://localhost:5000/api/fallback/${fallbackEndpoint}`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          return fallbackData;
        }
      } catch (fallbackErr) {
        console.warn(`Fallback also failed for ${endpoint}, using hardcoded data`);
      }
      
      // Use hardcoded fallback
      return fallbackDataFn();
    }
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if API is available
        const apiAvailable = await checkApiHealth();

        if (apiAvailable) {
          // Fetch all data in parallel
          const [categoriesData, productsData, testimonialsData] = await Promise.all([
            fetchWithFallback('categories', 'categories', getFallbackCategories),
            fetchWithFallback('products/featured', 'products/featured', getFallbackProducts),
            fetchWithFallback('testimonials', 'testimonials', getFallbackTestimonials)
          ]);

          setCategories(categoriesData);
          setFeaturedProducts(productsData);
          setTestimonials(testimonialsData);
        } else {
          // Use fallback data directly
          setCategories(getFallbackCategories());
          setFeaturedProducts(getFallbackProducts());
          setTestimonials(getFallbackTestimonials());
        }

      } catch (err) {
        console.error('Error in data fetching:', err);
        setError(err.message);
        // Set fallback data as last resort
        setCategories(getFallbackCategories());
        setFeaturedProducts(getFallbackProducts());
        setTestimonials(getFallbackTestimonials());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle image loading errors

const handleImageError = (e, type) => {
  console.warn(`Image failed to load for ${type}:`, e.target.src);
  // Use a simple placeholder that will work with cover
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  e.target.style.objectFit = 'cover'; // Force cover on error
};

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading SourceBd...</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
          {apiStatus === 'checking' ? 'Checking server...' : 
           apiStatus === 'disconnected' ? 'Using offline mode' : 'Connected to server'}
        </p>
      </div>
    );
  }

  // Add this function inside your HomePage component, before the return statement
const getProductImageUrl = (imagePath, productName) => {
  if (!imagePath) {
    // Return a placeholder image if no image path is provided
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }
  
  // Check if it's already a full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Check if it's a data URL (base64)
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Prepend the server URL for relative paths
  return `http://localhost:5000${imagePath}`;
};
  return (
    <main>
      {/* API Status Banner */}
      {apiStatus === 'disconnected' && (
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404', 
          padding: '10px', 
          textAlign: 'center',
          borderBottom: '1px solid #ffeaa7'
        }}>
          <strong>Offline Mode:</strong> Showing demo data. Server connection unavailable.
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Bangladesh's Premier B2B Marketplace</h1>
            <p>Connect with verified suppliers, source quality products, and grow your business with SourceBd</p>
            {/* Removed the hero-buttons section completely */}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section section">
        <div className="container">
          <div className="section-title">
            <h2>Browse by Categories</h2>
            <p>Explore products across various industries from verified Bangladeshi suppliers</p>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category._id} className="category-card">
                <div className="category-image">
                  <img 
                    src={category.image ? `http://localhost:5000${category.image}` : '/images/category-placeholder.jpg'} 
                    alt={category.name}
                    onError={(e) => handleImageError(e, `category ${category.name}`)}
                  />
                </div>
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <Link to={`/category/${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`} className="btn btn-small">
                    Explore Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* Featured Products */}
<section className="featured-products section">
  <div className="container">
    <div className="section-title">
      <h2>Featured Products</h2>
      <p>Quality products from verified suppliers across Bangladesh</p>
    </div>
    <div className="products-grid">
      {featuredProducts.map((product) => (
        <div key={product._id} className="product-card">
          <div className="product-image">
            {product.verified && <span className="verified-badge">Verified</span>}
            {product.featured && <span className="featured-badge">Featured</span>}
            <img 
              src={getProductImageUrl(product.image, product.name)} 
              alt={product.name}
              onError={(e) => {
                console.warn(`Image failed to load for product: ${product.name}`);
                // Replace with a proper placeholder that will definitely work
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                e.target.style.objectFit = 'cover';
                e.target.onerror = null; // Prevent infinite loop
              }}
              onLoad={(e) => {
                // Ensure cover is applied when image loads successfully
                e.target.style.objectFit = 'cover';
              }}
            />
          </div>
          <div className="product-content">
            <h3>{product.name}</h3>
            <p className="supplier">{product.supplier}</p>
            <div className="product-details">
              <div className="price-container">
                <span className="price-label">Price Range:</span>
                <span className="price">{product.priceRange}</span>
              </div>
              <span className="moq">MOQ: {product.moq}</span>
            </div>
            <div className="product-actions">
              <Link to={`/product/${product._id}`} className="btn-view-details">
                <i className="fas fa-eye"></i>
                View Details
              </Link>
              <button className="icon-btn" title="Add to favorites">
                <i className="far fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* How It Works */}
      <section className="how-it-works section">
        <div className="container">
          <div className="section-title">
            <h2>How SourceBd Works</h2>
            <p>Simple steps to source products from Bangladeshi suppliers</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Search Products</h3>
              <p>Browse through thousands of products from verified suppliers across Bangladesh.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Request Quotes</h3>
              <p>Send quotation requests to multiple suppliers with your specific requirements.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Compare & Negotiate</h3>
              <p>Receive quotes, compare offers, and negotiate directly with suppliers.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Secure Payment & Ship</h3>
              <p>Use our secure payment system and arrange shipping with trusted partners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section section">
        <div className="container">
          <div className="section-title">
            <h2>What Our Buyers Say</h2>
            <p>Hear from businesses that have successfully sourced through SourceBd</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="testimonial-card">
                <div className="testimonial-content">
                  <i className="fas fa-quote-left"></i>
                  <p>{testimonial.text}</p>
                </div>
                <div className="testimonial-author">
                  <strong>{testimonial.author.split(',')[0]}</strong>
                  <span>{testimonial.author.split(',').slice(1).join(',')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Source from Bangladesh?</h2>
            <p>Join thousands of businesses that have discovered quality products and reliable suppliers through SourceBd</p>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '15px', 
          textAlign: 'center',
          margin: '20px',
          borderRadius: '5px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Note:</strong> Some data may not be loading correctly. {error}
        </div>
      )}
    </main>
  );
};

export default HomePage;