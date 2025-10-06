"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheckCircle, FaClock, FaTruck, FaShoppingBag } from 'react-icons/fa';
import './track.css';

export default function TrackOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    fetchOrders();
    fetchNotifications();
    const interval = setInterval(() => {
      fetchOrders();
      fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/user');
      const data = await res.json();
      
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/user');
      const data = await res.json();
      
      if (res.ok && data.notifications.length > 0) {
        const latest = data.notifications[0];
        setNotification(latest.message);
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const submitRating = async () => {
    try {
      const res = await fetch('/api/orders/rate-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: ratingOrder, rating: selectedRating })
      });
      
      if (res.ok) {
        alert('Thank you for rating!');
        setRatingOrder(null);
        setSelectedRating(0);
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit rating');
      }
    } catch (err) {
      alert('Error submitting rating');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock />;
      case 'accepted': return <FaCheckCircle />;
      case 'in-progress': return <FaShoppingBag />;
      case 'delivering': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      default: return <FaClock />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Waiting for vendor';
      case 'accepted': return 'Vendor accepted';
      case 'in-progress': return 'Vendor shopping';
      case 'delivering': return 'Out for delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="track-container">
      {notification && (
        <div className="track-notification">
          {notification}
        </div>
      )}
      <div className="track-header">
        <FaArrowLeft onClick={() => router.back()} style={{ cursor: 'pointer' }} />
        <h1>My Orders</h1>
      </div>

      <div className="track-orders">
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders yet</p>
            <button onClick={() => router.push('/home')}>Start Shopping</button>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="track-card">
              <div className="track-status-bar">
                <div className={`status-step ${['pending', 'accepted', 'in-progress', 'delivering', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                  <FaClock />
                  <span>Pending</span>
                </div>
                <div className={`status-step ${['accepted', 'in-progress', 'delivering', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                  <FaCheckCircle />
                  <span>Accepted</span>
                </div>
                <div className={`status-step ${['in-progress', 'delivering', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                  <FaShoppingBag />
                  <span>Shopping</span>
                </div>
                <div className={`status-step ${['delivering', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                  <FaTruck />
                  <span>Delivering</span>
                </div>
                <div className={`status-step ${order.status === 'delivered' ? 'active' : ''}`}>
                  <FaCheckCircle />
                  <span>Delivered</span>
                </div>
              </div>

              <div className="track-details">
                <div className="track-info">
                  <p><strong>Order ID:</strong> {order._id.slice(-8)}</p>
                  <p><strong>Total:</strong> ₦{order.total?.toLocaleString()}</p>
                  <p><strong>Items:</strong> {order.items?.length}</p>
                  <p><strong>Status:</strong> {getStatusText(order.status)}</p>
                  <p className="track-time">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                {order.status === 'delivered' && !order.rated && (
                  <div className="rating-section">
                    <p>Rate your vendor:</p>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={`star ${selectedRating >= star && ratingOrder === order._id ? 'active' : ''}`}
                          onClick={() => {
                            setRatingOrder(order._id);
                            setSelectedRating(star);
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {ratingOrder === order._id && (
                      <button className="submit-rating" onClick={submitRating}>
                        Submit Rating
                      </button>
                    )}
                  </div>
                )}
                {order.rated && (
                  <p className="rated-text">✓ Rated: {order.vendorRating} stars</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
