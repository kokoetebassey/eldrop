"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../getstarted/getstarted.module.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Invalid reset link');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();

      if (res.ok) {
        alert('Password reset successfully!');
        router.push('/login');
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Error resetting password');
    }
  };

  return (
    <div className={styles.signback}>
      <div className={styles.centresignback}>
        <div className={styles.inputer}>
          <div className={styles.signcenter}>
            <h1>Reset Password</h1>
            <form className={styles.centreIput} onSubmit={handleSubmit}>
              <input
                className={styles.signupInput}
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", marginBottom: 8 }}
              />
              <hr className={styles.hr} />
              <input
                className={styles.signupInput}
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: "100%", marginBottom: 8 }}
              />
              <hr className={styles.hr} />
              <button
                className={styles.inputBtn}
                type="submit"
                style={{ width: "100%", padding: 8 }}
              >
                Reset Password
              </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
