import React from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
  return (
    <div>
      <div className="breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li>Categories</li>
          <li>Textile & Apparel</li>
        </ol>
      </div>
      <div className="page-header">
        <h1>Textile & Apparel</h1>
        <p>
          Discover quality textiles and apparel from verified Bangladeshi suppliers
        </p>
      </div>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Textile & Apparel Products</h2>
            <p>Browse through our collection of garments, fabrics, and textile products</p>
          </div>
          <div className="category-list">
            <div className="category-item filters">
              <button className="btn">Show Filters</button>
              <div className="filter-group">
                <h3>Categories</h3>
                <button className="reset-btn">Reset</button>
                <ul>
                  <li><Link to="#">Garments</Link></li>
                  <li><Link to="#">Fabrics</Link></li>
                  <li><Link to="#">Yarn</Link></li>
                  <li><Link to="#">Home Textiles</Link></li>
                  <li><Link to="#">Technical Textiles</Link></li>
                </ul>
              </div>
              <div className="filter-group">
                <h3>Price Range</h3>
                <button className="reset-btn">Reset</button>
                <div>
                  <input type="range" min="0" max="100" />
                  <button className="btn">Apply</button>
                </div>
              </div>
              <div className="filter-group">
                <h3>Supplier Type</h3>
                <button className="reset-btn">Reset</button>
                <ul>
                  <li><Link to="#">Verified Suppliers</Link></li>
                  <li><Link to="#">Gold Suppliers</Link></li>
                  <li><Link to="#">Assessed Suppliers</Link></li>
                </ul>
              </div>
              <div className="filter-group">
                <h3>MOQ</h3>
                <button className="reset-btn">Reset</button>
                <ul>
                  <li><Link to="#">Under 100 units</Link></li>
                  <li><Link to="#">100-500 units</Link></li>
                  <li><Link to="#">500-1000 units</Link></li>
                  <li><Link to="#">1000+ units</Link></li>
                </ul>
              </div>
              <div className="filter-group">
                <h3>Product Condition</h3>
                <button className="reset-btn">Reset</button>
                <ul>
                  <li><Link to="#">New</Link></li>
                  <li><Link to="#">Used</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="category-list">
            <div className="category-item">
              <p>Showing 24 of 128 products</p>
              <div className="sort-options">
                <span>Sort by:</span>
                <Link to="#" className="sort-link">Recommended</Link>
                <Link to="#" className="sort-link">Price Low to High</Link>
                <Link to="#" className="sort-link">Price High to Low</Link>
                <Link to="#" className="sort-link">Most Popular</Link>
                <Link to="#" className="sort-link">Newest First</Link>
              </div>
              <div className="product-grid">
                <div className="product-card">
                  <span className="verified-badge">Verified</span>
                  <h3>Eco-Friendly Jute Bags</h3>
                  <p>
                    Dhaka Jute Mills Ltd.<br />
                    $2.50 - $4.00 / unit<br />
                    MOQ: 500 units
                  </p>
                  <Link to="#" className="btn">Request Quote</Link>
                </div>
                <div className="product-card">
                  <span className="verified-badge">Verified</span>
                  <h3>100% Cotton T-Shirts</h3>
                  <p>
                    Chittagong Textiles<br />
                    $4.20 - $6.50 / piece<br />
                    MOQ: 100 pieces
                  </p>
                  <Link to="#" className="btn">Request Quote</Link>
                </div>
                <div className="product-card">
                  <h3>Genuine Leather Wallets</h3>
                  <p>
                    Sylhet Leather Co.<br />
                    $8.00 - $12.00 / piece<br />
                    MOQ: 50 pieces
                  </p>
                  <Link to="#" className="btn">Request Quote</Link>
                </div>
                <div className="product-card">
                  <span className="verified-badge">Verified</span>
                  <h3>Premium Denim Fabric</h3>
                  <p>
                    Dhaka Denim Ltd.<br />
                    $6.50 - $9.00 / yard<br />
                    MOQ: 100 yards
                  </p>
                  <Link to="#" className="btn">Request Quote</Link>
                </div>
                <div className="product-card">
                  <h3>Pure Silk Sarees</h3>
                  <p>
                    Rajshahi Silk House<br />
                    $45.00 - $85.00 / piece<br />
                    MOQ: 20 pieces
                  </p>
                  <Link to="#" className="btn">Request Quote</Link>
                </div>
                <div className="product-card">
                  <span className="verified-badge">Verified</span>
                  <h3>Knitted Sweaters</h3>
                  <p>
                    Knitwear Bangladesh<br />
                    $12.00 - $18.00 / piece<br />
                    MOQ: 50 pieces
                  </p>
                  <Link to="#" className="btn">Request Quote</Link>
                </div>
                <div className="product-card">
                  <h3>Corporate Uniforms</h3>
                  <p>
                    Professional Attire Ltd.<br />
                    $15.00 - $25.00 / set<br />
                    MOQ: 30 sets
                  </p>
                  <Link to="#" className="btn">Request Quote</Link>
                </div>
                <div className="product-card">
                  <span className="verified-badge">Verified</span>
                  <h3>Cotton Bath Towels</h3>
                  <p>
                    Textile Comfort Inc.<br />
                    $3.50 - $6.00 / piece<br />
                    MOQ: 100 pieces
                  </p>
                  <Link to="#" className="btn">Request Quote</Link>
                </div>
              </div>
              <div className="pagination">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <Link to="#" className="next-btn">Next</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Category;