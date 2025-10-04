"use client";
import { useCart } from '../CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PaystackButton } from 'react-paystack';
import { useState, useEffect } from 'react';
import './OrderSummary.css';

export default function OrderSummaryPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const deliveryCost = 500;
  const publicKey = 'pk_test_456c484d3d9fe11a849a2f54c9033335dd0dc10b'; // Replace with your Paystack public key
  const amount = (getTotalPrice() + deliveryCost) * 100; // Paystack expects amount in kobo

  useEffect(() => {
    setMounted(true);
    async function fetchUser() {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser({ email: 'guest@eldrop.com' });
        }
      } catch (err) {
        setUser({ email: 'guest@eldrop.com' });
      }
    }
    fetchUser();
  }, []);

  if (!mounted || !user) {
    return <div className="order-summary-container">Loading...</div>;
  }

  const componentProps = {
    email: user.email,
    amount,
    publicKey,
    text: 'Process Order',
    onSuccess: () => {
      clearCart();
      alert('Payment successful! Order processed.');
      router.push('/home');
    },
    onClose: () => alert('Payment cancelled'),
  };

  if (cart.length === 0) {
    return (
      <div className="order-summary-container">
        <div className="order-summary-navbar">
          <Link href="/cart" className="order-summary-navbar-link">
            <span className="order-summary-navbar-arrow">&lt;</span>
            <span className="order-summary-navbar-text">Back to Cart</span>
          </Link>
        </div>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="order-summary-container">
      <div className="order-summary-navbar">
        <Link href="/cart" className="order-summary-navbar-link">
          <span className="order-summary-navbar-arrow">&lt;</span>
          <span className="order-summary-navbar-text">Back to Cart</span>
        </Link>
      </div>
      
      <h2 className="order-summary-title">Order Summary</h2>

      <div className="order-summary-details">
        <div className="order-summary-row">
          <span>Total Estimated Cost of Items:</span>
          <span>₦{getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="order-summary-row">
          <span>Estimated Delivery Cost:</span>
          <span>₦{deliveryCost.toFixed(2)}</span>
        </div>
        <hr className="order-summary-divider" />
        <div className="order-summary-row order-summary-total">
          <span>Total Payment:</span>
          <span>₦{(getTotalPrice() + deliveryCost).toFixed(2)}</span>
        </div>
      </div>

      <div className="order-summary-action">
        <PaystackButton {...componentProps} className="order-summary-btn" />
      </div>
    </div>
  );
}
