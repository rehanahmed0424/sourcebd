import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './myorders.css';

const MyOrders = () => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock data for orders
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      items: [
        { name: 'Eco-Friendly Jute Bags', quantity: 500, price: 3.50 },
        { name: 'Organic Cotton Tote Bags', quantity: 300, price: 4.25 }
      ],
      total: 3025.00,
      status: 'delivered',
      supplier: 'Dhaka Jute Mills Ltd.',
      trackingNumber: 'TRK789456123'
    },
    {
      id: 'ORD-002',
      date: '2024-01-12',
      items: [
        { name: 'Handmade Ceramic Mugs', quantity: 1000, price: 2.75 }
      ],
      total: 2750.00,
      status: 'shipped',
      supplier: 'Bangladesh Ceramics Co.',
      trackingNumber: 'TRK456123789'
    },
    {
      id: 'ORD-003',
      date: '2024-01-08',
      items: [
        { name: 'Bamboo Cutting Boards', quantity: 200, price: 8.99 },
        { name: 'Wooden Kitchen Utensils', quantity: 500, price: 3.25 }
      ],
      total: 3555.00,
      status: 'processing',
      supplier: 'Eco Home Products'
    },
    {
      id: 'ORD-004',
      date: '2024-01-03',
      items: [
        { name: 'Silk Scarves', quantity: 150, price: 12.50 }
      ],
      total: 1875.00,
      status: 'cancelled',
      supplier: 'Dhaka Silk House'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { label: 'Processing', class: 'processing' },
      shipped: { label: 'Shipped', class: 'shipped' },
      delivered: { label: 'Delivered', class: 'delivered' },
      cancelled: { label: 'Cancelled', class: 'cancelled' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="container">
          <div className="auth-message">
            <h2>Authentication Required</h2>
            <p>Please log in to view your orders.</p>
            <Link to="/login" className="btn btn-primary">
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track and manage your purchase orders</p>
        </div>

        <div className="orders-filters">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders
            </button>
            <button 
              className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
              onClick={() => setFilter('processing')}
            >
              Processing
            </button>
            <button 
              className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
              onClick={() => setFilter('shipped')}
            >
              Shipped
            </button>
            <button 
              className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilter('delivered')}
            >
              Delivered
            </button>
            <button 
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
          
          <div className="orders-stats">
            <span>{filteredOrders.length} orders found</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No Orders Found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${filter} orders found.`}
            </p>
            {filter === 'all' && (
              <Link to="/products" className="btn btn-primary">
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">Placed on {formatDate(order.date)}</p>
                    <p className="supplier">Supplier: {order.supplier}</p>
                  </div>
                  <div className="order-meta">
                    {getStatusBadge(order.status)}
                    <div className="order-total">${order.total.toFixed(2)}</div>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                      </div>
                      <div className="item-price">
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-actions">
                    <button className="btn btn-outline btn-small">
                      View Details
                    </button>
                    {order.status === 'shipped' && order.trackingNumber && (
                      <button className="btn btn-outline btn-small">
                        Track Package
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="btn btn-outline btn-small">
                        Download Invoice
                      </button>
                    )}
                    {(order.status === 'processing' || order.status === 'shipped') && (
                      <button className="btn btn-outline btn-small">
                        Contact Supplier
                      </button>
                    )}
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="tracking-info">
                      <span>Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;