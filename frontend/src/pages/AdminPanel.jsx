import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const [adminType, setAdminType] = useState('categories');
  const [newData, setNewData] = useState({
    name: '',
    description: '',
    priceRange: '',
    moq: 1,
    supplier: '',
    categoryId: '',
    image: null,
    verified: false,
    featured: false,
    text: '',
    author: '',
    imagePreview: null,
    // New fields for enhanced product details
    specifications: {
      material: '',
      size: '',
      weightCapacity: '',
      leadTime: '',
      customization: '',
      handleLength: '',
      printingMethod: '',
      colorOptions: '',
      packaging: ''
    },
    reviewCount: 0,
    orderCount: 0
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Image URL helper function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/product-placeholder.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    if (!imagePath.startsWith('/')) return `http://localhost:5000/uploads/${imagePath}`;
    return `http://localhost:5000${imagePath}`;
  };

  // Fetch data based on current tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = '';
        switch (adminType) {
          case 'categories':
            endpoint = 'categories';
            break;
          case 'products':
            endpoint = 'products';
            break;
          case 'testimonials':
            endpoint = 'testimonials';
            break;
          default:
            return;
        }

        const response = await fetch(`http://localhost:5000/api/${endpoint}`);
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const data = await response.json();
        
        switch (adminType) {
          case 'categories':
            setCategories(data);
            break;
          case 'products':
            setProducts(data);
            break;
          case 'testimonials':
            setTestimonials(data);
            break;
          default:
            break;
        }
      } catch (err) {
        setError('Failed to load data: ' + err.message);
      }
    };

    fetchData();
  }, [adminType]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setNewData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else if (type === 'checkbox') {
      setNewData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Please select a valid image file (JPEG, PNG, etc.)');
          return;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Image size should be less than 5MB');
          return;
        }
        setNewData((prev) => ({ 
          ...prev, 
          image: file,
          imagePreview: URL.createObjectURL(file)
        }));
        setError(null); // Clear any previous errors
      }
    } else {
      setNewData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!newData.name && adminType !== 'testimonials') {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (adminType === 'products' && !newData.categoryId) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    if (adminType === 'testimonials' && (!newData.text || !newData.author)) {
      setError('Text and author are required for testimonials');
      setLoading(false);
      return;
    }

    // Enhanced image validation
    if ((adminType === 'categories' || adminType === 'products') && !newData.image) {
      setError('Image is required');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    
    // Add common fields with better logging
    console.log('Submitting form data:', {
      name: newData.name,
      image: newData.image ? newData.image.name : 'No image',
      adminType: adminType,
      specifications: newData.specifications
    });

    Object.keys(newData).forEach((key) => {
      if (key === 'image' && newData[key]) {
        formData.append('image', newData[key]);
        console.log('Added image to formData:', newData[key].name);
      } else if (key === 'specifications') {
        // Handle specifications object
        Object.keys(newData.specifications).forEach(specKey => {
          if (newData.specifications[specKey]) {
            formData.append(`specifications[${specKey}]`, newData.specifications[specKey]);
          }
        });
      } else if (key !== 'imagePreview' && newData[key] !== null && newData[key] !== '') {
        formData.append(key, newData[key]);
      }
    });

    try {
      const endpoint = `/api/${adminType}`;
      console.log('Making request to:', `http://localhost:5000${endpoint}`);
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Failed to add ${adminType}`);
      }
      
      const result = await response.json();
      console.log('Success response:', result);
      setSuccess(`${adminType.slice(0, -1)} added successfully!`);
      
      // Refresh the data list
      const refreshResponse = await fetch(`http://localhost:5000/api/${adminType}`);
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        console.log('Refreshed data:', refreshData);
        switch (adminType) {
          case 'categories':
            setCategories(refreshData);
            break;
          case 'products':
            setProducts(refreshData);
            break;
          case 'testimonials':
            setTestimonials(refreshData);
            break;
          default:
            break;
        }
      }
      
      resetForm();
      
    } catch (err) {
      console.error('Error in handleAddData:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${adminType.slice(0, -1)}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${adminType}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${adminType.slice(0, -1)}`);
      }

      // Remove from state
      switch (adminType) {
        case 'categories':
          setCategories(categories.filter(item => item._id !== id));
          break;
        case 'products':
          setProducts(products.filter(item => item._id !== id));
          break;
        case 'testimonials':
          setTestimonials(testimonials.filter(item => item._id !== id));
          break;
        default:
          break;
      }

      setSuccess(`${adminType.slice(0, -1)} deleted successfully!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setNewData({
      name: '',
      description: '',
      priceRange: '',
      moq: 1,
      supplier: '',
      categoryId: '',
      image: null,
      verified: false,
      featured: false,
      text: '',
      author: '',
      imagePreview: null,
      specifications: {
        material: '',
        size: '',
        weightCapacity: '',
        leadTime: '',
        customization: '',
        handleLength: '',
        printingMethod: '',
        colorOptions: '',
        packaging: ''
      },
      reviewCount: 0,
      orderCount: 0
    });
  };

  const handleTabChange = (type) => {
    setAdminType(type);
    resetForm();
    setError(null);
    setSuccess(null);
  };

  const getCurrentItems = () => {
    switch (adminType) {
      case 'categories':
        return categories;
      case 'products':
        return products;
      case 'testimonials':
        return testimonials;
      default:
        return [];
    }
  };

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage your website content</p>
        </div>

        <nav className="admin-tabs">
          <button
            className={adminType === 'categories' ? 'active' : ''}
            onClick={() => handleTabChange('categories')}
          >
            <i className="fas fa-folder"></i> Categories
          </button>
          <button
            className={adminType === 'products' ? 'active' : ''}
            onClick={() => handleTabChange('products')}
          >
            <i className="fas fa-box"></i> Products
          </button>
          <button
            className={adminType === 'testimonials' ? 'active' : ''}
            onClick={() => handleTabChange('testimonials')}
          >
            <i className="fas fa-comment"></i> Testimonials
          </button>
          <Link to="/" className="btn btn-outline back-btn">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </nav>

        <div className="admin-content">
          {/* Add Form */}
          <form onSubmit={handleAddData} className="admin-form" encType="multipart/form-data">
            <div className="form-header">
              <h2>Add New {adminType.charAt(0).toUpperCase() + adminType.slice(1)}</h2>
              <p>Fill in the details below to add new content</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <i className="fas fa-check-circle"></i>
                {success}
              </div>
            )}

            <div className="form-sections">
              {adminType === 'categories' && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Category Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Textile & Apparel"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={newData.description}
                      onChange={handleInputChange}
                      placeholder="e.g., Garments, fabrics, yarns and accessories"
                      required
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="image">Category Image *</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="image" className="file-upload-label">
                        <i className="fas fa-cloud-upload-alt"></i>
                        Choose Image (JPEG, PNG, max 5MB)
                      </label>
                    </div>
                    {newData.imagePreview && (
                      <div className="image-preview">
                        <img src={newData.imagePreview} alt="Preview" />
                        <p>{newData.image?.name}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {adminType === 'products' && (
                <>
                  <div className="form-section">
                    <h3>Basic Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Product Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={newData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Eco-Friendly Jute Bags"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="supplier">Supplier *</label>
                        <input
                          type="text"
                          id="supplier"
                          name="supplier"
                          value={newData.supplier}
                          onChange={handleInputChange}
                          placeholder="e.g., Dhaka Jute Mills Ltd."
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="priceRange">Price Range *</label>
                        <input
                          type="text"
                          id="priceRange"
                          name="priceRange"
                          value={newData.priceRange}
                          onChange={handleInputChange}
                          placeholder="e.g., $2.50 - $4.00"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="moq">Minimum Order Quantity (MOQ) *</label>
                        <input
                          type="number"
                          id="moq"
                          name="moq"
                          value={newData.moq}
                          onChange={handleInputChange}
                          min="1"
                          placeholder="e.g., 500"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="reviewCount">Review Count</label>
                        <input
                          type="number"
                          id="reviewCount"
                          name="reviewCount"
                          value={newData.reviewCount}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="e.g., 28"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="orderCount">Order Count</label>
                        <input
                          type="number"
                          id="orderCount"
                          name="orderCount"
                          value={newData.orderCount}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="e.g., 125"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="categoryId">Category *</label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={newData.categoryId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="description">Product Description *</label>
                      <textarea
                        id="description"
                        name="description"
                        value={newData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the product features, benefits, and key selling points..."
                        required
                        rows="4"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="image">Product Image *</label>
                      <div className="file-upload">
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="image" className="file-upload-label">
                          <i className="fas fa-cloud-upload-alt"></i>
                          Choose Product Image (JPEG, PNG, max 5MB)
                        </label>
                      </div>
                      {newData.imagePreview && (
                        <div className="image-preview">
                          <img src={newData.imagePreview} alt="Preview" />
                          <p>{newData.image?.name}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="verified"
                            checked={newData.verified}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark"></span>
                          Mark as Verified Supplier
                        </label>
                      </div>
                      
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={newData.featured}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark"></span>
                          Feature this product
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Specifications Section */}
                  <div className="form-section">
                    <h3>Product Specifications</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="specifications.material">Material</label>
                        <input
                          type="text"
                          id="specifications.material"
                          name="specifications.material"
                          value={newData.specifications.material}
                          onChange={handleInputChange}
                          placeholder="e.g., 100% Natural Jute"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="specifications.size">Size/Dimensions</label>
                        <input
                          type="text"
                          id="specifications.size"
                          name="specifications.size"
                          value={newData.specifications.size}
                          onChange={handleInputChange}
                          placeholder="e.g., 14x16x5 inches"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="specifications.weightCapacity">Weight Capacity</label>
                        <input
                          type="text"
                          id="specifications.weightCapacity"
                          name="specifications.weightCapacity"
                          value={newData.specifications.weightCapacity}
                          onChange={handleInputChange}
                          placeholder="e.g., 10 kg"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="specifications.leadTime">Lead Time</label>
                        <input
                          type="text"
                          id="specifications.leadTime"
                          name="specifications.leadTime"
                          value={newData.specifications.leadTime}
                          onChange={handleInputChange}
                          placeholder="e.g., 15-20 days"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="specifications.customization">Customization Options</label>
                        <input
                          type="text"
                          id="specifications.customization"
                          name="specifications.customization"
                          value={newData.specifications.customization}
                          onChange={handleInputChange}
                          placeholder="e.g., Logo Printing Available"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="specifications.handleLength">Handle Length</label>
                        <input
                          type="text"
                          id="specifications.handleLength"
                          name="specifications.handleLength"
                          value={newData.specifications.handleLength}
                          onChange={handleInputChange}
                          placeholder="e.g., 10 inches"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="specifications.printingMethod">Printing Method</label>
                        <input
                          type="text"
                          id="specifications.printingMethod"
                          name="specifications.printingMethod"
                          value={newData.specifications.printingMethod}
                          onChange={handleInputChange}
                          placeholder="e.g., Screen Printing"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="specifications.colorOptions">Color Options</label>
                        <input
                          type="text"
                          id="specifications.colorOptions"
                          name="specifications.colorOptions"
                          value={newData.specifications.colorOptions}
                          onChange={handleInputChange}
                          placeholder="e.g., Natural, Custom Colors"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="specifications.packaging">Packaging Details</label>
                      <input
                        type="text"
                        id="specifications.packaging"
                        name="specifications.packaging"
                        value={newData.specifications.packaging}
                        onChange={handleInputChange}
                        placeholder="e.g., 100 units per carton"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {adminType === 'testimonials' && (
                <>
                  <div className="form-group">
                    <label htmlFor="text">Testimonial Text *</label>
                    <textarea
                      id="text"
                      name="text"
                      value={newData.text}
                      onChange={handleInputChange}
                      placeholder="e.g., SourceBd has transformed how we source products from Bangladesh..."
                      required
                      rows="4"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="author">Author *</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={newData.author}
                      onChange={handleInputChange}
                      placeholder="e.g., Ahmed Rahman, Fashion Importer, UK"
                      required
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i> Add {adminType.slice(0, -1)}
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline cancel-btn"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>

          {/* Items List with Delete Option */}
          <div className="items-list">
            <h3>Existing {adminType.charAt(0).toUpperCase() + adminType.slice(1)}</h3>
            {getCurrentItems().length === 0 ? (
              <p className="no-items">No {adminType} found.</p>
            ) : (
              <div className="items-grid">
                {getCurrentItems().map((item) => (
                  <div key={item._id} className="item-card">
                    {adminType === 'categories' && (
                      <>
                        <div className="item-image">
                          <img 
                            src={getImageUrl(item.image)} 
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4Ij5DYXRlZ29yeSUyMEltYWdlJTNDL3RleHQ+PC9zdmc+';
                            }}
                          />
                        </div>
                        <div className="item-content">
                          <h4>{item.name}</h4>
                          <p>{item.description}</p>
                        </div>
                      </>
                    )}
                    
                    {adminType === 'products' && (
                      <>
                        <div className="item-image">
                          <img 
                            src={getImageUrl(item.image)} 
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmN2Y5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4Ij5Qcm9kdWN0JTIwSW1hZ2UlM0MvdGV4dD48L3N2Zz4=';
                            }}
                          />
                          {item.verified && <span className="verified-badge">Verified</span>}
                          {item.featured && <span className="featured-badge">Featured</span>}
                        </div>
                        <div className="item-content">
                          <h4>{item.name}</h4>
                          <p className="supplier">{item.supplier}</p>
                          <div className="item-details">
                            <span className="price">{item.priceRange}</span>
                            <span className="moq">MOQ: {item.moq}</span>
                          </div>
                          {item.specifications && (
                            <div className="item-specs">
                              <small>
                                <strong>Material:</strong> {item.specifications.material || 'Not specified'}
                              </small>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    
                    {adminType === 'testimonials' && (
                      <div className="item-content full-width">
                        <div className="testimonial-content">
                          <i className="fas fa-quote-left"></i>
                          <p>{item.text}</p>
                        </div>
                        <div className="testimonial-author">
                          <strong>{item.author}</strong>
                        </div>
                      </div>
                    )}
                    
                    <div className="item-actions">
                      <button 
                        className="btn btn-danger delete-btn"
                        onClick={() => handleDelete(item._id)}
                        title={`Delete ${adminType.slice(0, -1)}`}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;