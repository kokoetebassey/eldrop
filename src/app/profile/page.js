"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaUser, FaLock, FaMapMarkerAlt, FaEnvelope, FaGlobe, FaSignOutAlt, FaStar } from 'react-icons/fa';
import './profile.css';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      async function fetchUser() {
        try {
          const res = await fetch('/api/user');
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            localStorage.setItem('loggedInUser', JSON.stringify(data));
          } else {
            router.push('/login');
          }
        } catch (err) {
          router.push('/login');
        }
      }
      fetchUser();
    }
  }, [router]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatar = reader.result;
        try {
          const res = await fetch('/api/user/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar: newAvatar })
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data.user);
            localStorage.setItem('loggedInUser', JSON.stringify(data.user));
            alert('Avatar updated successfully!');
          }
        } catch (err) {
          alert('Error updating avatar');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <FaChevronLeft className="profile-back-icon" onClick={() => router.back()} />
        <p className="profile-header-text">Please update your profile to access every feature of this app</p>
      </div>

      <div className="profile-avatar-section">
        <div className="profile-avatar">
          <img src={user.avatar || '/avatar.png'} alt="Avatar" />
          <div className="profile-avatar-badge" onClick={() => fileInputRef.current?.click()}>+</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </div>
        <h2 className="profile-name">{user.name || user.username || 'Guest'}</h2>
        <div className="profile-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} color={i < (user.rating || 0) ? "#FFD700" : "#D9D9D9"} />
          ))}
          <span>{user.rating || 0} Rating</span>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-menu-item" onClick={() => router.push('/personal-information')}>
          <FaUser className="profile-icon" />
          <span>Personal Information</span>
        </div>
        <div className="profile-menu-item" onClick={() => router.push('/login-security')}>
          <FaLock className="profile-icon" />
          <span>Login & Security</span>
        </div>
      </div>

      <div className="profile-section">
        <h3 className="profile-section-title">Saved places</h3>
        <div className="profile-menu-item" onClick={() => router.push('/home-location')}>
          <FaMapMarkerAlt className="profile-icon" />
          <span>Enter Home Location</span>
        </div>
        <div className="profile-menu-item">
          <FaEnvelope className="profile-icon" />
          <span>Enter Alternate Address</span>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-menu-item">
          <FaGlobe className="profile-icon" />
          <span>Language</span>
        </div>
        <div className="profile-menu-item">
          <FaSignOutAlt className="profile-icon" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
