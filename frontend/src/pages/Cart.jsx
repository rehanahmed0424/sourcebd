import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <div>
      <div className="breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li>Shopping Cart</li>
        </ol>
      </div>
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <p>
          Review your items and proceed to checkout
        </p>
      </div>
      <section className="categories-section">
        <div className="container">
          <div className="category-list">
            <div className="category-item">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="product-info">
                        <img src="/placeholder-image.jpg" alt="Eco-Friendly Jute Bags" />
                        <div>
                          <strong>Eco-Friendly Jute Bags</strong><br />
                          Dhaka Jute Mills Ltd.<br />
                          MOQ: 500 units
                        </div>
                      </div>
                    </td>
                    <td>$3.25 / unit</td>
                    <td>
                      <div className="quantity-controls">
                        <button>-</button>
                        <span>500</span>
                        <button>+</button>
                      </div>
                    </td>
                    <td>$1,625.00</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="product-info">
                        <img src="/placeholder-image.jpg" alt="100% Cotton T-Shirts" />
                        <div>
                          <strong>100% Cotton T-Shirts</strong><br />
                          Chittagong Textiles<br />
                          MOQ: 100 pieces
                        </div>
                      </div>
                    </td>
                    <td>$5.50 / piece</td>
                    <td>
                      <div className="quantity-controls">
                        <button>-</button>
                        <span>200</span>
                        <button>+</button>
                      </div>
                    </td>
                    <td>$1,100.00</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="product-info">
                        <img src="/placeholder-image.jpg" alt="Genuine Leather Wallets" />
                        <div>
                          <strong>Genuine Leather Wallets</strong><br />
                          Sylhet Leather Co.<br />
                          MOQ: 50 pieces
                        </div>
                      </div>
                    </td>
                    <td>$10.00 / piece</td>
                    <td>
                      <div className="quantity-controls">
                        <button>-</button>
                        <span>100</span>
                        <button>+</button>
                      </div>
                    </td>
                    <td>$1,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="category-list">
            <div className="category-item">
              <h2>Order Summary</h2>
              <ul>
                <li>Subtotal: $3,725.00</li>
                <li>Shipping: $250.00</li>
                <li>Tax: $372.50</li>
                <li><strong>Total: $4,347.50</strong></li>
              </ul>
              <p>Prices are in USD. Shipping costs may vary based on location and shipping method.</p>
              <div className="hero-buttons">
                <Link to="#" className="btn">Proceed to Checkout</Link>
                <Link to="/" className="btn">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-title">
            <h2>You Might Also Like</h2>
            <p>Discover more products from Bangladeshi suppliers</p>
          </div>
          <div className="category-list">
            <div className="category-item">
              <span className="verified-badge">Verified</span>
              <h3>Ceramic Dinner Set</h3>
              <p>
                Rajshahi Ceramics<br />
                $25.00 - $40.00 / set<br />
                MOQ: 20 sets
              </p>
              <Link to="#" className="btn">Request Quote</Link>
            </div>
            <div className="category-item">
              <h3>Bamboo Furniture</h3>
              <p>
                Sylhet Crafts<br />
                $80.00 - $150.00 / piece<br />
                MOQ: 10 pieces
              </p>
              <Link to="#" className="btn">Request Quote</Link>
            </div>
            <div className="category-item">
              <span className="verified-badge">Verified</span>
              <h3>Premium Spices Collection</h3>
              <p>
                Spice Garden Ltd.<br />
                $8.00 - $15.00 / kg<br />
                MOQ: 50 kg
              </p>
              <Link to="#" className="btn">Request Quote</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;