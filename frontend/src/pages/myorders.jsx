import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './myorders.css';

const MyOrders = () => {
  const { isAuthenticated, user, getAuthHeader } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (response.ok) {
        const orderDetails = await response.json();
        setSelectedOrder(orderDetails);
      } else {
        alert('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Error fetching order details');
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { label: 'Processing', class: 'processing' },
      confirmed: { label: 'Confirmed', class: 'confirmed' },
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

  const calculateDeliveryProgress = (timeline) => {
    const statusOrder = ['ordered', 'confirmed', 'shipped', 'delivered'];
    const currentStatus = timeline[timeline.length - 1]?.status || 'ordered';
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex >= 0 ? (currentIndex + 1) / statusOrder.length * 100 : 0;
  };

  const getCurrentStatusIndex = (timeline) => {
    const statusOrder = ['ordered', 'confirmed', 'shipped', 'delivered'];
    const currentStatus = timeline[timeline.length - 1]?.status || 'ordered';
    return statusOrder.indexOf(currentStatus);
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
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderId}</h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                    {order.shippingAddress && (
                      <p className="supplier">Ship to: {order.shippingAddress.city}, {order.shippingAddress.country}</p>
                    )}
                    {order.estimatedDelivery && (
                      <p className="estimated-delivery">
                        Estimated Delivery: {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
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
                        ${item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Progress */}
                {order.timeline && order.timeline.length > 0 && (
                  <div className="delivery-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${calculateDeliveryProgress(order.timeline)}%` }}
                      ></div>
                    </div>
                    <div className="progress-labels">
                      {['ordered', 'confirmed', 'shipped', 'delivered'].map((status, index) => {
                        const timelineStep = order.timeline.find(step => step.status === status);
                        const isCompleted = index <= getCurrentStatusIndex(order.timeline);
                        
                        return (
                          <div key={status} className="progress-step">
                            <div className={`step-dot ${isCompleted ? status : ''}`}></div>
                            <span className="step-label">
                              {status === 'ordered' && 'Ordered'}
                              {status === 'confirmed' && 'Confirmed'}
                              {status === 'shipped' && 'Shipped'}
                              {status === 'delivered' && 'Delivered'}
                            </span>
                            {timelineStep && (
                              <span className="step-date">{formatDate(timelineStep.date)}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="order-footer">
                  <div className="order-actions">
                    <button 
                      className="btn btn-outline btn-small"
                      onClick={() => fetchOrderDetails(order.orderId)}
                    >
                      View Details
                    </button>
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

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Order Details - #{selectedOrder.orderId}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="order-details">
                  <div className="detail-section">
                    <h4>Items</h4>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="detail-item">
                        <span>{item.name}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>${item.price} each</span>
                        <span>${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="detail-section">
                    <h4>Delivery Timeline</h4>
                    <div className="timeline">
                      {selectedOrder.timeline && selectedOrder.timeline.map((step, index) => (
                        <div key={index} className="timeline-step">
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <strong>{step.description}</strong>
                            <span>{formatDate(step.date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Shipping Information</h4>
                    {selectedOrder.shippingAddress && (
                      <div className="shipping-address">
                        <p><strong>Name:</strong> {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                        <p><strong>Address:</strong> {selectedOrder.shippingAddress.address}</p>
                        <p><strong>City:</strong> {selectedOrder.shippingAddress.city}</p>
                        <p><strong>State:</strong> {selectedOrder.shippingAddress.state}</p>
                        <p><strong>ZIP:</strong> {selectedOrder.shippingAddress.zipCode}</p>
                        <p><strong>Country:</strong> {selectedOrder.shippingAddress.country}</p>
                        <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
                      </div>
                    )}
                    {selectedOrder.trackingNumber && (
                      <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                    )}
                    {selectedOrder.estimatedDelivery && (
                      <p><strong>Estimated Delivery:</strong> {formatDate(selectedOrder.estimatedDelivery)}</p>
                    )}
                  </div>

                  <div className="detail-section">
                    <h4>Order Summary</h4>
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping:</span>
                        <span>$0.00</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;