"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import './personal-information.css';

export default function PersonalInformationPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData);
      setForm({
        name: userData.name || userData.username || '',
        phone: userData.phone || '',
        email: userData.email || ''
      });
    }
  }, []);

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
          }
        } catch (err) {
          alert('Error updating avatar');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (field) => {
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: form[field] })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('loggedInUser', JSON.stringify(data.user));
        alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      } else {
        alert('Failed to update');
      }
    } catch (err) {
      alert('Error updating');
    }
  };

  if (!user) return <div className="personal-info-loading">Loading...</div>;

  return (
    <div className="personal-info-container">
      <div className="personal-info-header">
        <FaChevronLeft className="personal-info-back" onClick={() => router.back()} />
        <h2>Personal Information</h2>
      </div>

      <div className="personal-info-avatar-section">
        <div className="personal-info-avatar">
          <img src={user.avatar || '/avatar.png'} alt="Avatar" />
          <div className="personal-info-avatar-badge" onClick={() => fileInputRef.current?.click()}>+</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </div>
        <p className="personal-info-subtitle">Add your photo so that vendors can recognize you</p>
      </div>

      <div className="personal-info-form">
        <div className="personal-info-field">
          <FaUser className="personal-info-icon" />
          <div className="personal-info-input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <button onClick={() => handleSave('name')} className="personal-info-edit-btn">ConFirm</button>
        </div>

        <div className="personal-info-field">
          <FaPhone className="personal-info-icon" />
          <div className="personal-info-input-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <button onClick={() => handleSave('phone')} className="personal-info-edit-btn">ConFirm</button>
        </div>

        <div className="personal-info-field">
          <FaEnvelope className="personal-info-icon" />
          <div className="personal-info-input-group">
            <label>Mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <button className="personal-info-edit-btn" disabled></button>
        </div>
      </div>
    </div>
  );
}
