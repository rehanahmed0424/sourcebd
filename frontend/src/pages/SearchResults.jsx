import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './SearchResults.css';

const SearchResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Searching for:', query);
        
        // Use the REAL search endpoint
        const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Search results received:', data);
        setResults(data);
      } catch (err) {
        console.error('❌ Search error:', err);
        setError(err.message);
        
        // Fallback with empty results
        setResults({
          query: query,
          products: [],
          productCount: 0,
          totalResults: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Searching for "{query}"...</p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <main className="search-results-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-content">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Search Results</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Header */}
        <div className="search-header">
          <h1>Search Results for "{results.query}"</h1>
          <div className="search-stats">
            Found {results.productCount} {results.productCount === 1 ? 'product' : 'products'}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ 
            background: '#fff3cd', 
            color: '#856404', 
            padding: '15px', 
            margin: '20px 0',
            borderRadius: '5px',
            border: '1px solid #ffeaa7'
          }}>
            <strong>Note:</strong> {error}
          </div>
        )}

        {/* No Results */}
        {results.productCount === 0 && (
          <div className="no-results">
            <div className="no-results-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No products found for "{results.query}"</h3>
            <p>Try adjusting your search terms or browse our categories</p>
            <div className="no-results-actions">
              <Link to="/" className="btn btn-primary">
                Browse All Categories
              </Link>
              <button 
                onClick={() => navigate(-1)} 
                className="btn btn-outline"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {results.productCount > 0 && (
          <div className="products-grid">
            {results.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResults;