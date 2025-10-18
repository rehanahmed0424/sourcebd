import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard'; // Import the ProductCard component
import './cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
const API = import.meta.env.VITE_API_URL;

  // Fetch real products for "You Might Also Like" section
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (cartItems.length === 0) return;
      
      setLoadingRelated(true);
      try {
const response = await fetch(`${API}/api/products/featured`);

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
              <Link to="/" className="btn btn-primary">
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
                        <td className="price">৳{item.price?.toFixed(2) || '0.00'}</td>
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
                        <td className="subtotal">৳{item.subtotal?.toFixed(2) || '0.00'}</td>
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
                      <span>৳{totals.subtotal}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>৳{totals.shipping}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>৳{totals.tax}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>৳{totals.total}</span>
                    </div>
                  </div>
                  <p className="summary-note">
                    Prices are in BDT. Shipping costs may vary based on location.
                  </p>
                  <div className="summary-actions">
                    <Link to="/checkout" className="btn btn-primary btn-full">
                      Proceed to Checkout
                    </Link>
                    <Link to="/" className="btn btn-outline btn-full">
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
                  <ProductCard key={product._id} product={product} />
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