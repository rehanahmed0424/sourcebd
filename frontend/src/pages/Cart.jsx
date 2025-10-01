import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <div>
      
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="cart-container">
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="cart-item">
                    <td>
                      <div className="product-info">
                        <div className="product-image">
                          <img src="/images/jute-bags.jpg" alt="Eco-Friendly Jute Bags" />
                        </div>
                        <div className="product-details">
                          <h3>Eco-Friendly Jute Bags</h3>
                          <p className="supplier">Dhaka Jute Mills Ltd.</p>
                          <p className="moq">MOQ: 500 units</p>
                        </div>
                      </div>
                    </td>
                    <td className="price">$3.25 / unit</td>
                    <td>
                      <div className="quantity-controls">
                        <button className="quantity-btn">-</button>
                        <span className="quantity">500</span>
                        <button className="quantity-btn">+</button>
                      </div>
                    </td>
                    <td className="subtotal">$1,625.00</td>
                    <td>
                      <button className="remove-btn" title="Remove item">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr className="cart-item">
                    <td>
                      <div className="product-info">
                        <div className="product-image">
                          <img src="/images/tshirts.jpg" alt="100% Cotton T-Shirts" />
                        </div>
                        <div className="product-details">
                          <h3>100% Cotton T-Shirts</h3>
                          <p className="supplier">Chittagong Textiles</p>
                          <p className="moq">MOQ: 100 pieces</p>
                        </div>
                      </div>
                    </td>
                    <td className="price">$5.50 / piece</td>
                    <td>
                      <div className="quantity-controls">
                        <button className="quantity-btn">-</button>
                        <span className="quantity">200</span>
                        <button className="quantity-btn">+</button>
                      </div>
                    </td>
                    <td className="subtotal">$1,100.00</td>
                    <td>
                      <button className="remove-btn" title="Remove item">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr className="cart-item">
                    <td>
                      <div className="product-info">
                        <div className="product-image">
                          <img src="/images/leather.jpg" alt="Genuine Leather Wallets" />
                        </div>
                        <div className="product-details">
                          <h3>Genuine Leather Wallets</h3>
                          <p className="supplier">Sylhet Leather Co.</p>
                          <p className="moq">MOQ: 50 pieces</p>
                        </div>
                      </div>
                    </td>
                    <td className="price">$10.00 / piece</td>
                    <td>
                      <div className="quantity-controls">
                        <button className="quantity-btn">-</button>
                        <span className="quantity">100</span>
                        <button className="quantity-btn">+</button>
                      </div>
                    </td>
                    <td className="subtotal">$1,000.00</td>
                    <td>
                      <button className="remove-btn" title="Remove item">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="order-summary">
              <div className="summary-card">
                <h2>Order Summary</h2>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>$3,725.00</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>$250.00</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>$372.50</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>$4,347.50</span>
                  </div>
                </div>
                <p className="summary-note">
                  Prices are in USD. Shipping costs may vary based on location and shipping method.
                </p>
                <div className="summary-actions">
                  <Link to="/checkout" className="btn btn-primary btn-full">Proceed to Checkout</Link>
                  <Link to="/products" className="btn btn-outline btn-full">Continue Shopping</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>You Might Also Like</h2>
            <p>Discover more products from Bangladeshi suppliers</p>
          </div>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <span className="verified-badge">Verified</span>
                <img src="/images/ceramics.jpg" alt="Ceramic Dinner Set" />
              </div>
              <div className="product-content">
                <h3>Ceramic Dinner Set</h3>
                <p className="supplier">Rajshahi Ceramics</p>
                <div className="product-details">
                  <span className="price">$25.00 - $40.00 / set</span>
                  <span className="moq">MOQ: 20 sets</span>
                </div>
                <div className="product-actions">
                  <Link to="/product/ceramic-dinner-set" className="btn btn-small">Request Quote</Link>
                  <button className="icon-btn" title="Add to favorites">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <img src="/images/bamboo-furniture.jpg" alt="Bamboo Furniture" />
              </div>
              <div className="product-content">
                <h3>Bamboo Furniture</h3>
                <p className="supplier">Sylhet Crafts</p>
                <div className="product-details">
                  <span className="price">$80.00 - $150.00 / piece</span>
                  <span className="moq">MOQ: 10 pieces</span>
                </div>
                <div className="product-actions">
                  <Link to="/product/bamboo-furniture" className="btn btn-small">Request Quote</Link>
                  <button className="icon-btn" title="Add to favorites">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <span className="verified-badge">Verified</span>
                <img src="/images/spices.jpg" alt="Premium Spices Collection" />
              </div>
              <div className="product-content">
                <h3>Premium Spices Collection</h3>
                <p className="supplier">Spice Garden Ltd.</p>
                <div className="product-details">
                  <span className="price">$8.00 - $15.00 / kg</span>
                  <span className="moq">MOQ: 50 kg</span>
                </div>
                <div className="product-actions">
                  <Link to="/product/premium-spices" className="btn btn-small">Request Quote</Link>
                  <button className="icon-btn" title="Add to favorites">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;