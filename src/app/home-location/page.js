"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaMapMarkerAlt, FaSave } from 'react-icons/fa';
import './home-location.css';

export default function HomeLocationPage() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setLocation(data.user.homeLocation || '');
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/login');
      }
    }
    fetchUser();
  }, [router]);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeLocation: location })
      });
      if (res.ok) {
        alert('Home location saved successfully!');
        router.back();
      } else {
        const data = await res.json();
        alert(data.error || 'Error saving location');
      }
    } catch (err) {
      alert('Error saving location');
    }
  };

  return (
    <div className="home-location-container">
      <div className="home-location-header">
        <FaChevronLeft className="back-icon" onClick={() => router.back()} />
        <h1>Home Location</h1>
      </div>

      <div className="location-content">
        <p className="location-description">
          Enter your home address to get personalized recommendations
        </p>

        <div className="location-input-wrapper">
          <FaMapMarkerAlt className="input-icon" />
          <input
            type="text"
            className="location-input"
            placeholder="Enter your home address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button className="save-button" onClick={handleSave}>
          <FaSave /> Save Location
        </button>
      </div>
    </div>
  );
}
