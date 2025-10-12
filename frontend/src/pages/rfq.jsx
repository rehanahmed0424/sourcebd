import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './rfq.css';

const RFQ = () => {
  const { isAuthenticated, user } = useAuth();
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '',
    description: '',
    specifications: '',
    targetPrice: '',
    deadline: '',
    attachments: null
  });

  // Mock data for existing RFQs
  const mockRFQs = [
    {
      id: 1,
      productName: 'Custom Jute Bags',
      category: 'Textile & Apparel',
      quantity: '10,000 units',
      description: 'Looking for eco-friendly jute bags with custom printing',
      status: 'Open',
      date: '2024-01-15',
      quotes: 5,
      supplier: 'Dhaka Jute Mills'
    },
    {
      id: 2,
      productName: 'Ceramic Dinner Set',
      category: 'Home & Living',
      quantity: '5,000 sets',
      description: 'Premium ceramic dinner set for export market',
      status: 'In Progress',
      date: '2024-01-10',
      quotes: 3,
      supplier: 'Bangladesh Ceramics'
    }
  ];

  useEffect(() => {
    // In real app, fetch from API
    setRfqs(mockRFQs);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachments') {
      setFormData(prev => ({ ...prev, attachments: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRFQ = {
        id: rfqs.length + 1,
        productName: formData.productName,
        category: formData.category,
        quantity: formData.quantity,
        description: formData.description,
        status: 'Open',
        date: new Date().toISOString().split('T')[0],
        quotes: 0,
        supplier: 'Pending'
      };

      setRfqs(prev => [newRFQ, ...prev]);
      setFormData({
        productName: '',
        category: '',
        quantity: '',
        description: '',
        specifications: '',
        targetPrice: '',
        deadline: '',
        attachments: null
      });
      setShowForm(false);
      alert('RFQ submitted successfully!');
    } catch (error) {
      alert('Failed to submit RFQ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="container">
          <div className="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to access the RFQ page.</p>
            <Link to="/login" className="btn btn-primary">
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rfq-page">
      <div className="container">
        <div className="page-header">
          <h1>Request for Quotation (RFQ)</h1>
          <p>Manage your product inquiries and get quotes from suppliers</p>
        </div>

        <div className="rfq-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Create New RFQ
          </button>
        </div>

        {showForm && (
          <div className="rfq-form-section">
            <div className="form-card">
              <div className="form-header">
                <h3>Create New RFQ</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="rfq-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Textile & Apparel">Textile & Apparel</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Construction">Construction</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 1000 units, 500 kg"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Target Price (USD)</label>
                    <input
                      type="number"
                      name="targetPrice"
                      value={formData.targetPrice}
                      onChange={handleInputChange}
                      placeholder="Enter target price per unit"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Product Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Describe your product requirements in detail..."
                  />
                </div>

                <div className="form-group">
                  <label>Technical Specifications</label>
                  <textarea
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Add any technical specifications or requirements..."
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Attach File</label>
                    <input
                      type="file"
                      name="attachments"
                      onChange={handleInputChange}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit RFQ'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="rfq-list">
          <h2>Your RFQs</h2>
          {rfqs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No RFQs Yet</h3>
              <p>Create your first request for quotation to get started</p>
            </div>
          ) : (
            <div className="rfq-cards">
              {rfqs.map(rfq => (
                <div key={rfq.id} className="rfq-card">
                  <div className="rfq-header">
                    <h3>{rfq.productName}</h3>
                    <span className={`status-badge ${rfq.status.toLowerCase()}`}>
                      {rfq.status}
                    </span>
                  </div>
                  
                  <div className="rfq-details">
                    <div className="detail-item">
                      <span className="label">Category:</span>
                      <span className="value">{rfq.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Quantity:</span>
                      <span className="value">{rfq.quantity}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Date:</span>
                      <span className="value">{rfq.date}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Quotes Received:</span>
                      <span className="value">{rfq.quotes}</span>
                    </div>
                  </div>
                  
                  <div className="rfq-description">
                    <p>{rfq.description}</p>
                  </div>
                  
                  <div className="rfq-actions">
                    <button className="btn btn-small btn-outline">
                      View Quotes
                    </button>
                    <button className="btn btn-small">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQ;