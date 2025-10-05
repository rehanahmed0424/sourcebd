import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
    setIsFavorite(!isFavorite);
    // Here you would typically make an API call to update favorites
    console.log('Toggle favorite:', product._id, !isFavorite);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    if (!imagePath.startsWith('/')) return `http://localhost:5000/uploads/${imagePath}`;
    return `http://localhost:5000${imagePath}`;
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
            className="favorite-btn" 
            onClick={handleFavoriteClick}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <i className={isFavorite ? "fas fa-heart" : "far fa-heart"}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;