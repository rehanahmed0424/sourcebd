import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Fetch real products for "You Might Also Like" section
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (cartItems.length === 0) return;
      
      setLoadingRelated(true);
      try {
        const response = await fetch('http://localhost:5000/api/products/featured');
        if (response.ok) {
          const products = await response.json();
          setRelatedProducts(products.slice(0, 3));
        } else {
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [cartItems.length]);

  const calculateTotals = () => {
    const subtotal = getCartTotal();
    const shipping = 250.00;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const totals = calculateTotals();

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <h3>Your cart is empty</h3>
              <p>Browse our products and add items to your cart</p>
              <Link to="/products" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
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
                    {cartItems.map(item => (
                      <tr key={item.id} className="cart-item">
                        <td>
                          <div className="product-info">
                            <div className="product-image">
                              <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
                            </div>
                            <div className="product-details">
                              <h3>{item.name}</h3>
                              {/* Removed supplier and MOQ to reduce space */}
                            </div>
                          </div>
                        </td>
                        <td className="price">${item.price?.toFixed(2) || '0.00'}</td>
                        <td>
                          <div className="quantity-controls">
                            <button 
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="subtotal">${item.subtotal?.toFixed(2) || '0.00'}</td>
                        <td>
                          <button 
                            className="remove-btn" 
                            title="Remove item"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-summary">
                <div className="summary-card">
                  <h2>Order Summary</h2>
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${totals.subtotal}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>${totals.shipping}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>${totals.tax}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${totals.total}</span>
                    </div>
                  </div>
                  <p className="summary-note">
                    Prices are in USD. Shipping costs may vary based on location.
                  </p>
                  <div className="summary-actions">
                    <Link to="/checkout" className="btn btn-primary btn-full">
                      Proceed to Checkout
                    </Link>
                    <Link to="/products" className="btn btn-outline btn-full">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {cartItems.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>You Might Also Like</h2>
              <p>Discover more products</p>
            </div>
            
            {loadingRelated ? (
              <div className="loading-products">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : relatedProducts.length > 0 ? (
              <div className="products-grid">
                {relatedProducts.map(product => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      {product.verified && <span className="verified-badge">Verified</span>}
                      <img 
                        src={product.image ? `http://localhost:5000/uploads/${product.image}` : '/images/placeholder.jpg'} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                    </div>
                    <div className="product-content">
                      <h3>{product.name}</h3>
                      <div className="product-details">
                        {product.tieredPricing && product.tieredPricing.length > 0 ? (
                          <span className="price">
                            ${product.tieredPricing[0].price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="price">Contact for pricing</span>
                        )}
                      </div>
                      <div className="product-actions">
                        <Link to={`/product/${product._id}`} className="btn btn-small">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No additional products available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Cart;