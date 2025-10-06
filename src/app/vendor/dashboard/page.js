"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaShoppingBag, FaClock } from 'react-icons/fa';
import './vendor.css';

export default function VendorDashboard() {
  const router = useRouter();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'available' 
        ? '/api/vendor/available-orders' 
        : '/api/vendor/my-orders';
      
      const res = await fetch(endpoint);
      const data = await res.json();
      
      if (res.ok) {
        if (activeTab === 'available') {
          setAvailableOrders(data.orders);
        } else {
          setMyOrders(data.orders);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  const acceptOrder = async (orderId) => {
    try {
      const res = await fetch('/api/vendor/accept-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      
      if (res.ok) {
        alert('Order accepted!');
        fetchOrders();
      } else {
        alert('Failed to accept order');
      }
    } catch (err) {
      alert('Error accepting order');
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch('/api/vendor/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      });
      
      if (res.ok) {
        alert('Status updated!');
        fetchOrders();
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const orders = activeTab === 'available' ? availableOrders : myOrders;

  return (
    <div className="vendor-container">
      <div className="vendor-header">
        <FaArrowLeft onClick={() => router.back()} style={{ cursor: 'pointer' }} />
        <h1>Vendor Dashboard</h1>
      </div>

      <div className="vendor-tabs">
        <button 
          className={activeTab === 'available' ? 'active' : ''} 
          onClick={() => setActiveTab('available')}
        >
          Available Orders
        </button>
        <button 
          className={activeTab === 'myorders' ? 'active' : ''} 
          onClick={() => setActiveTab('myorders')}
        >
          My Orders
        </button>
      </div>

      <div className="vendor-orders">
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <FaShoppingBag />
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>
              
              <div className="customer-info">
                <img src={order.userAvatar || '/avatar.png'} alt="Customer" className="customer-avatar" />
                <div>
                  <p><strong>{order.userName}</strong></p>
                  <p>📞 {order.userPhone}</p>
                </div>
              </div>

              <div className="order-details">
                <p><strong>Total:</strong> ₦{order.total?.toLocaleString()}</p>
                <p><strong>Address:</strong> {order.deliveryAddress}</p>
                <p className="order-time">
                  <FaClock /> {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="order-items">
                <p><strong>Items ({order.items?.length}):</strong></p>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>
                    <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {activeTab === 'available' && (
                <button 
                  className="accept-btn" 
                  onClick={() => acceptOrder(order._id)}
                >
                  Accept Order
                </button>
              )}
              
              {activeTab === 'myorders' && order.status === 'accepted' && (
                <button 
                  className="status-btn" 
                  onClick={() => updateStatus(order._id, 'in-progress')}
                >
                  Start Shopping
                </button>
              )}
              
              {activeTab === 'myorders' && order.status === 'in-progress' && (
                <button 
                  className="status-btn" 
                  onClick={() => updateStatus(order._id, 'delivering')}
                >
                  Out for Delivery
                </button>
              )}
              
              {activeTab === 'myorders' && order.status === 'delivering' && (
                <button 
                  className="status-btn delivered" 
                  onClick={() => updateStatus(order._id, 'delivered')}
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
