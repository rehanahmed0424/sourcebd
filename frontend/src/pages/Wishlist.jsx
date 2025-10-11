import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/product-placeholder.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    if (!imagePath.startsWith('/')) return `http://localhost:5000/uploads/${imagePath}`;
    return `http://localhost:5000${imagePath}`;
  };

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: product.moq || 1,
      unitPrice: product.tieredPricing?.[0]?.price || 0,
      totalPrice: (product.tieredPricing?.[0]?.price || 0) * (product.moq || 1)
    });
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(product => {
      addToCart({
        ...product,
        quantity: product.moq || 1,
        unitPrice: product.tieredPricing?.[0]?.price || 0,
        totalPrice: (product.tieredPricing?.[0]?.price || 0) * (product.moq || 1)
      });
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to view your wishlist.</p>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="page-header">
          <h1>My Wishlist</h1>
          <p>Save products you're interested in for later</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">🤍</div>
            <h3>Your wishlist is empty</h3>
            <p>Start adding products you love to your wishlist</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <>
            <div className="wishlist-actions">
              <div className="wishlist-count">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </div>
              <div className="action-buttons">
                <button 
                  className="btn btn-outline"
                  onClick={handleMoveAllToCart}
                >
                  Add All to Cart
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={clearWishlist}
                >
                  Clear Wishlist
                </button>
              </div>
            </div>

            <div className="wishlist-items">
              {wishlistItems.map(product => (
                <div key={product._id} className="wishlist-item">
                  <div className="product-info">
                    <div className="product-image">
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4Ij5Qcm9kdWN0JTIwSW1hZ2UlM0MvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <div className="product-details">
                      <h3>
                        <Link to={`/product/${product._id}`}>{product.name}</Link>
                      </h3>
                      <p className="supplier">{product.supplier}</p>
                      <div className="product-meta">
                        <span className="moq">MOQ: {product.moq} units</span>
                        {product.verified && <span className="badge verified">Verified</span>}
                      </div>
                    </div>
                  </div>

                  <div className="price-info">
                    {product.tieredPricing && product.tieredPricing.length > 0 ? (
                      <div className="price-range">
                        ${product.tieredPricing[0].price.toFixed(2)} - 
                        ${product.tieredPricing[product.tieredPricing.length - 1].price.toFixed(2)}
                      </div>
                    ) : (
                      <div className="price-range">Contact for price</div>
                    )}
                  </div>

                  <div className="item-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="btn btn-outline remove-btn"
                      onClick={() => removeFromWishlist(product._id)}
                      title="Remove from wishlist"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;