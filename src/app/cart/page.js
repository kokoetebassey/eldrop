"use client";
import React from 'react';
import { useCart } from '../CartContext';
import Link from 'next/link';
import Image from 'next/image';
import './CartPage.css'; // Import the CSS file

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice, notification } = useCart();

  return (
    <div className="cartpage-container">
      {/* Navbar */}
      <div className="cartpage-navbar">
      <div className="cartpage-navbar_center">
        <Link href="/addtocart" className="cartpage-navbar-link">
          <span className="cartpage-navbar-arrow">&lt;</span>
          <span className="cartpage-navbar-text">Continue Shopping</span>
        </Link>
        <span className="cartpage-navbar-dots">⋯</span>
      </div>
      </div>
      {/* Notification */}
      {notification && (
        <div className="cartpage-notification">{notification}</div>
      )}
      <div className="cartpage-header">
     
        <h3>Subtotal</h3>
        <div>
          ${getTotalPrice().toFixed(2)}
        </div>
      </div>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cartpage-list">
          {cart.map(item => (
            <div key={item.id} className="cartpage-item">
              <Image src={item.image} alt={item.name} width={60} height={60} className="cartpage-item-img cartpage-item-img-border" />
              <div className="cartpage-item-details">
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <div className="cartpage">
                  <span >Quantity</span>
                </div>
                <div className="cartpage-item-qty">
                  <button
                    className="cartpage-qty-btn"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="cartpage-item-qty-input"
                  />
                  <button
                    className="cartpage-qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="cartpage-remove-btn">
                Remove
              </button>
            </div>
          ))}
          {/* <div className="cartpage-total">
            Total: ${getTotalPrice().toFixed(2)}
          </div> */}
        </div>
      )}
    </div>
  );
}


