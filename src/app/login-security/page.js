"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaLock, FaKey } from 'react-icons/fa';
import './login-security.css';

export default function LoginSecurityPage() {
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      alert('Please fill all fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: passwords.old, newPassword: passwords.new })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Password changed successfully!');
        setPasswords({ old: '', new: '', confirm: '' });
        setShowPasswordForm(false);
      } else {
        alert(data.error || 'Failed to change password');
      }
    } catch (err) {
      alert('Error changing password');
    }
  };

  const handleForgotPassword = async () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const email = user.email;

    if (!email) {
      alert('Please login first');
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Password reset link sent to your email');
      } else {
        alert(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      alert('Error sending reset email');
    }
  };

  return (
    <div className="login-security-container">
      <div className="login-security-header">
        <FaChevronLeft className="login-security-back" onClick={() => router.back()} />
        <h2>Login & security</h2>
      </div>

      <div className="login-security-content">
        <div className="login-security-section">
          <h3>Two-factor authentication</h3>
          <div className="login-security-item">
            <FaLock className="login-security-icon" />
            <span>Google authenticator</span>
          </div>
        </div>

        <div className="login-security-section">
          <h3>Password management</h3>
          <div className="login-security-item" onClick={() => setShowPasswordForm(!showPasswordForm)}>
            <FaKey className="login-security-icon" />
            <span>Change password</span>
          </div>

          {showPasswordForm && (
            <div className="login-security-password-form">
              <input
                type="password"
                name="old"
                placeholder="Old password"
                value={passwords.old}
                onChange={handleChange}
              />
              <input
                type="password"
                name="new"
                placeholder="New password"
                value={passwords.new}
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={handleChange}
              />
              <button onClick={handleChangePassword} className="login-security-change-btn">
                Change
              </button>
            </div>
          )}
        </div>

        <div className="login-security-forgot">
          <p>Forget Password?</p>
          <button onClick={handleForgotPassword} className="login-security-reset-btn">Reset</button>
        </div>
      </div>
    </div>
  );
}
