import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance',
    verified: false,
    featured: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  // Fetch search results with filters
  const fetchSearchResults = async (filterParams = {}) => {
    if (!query) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Searching with filters:', filterParams);
      
      // Build query string with filters
      const queryParams = new URLSearchParams({
        q: query,
        ...filterParams
      });

      const response = await fetch(`http://localhost:5000/api/search?${queryParams}`);
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Enhanced search results received:', data);
      setResults(data);
      
      // Update filters from response
      if (data.filters) {
        setFilters(data.filters);
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err.message);
      
      // Fallback with empty results
      setResults({
        query: query,
        products: [],
        productCount: 0,
        totalResults: 0,
        categories: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query, navigate]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    
    setFilters(newFilters);
    
    // Convert filters to URL params
    const filterParams = {};
    if (newFilters.category !== 'all') filterParams.category = newFilters.category;
    if (newFilters.minPrice) filterParams.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice) filterParams.maxPrice = newFilters.maxPrice;
    if (newFilters.sortBy !== 'relevance') filterParams.sortBy = newFilters.sortBy;
    if (newFilters.verified) filterParams.verified = 'true';
    if (newFilters.featured) filterParams.featured = 'true';
    
    fetchSearchResults(filterParams);
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'relevance',
      verified: false,
      featured: false
    };
    
    setFilters(defaultFilters);
    fetchSearchResults();
  };

  // Handle image errors
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4Ij5Qcm9kdWN0JTIwSW1hZ2U8L3RleHQ+PC9zdmc+';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Searching for "{query}"...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="error-message">
          <h3>No Results</h3>
          <p>Unable to load search results.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="search-results-page">
      <div className="container">
        {/* Header - Removed breadcrumb */}
        <div className="search-header">
          <h1>Search Results for "{results.query}"</h1>
          <p className="search-stats">
            Found {results.productCount} product{results.productCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-message" style={{ marginBottom: '2rem' }}>
            <strong>Note:</strong> {error}
          </div>
        )}

        {/* Filters and Sorting Bar */}
        <div className="search-controls">
          <div className="controls-top">
            <button 
              className="btn btn-outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter"></i>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <div className="sort-controls">
              <label htmlFor="sortBy">Sort by:</label>
              <select 
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="filters-expanded">
              <div className="filter-group">
                <h4>Category</h4>
                <select 
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {results.categories?.map(category => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-inputs">
                  <input
                    type="text"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="text"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <h4>Supplier Status</h4>
                <div className="checkbox-filters">
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    />
                    Verified Suppliers Only
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    />
                    Featured Products Only
                  </label>
                </div>
              </div>

              <div className="filter-actions">
                <button className="btn btn-outline" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="products-section">
          {results.productCount > 0 ? (
<div className="products-grid">
  {results.products.map((product) => (
    <div key={product._id} className="product-card">
      <div className="product-image">
        {product.verified && <span className="verified-badge">Verified</span>}
        {product.featured && <span className="featured-badge">Featured</span>}
        <img 
          src={product.image ? `http://localhost:5000${product.image}` : '/images/product-placeholder.jpg'} 
          alt={product.name}
          onError={handleImageError}
        />
      </div>
      <div className="product-content">
        <h3>{product.name}</h3>
        <p className="supplier">{product.supplier}</p>
        {product.categoryId && (
          <p className="product-category">
            Category: {product.categoryId.name}
          </p>
        )}
        <div className="product-details">
          <div className="price-container">
            <span className="price-label">Price Range:</span>
            <span className="price">{product.priceRange}</span>
          </div>
          <span className="moq">MOQ: {product.moq}</span>
        </div>
        <div className="product-actions">
          <Link to={`/product/${product._id}`} className="btn-view-details">
            <i className="fas fa-eye"></i>
            View Details
          </Link>
          <button className="icon-btn" title="Add to favorites">
            <i className="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>No products found for "{results.query}"</h3>
              <p>
                Try adjusting your search terms or browse our categories
              </p>
              <div className="no-results-actions">
                <Link to="/" className="btn btn-primary">
                  Browse All Categories
                </Link>
                <button className="btn btn-outline" onClick={clearFilters}>
                  Clear Search Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchResults;