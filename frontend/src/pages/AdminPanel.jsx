import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [adminType, setAdminType] = useState('categories');
  const [newData, setNewData] = useState({
    name: '',
    description: '',
    items: [''],
    priceRange: '',
    moq: 1,
    supplier: '',
    categoryId: '',
    image: null,
    verified: false,
    text: '',
    author: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories: ' + err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNewData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setNewData((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setNewData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index, value) => {
    const newItems = [...newData.items];
    newItems[index] = value;
    setNewData((prev) => ({ ...prev, items: newItems }));
  };

  const addItemField = () => {
    setNewData((prev) => ({ ...prev, items: [...prev.items, ''] }));
  };

  const removeItemField = (index) => {
    const newItems = newData.items.filter((_, i) => i !== index);
    setNewData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
      if (key === 'items' && Array.isArray(newData[key])) {
        formData.append(key, JSON.stringify(newData[key].filter(item => item))); // Filter out empty items
      } else if (key === 'image' && newData[key]) {
        formData.append('image', newData[key]);
      } else if (newData[key] !== null && newData[key] !== '') {
        formData.append(key, newData[key]);
      }
    });

    // Log FormData for debugging (optional, use in console)
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const endpoint = `/api/${adminType}`;
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add data: ${errorText || response.statusText}`);
      }
      const result = await response.json();
      setNewData(adminType === 'categories' ? { name: '', description: '', items: [''] } : adminType === 'products' ? { name: '', supplier: '', priceRange: '', moq: 1, categoryId: '', image: null, verified: false } : { text: '', author: '' });
      setError(null);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>Admin Panel</h1>
        <nav className="admin-tabs">
          <button
            className={adminType === 'categories' ? 'active' : ''}
            onClick={() => {
              setAdminType('categories');
              setNewData({ name: '', description: '', items: [''] });
            }}
          >
            Categories
          </button>
          <button
            className={adminType === 'products' ? 'active' : ''}
            onClick={() => {
              setAdminType('products');
              setNewData({ name: '', supplier: '', priceRange: '', moq: 1, categoryId: '', image: null, verified: false });
            }}
          >
            Products
          </button>
          <button
            className={adminType === 'testimonials' ? 'active' : ''}
            onClick={() => {
              setAdminType('testimonials');
              setNewData({ text: '', author: '' });
            }}
          >
            Testimonials
          </button>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </nav>

        <form onSubmit={handleAddData} className="admin-form" encType="multipart/form-data">
          <h2>Add New {adminType.charAt(0).toUpperCase() + adminType.slice(1)}</h2>
          {error && <p className="error">{error}</p>}
          {adminType === 'categories' && (
            <>
              <div className="form-group">
                <label htmlFor="name">Category Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Items</label>
                {newData.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => removeItemField(index)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addItemField}>Add Item</button>
              </div>
            </>
          )}
          {adminType === 'products' && (
            <>
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={newData.supplier}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="priceRange">Price Range</label>
                <input
                  type="text"
                  id="priceRange"
                  name="priceRange"
                  value={newData.priceRange}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="moq">MOQ</label>
                <input
                  type="number"
                  id="moq"
                  name="moq"
                  value={newData.moq}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryId">Category</label>
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
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="verified"
                    checked={newData.verified}
                    onChange={handleInputChange}
                  />
                  Verified
                </label>
              </div>
            </>
          )}
          {adminType === 'testimonials' && (
            <>
              <div className="form-group">
                <label htmlFor="text">Testimonial Text</label>
                <textarea
                  id="text"
                  name="text"
                  value={newData.text}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={newData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}
          <button type="submit" className="btn">Add {adminType.charAt(0).toUpperCase() + adminType.slice(1)}</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;