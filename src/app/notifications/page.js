"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaTrash } from 'react-icons/fa';
import './notifications.css';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      console.log('Notifications response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Notifications data:', data);
        setNotifications(data.notifications);
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        console.error('Failed to fetch notifications:', res.status);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
    setLoading(false);
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setNotifications(notifications.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <FaChevronLeft className="back-icon" onClick={() => router.back()} />
        <h1>Notifications</h1>
      </div>

      <div className="notifications-list">
        {loading ? (
          <p style={{textAlign:'center', padding:'20px'}}>Loading...</p>
        ) : notifications.length === 0 ? (
          <p style={{textAlign:'center', padding:'20px', color:'#999'}}>No notifications</p>
        ) : (
          notifications.map(notification => (
            <div key={notification._id} className="notification-item">
              <span className="notification-icon">{notification.icon || '🔔'}</span>
              <span className="notification-message">{notification.message}</span>
              <FaTrash 
                className="delete-icon" 
                onClick={() => deleteNotification(notification._id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
