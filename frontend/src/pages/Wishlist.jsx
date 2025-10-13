import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  // Image URL helper function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    if (!imagePath.startsWith('/')) return `http://localhost:5000/uploads/${imagePath}`;
    return `http://localhost:5000${imagePath}`;
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="container">
          <div className="empty-state">
            <i className="fas fa-heart"></i>
            <h2>Your Wishlist is Empty</h2>
            <p>Save products you love to your wishlist for later.</p>
            <Link to="/" className="btn btn-primary">
              Browse Products
            </Link>
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
          <p>Your saved products ({wishlistItems.length} items)</p>
        </div>

        <div className="wishlist-items">
          {wishlistItems.map(item => (
            <div key={item._id || item.id} className="wishlist-item">
              <div className="product-info">
                <div className="product-image">
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <div className="product-details">
                  <h3>{item.name}</h3>
                  <p className="supplier">{item.supplier}</p>
                  <p className="moq">MOQ: {item.moq || 1} units</p>
                  {item.price ? (
                    <p className="price">${item.price.toFixed(2)} / unit</p>
                  ) : item.tieredPricing && item.tieredPricing.length > 0 ? (
                    <p className="price">From ${item.tieredPricing[0].price.toFixed(2)} / unit</p>
                  ) : (
                    <p className="price">Contact for pricing</p>
                  )}
                </div>
              </div>
              
              <div className="wishlist-actions">
                <Link 
                  to={`/product/${item._id || item.id}`}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
                <button 
                  className="btn btn-outline remove-btn"
                  onClick={() => removeFromWishlist(item._id || item.id)}
                >
                  <i className="fas fa-trash"></i>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;