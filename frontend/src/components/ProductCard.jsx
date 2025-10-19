import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const navigate = useNavigate();
const API = import.meta.env.VITE_API_URL;
  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item._id === product._id || item.id === product._id);

  const handleImageError = (e) => {
    console.warn(`Image failed to load for product: ${product.name}`);
    setImageError(true);
    
    // Create a nice placeholder
    const placeholderSVG = `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f7f9"/>
        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666" text-anchor="middle" dy=".3em">Product Image</text>
      </svg>
    `)}`;
    e.target.src = placeholderSVG;
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

const getImageUrl = (imagePath) => {
  const BASE_URL = import.meta.env.VITE_API_URL || 'https://sourcebd-backend.onrender.com';

  if (!imagePath) return '/images/placeholder.jpg';
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;

  // Normalize path — remove duplicate slashes
  const normalizedPath = imagePath.startsWith('/') 
    ? imagePath 
    : `/uploads/${imagePath}`;

  return `${BASE_URL}${normalizedPath}`;
};


  const imageUrl = getImageUrl(product.image);

  return (
    <div className="product-card">
      <div className="product-img">
        {product.verified && (
          <span className="product-badge verified">Verified</span>
        )}
        {product.featured && !product.verified && (
          <span className="product-badge featured">Featured</span>
        )}
        
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name}
            onError={handleImageError}
            loading="lazy"
            className={imageError ? 'error' : ''}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: '#f5f7f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '14px'
          }}>
            No Image
          </div>
        )}
      </div>
      
      <div className="product-content">
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>
        
        <span className="product-supplier" title={product.supplier}>
          {product.supplier}
        </span>
        
        <div className="product-meta">
          <div className="product-price">
            {product.priceRange}
          </div>
          <div className="product-moq">
            MOQ: {product.moq || 'N/A'}
          </div>
        </div>
        
        <div className="product-actions">
          <Link 
            to={`/product/${product._id}`} 
            className="btn-request-quote"
          >
            <i className="fas fa-eye"></i>
            View Details
          </Link>
          
          <button 
            className={`favorite-btn ${isInWishlist ? 'in-wishlist' : ''}`} 
            onClick={handleFavoriteClick}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;