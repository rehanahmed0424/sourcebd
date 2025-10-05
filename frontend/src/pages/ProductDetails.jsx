import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    quantity: 1
  });

  // Image URL helper function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/product-placeholder.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    if (!imagePath.startsWith('/')) return `http://localhost:5000/uploads/${imagePath}`;
    return `http://localhost:5000${imagePath}`;
  };

  // Fetch product details from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Product not found: ${response.status}`);
        }
        
        const productData = await response.json();
        console.log('Product data received:', productData);
        setProduct(productData);
        
        // Set default quantity to product's MOQ
        setQuantity(productData.moq || 1);
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    console.log('Inquiry submitted:', inquiryData);
    alert('Your inquiry has been sent successfully! The supplier will contact you soon.');
    setIsInquiryModalOpen(false);
    setInquiryData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      quantity: quantity
    });
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    alert('Product added to cart!');
  };

  const handleSaveProduct = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    alert('Product saved to favorites!');
  };

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-error">
        <div className="error-icon">⚠️</div>
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-error">
        <div className="error-icon">🔍</div>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  // Mock images for gallery
  const productImages = [
    getImageUrl(product.image),
    getImageUrl(product.image),
    getImageUrl(product.image),
    getImageUrl(product.image)
  ];

  // Specification fields
  const specifications = [
    { label: 'Material', value: product.specifications?.material },
    { label: 'Size/Dimensions', value: product.specifications?.size },
    { label: 'Weight Capacity', value: product.specifications?.weightCapacity },
    { label: 'Lead Time', value: product.specifications?.leadTime },
    { label: 'Customization', value: product.specifications?.customization },
    { label: 'Color Options', value: product.specifications?.colorOptions },
    { label: 'Packaging', value: product.specifications?.packaging },
    { label: 'MOQ', value: `${product.moq} units` }
  ];

  return (
    <div className="product-details">


      {/* Main Product Section */}
      <section className="product-main">
        <div className="container">
          <div className="product-layout">
            
            {/* Product Gallery */}
            <div className="product-gallery">
              <div className="main-image">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              <div className="image-thumbnails">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail-btn ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                <div className="supplier-info">
                  <span className="supplier-name">by {product.supplier}</span>
                  <div className="badges">
                    {product.verified && <span className="badge verified">Verified</span>}
                    {product.featured && <span className="badge featured">Featured</span>}
                  </div>
                </div>
                
                <div className="product-meta">
                  <div className="rating">
                    ⭐⭐⭐⭐⭐ <span>4.5 ({product.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="orders">
                    📦 {product.orderCount || 0} orders
                  </div>
                </div>
              </div>

              <div className="price-section">
                <div className="price">{product.priceRange}</div>
                <div className="price-note">Price varies based on quantity</div>
              </div>

              <div className="specs-preview">
                <h3>Key Specifications</h3>
                <div className="specs-grid">
                  {specifications.slice(0, 4).map((spec, index) => (
                    spec.value && (
                      <div key={index} className="spec-item">
                        <span className="spec-label">{spec.label}:</span>
                        <span className="spec-value">{spec.value}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              <div className="quantity-section">
                <label htmlFor="quantity">Order Quantity:</label>
                <div className="quantity-input">
                  <input
                    type="number"
                    id="quantity"
                    min={product.moq}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || product.moq)}
                  />
                  <span className="moq-note">Minimum: {product.moq} units</span>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-primary btn-large"
                  onClick={() => setIsInquiryModalOpen(true)}
                >
                  <span>📩</span>
                  Request Quote
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleAddToCart}
                >
                  <span>🛒</span>
                  Add to Cart
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={handleSaveProduct}
                >
                  <span>❤️</span>
                  Save
                </button>
              </div>

              <div className="quick-info">
                <div className="info-item">
                  <span className="icon">🚚</span>
                  <span>Free shipping on orders over $500</span>
                </div>
                <div className="info-item">
                  <span className="icon">🛡️</span>
                  <span>Verified supplier • Quality guaranteed</span>
                </div>
                <div className="info-item">
                  <span className="icon">💬</span>
                  <span>Response within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`tab ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={`tab ${activeTab === 'supplier' ? 'active' : ''}`}
                onClick={() => setActiveTab('supplier')}
              >
                Supplier Info
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === 'description' && (
                <div className="tab-panel">
                  <h3>Product Description</h3>
                  <p>{product.description || "No description available for this product. Contact the supplier for more details."}</p>
                  
                  <div className="features">
                    <h4>Key Features</h4>
                    <ul>
                      <li>High-quality materials and craftsmanship</li>
                      <li>Competitive pricing with bulk discounts</li>
                      <li>Customization options available</li>
                      <li>Fast and reliable shipping</li>
                      <li>Professional customer support</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="tab-panel">
                  <h3>Detailed Specifications</h3>
                  <div className="specifications-grid">
                    {specifications.map((spec, index) => (
                      spec.value && (
                        <div key={index} className="spec-row">
                          <div className="spec-label">{spec.label}</div>
                          <div className="spec-value">{spec.value}</div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'supplier' && (
                <div className="tab-panel">
                  <h3>Supplier Information</h3>
                  <div className="supplier-card">
                    <div className="supplier-header">
                      <h4>{product.supplier}</h4>
                      <div className="supplier-badges">
                        {product.verified && <span className="badge large verified">Verified Supplier</span>}
                        {product.featured && <span className="badge large featured">Featured</span>}
                      </div>
                    </div>
                    <p className="supplier-description">
                      This supplier has been thoroughly vetted and verified by our team to ensure quality and reliability. 
                      They have a proven track record of delivering excellent products and customer service.
                    </p>
                    <div className="supplier-stats">
                      <div className="stat">
                        <div className="stat-value">95%</div>
                        <div className="stat-label">Response Rate</div>
                      </div>
                      <div className="stat">
                        <div className="stat-value">&lt; 24h</div>
                        <div className="stat-label">Response Time</div>
                      </div>
                      <div className="stat">
                        <div className="stat-value">98%</div>
                        <div className="stat-label">On-time Delivery</div>
                      </div>
                      <div className="stat">
                        <div className="stat-value">4.8/5</div>
                        <div className="stat-label">Customer Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Request Quote</h3>
              <button 
                className="close-btn"
                onClick={() => setIsInquiryModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="product-summary">
                <img src={getImageUrl(product.image)} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.supplier}</p>
                </div>
              </div>
              
              <form onSubmit={handleInquirySubmit} className="inquiry-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={inquiryData.company}
                      onChange={(e) => setInquiryData({...inquiryData, company: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({...inquiryData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min={product.moq}
                    value={inquiryData.quantity}
                    onChange={(e) => setInquiryData({...inquiryData, quantity: parseInt(e.target.value) || product.moq})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Message to Supplier</label>
                  <textarea
                    rows="4"
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                    placeholder="Please include any specific requirements, customization needs, or questions..."
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Send Inquiry
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setIsInquiryModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;