'use client';

import { useState } from 'react';
import './DiscountPage.css';
import { FaChevronLeft} from 'react-icons/fa';
import { useRouter } from 'next/navigation';





export default function DiscountPage() {
  const router = useRouter();

  const [copiedCode, setCopiedCode] = useState(null);

  const promoCodes = [
    {
      id: 1,
      code: "WELCOME400",
      discount: "₦400",
      description: "Get ₦400 off on your first purchase",
      validUntil: "2025-12-31",
      category: "First Order",
      minOrder: "₦2,000"
    },
    {
      id: 2,
      code: "FREEDEL",
      discount: "Free Delivery",
      description: "Free delivery on orders above ₦5,000",
      validUntil: "2025-11-30",
      category: "Delivery",
      minOrder: "₦5,000"
    },
    {
      id: 3,
      code: "SAVE25",
      discount: "25%",
      description: "25% off on selected items",
      validUntil: "2025-10-31",
      category: "Shopping",
      minOrder: "₦3,000"
    },
    {
      id: 4,
      code: "NGN1000",
      discount: "₦1,000",
      description: "₦1,000 off on electronics",
      validUntil: "2025-09-30",
      category: "Electronics",
      minOrder: "₦10,000"
    }
  ];

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="discount-container">
                <FaChevronLeft className="profile-back-icon" onClick={() => router.back()} />
        
      <div className="discount-wrapper">
        {/* Header */}
        <div className="discount-header">
          <h1>Promo Codes</h1>
          <p>Enjoy exclusive discounts on your purchases and deliveries</p>
        </div>

        {/* Main Promo Card */}
        <div className="main-promo-card">
          <div className="promo-content">
            <div className="promo-info">
              <span className="discount-badge">Special Offer</span>
              <h2>Flat ₦400 Off</h2>
              <p className="promo-description">On minimum order of ₦2,000</p>
              <div className="fax-number">
                <span>Fax: 400</span>
              </div>
            </div>
            
            <div className="promo-code-section">
              <div className="promo-code-box">
                <div className="code-label">Use Code</div>
                <div className="promo-code">SAVE400</div>
                <button 
                  onClick={() => copyToClipboard('SAVE400')}
                  className="copy-button"
                >
                  {copiedCode === 'SAVE400' ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* All Promo Codes */}
        <div className="promo-grid">
          {promoCodes.map((promo) => (
            <div key={promo.id} className="promo-card">
              <div className="card-header">
                <span className="category-badge">{promo.category}</span>
                <span className="valid-until">Valid until {promo.validUntil}</span>
              </div>
              
              <div className="card-content">
                <div className="discount-amount">{promo.discount} OFF</div>
                <p className="card-description">
                  {promo.description}
                </p>
                <div className="min-order">
                  Min. order: {promo.minOrder}
                </div>
              </div>

              <div className="code-display">
                <div className="code-label-small">PROMO CODE</div>
                <div className="promo-code-small">
                  {promo.code}
                </div>
              </div>

              <button 
                onClick={() => copyToClipboard(promo.code)}
                className="use-code-button"
              >
                {copiedCode === promo.code ? 'Copied!' : 'Use This Code'}
              </button>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="coming-soon-section">
          <div className="coming-soon-card">
            <h3>Coming Soon</h3>
            <p className="coming-soon-description">
              More exciting offers and better control over your discounts are on the way!
            </p>
            <div className="coming-control-badge">
              <span>Coming Control Features</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h3>How to Use Promo Codes</h3>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <p>Copy the promo code</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <p>Apply at checkout</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <p>Enjoy your discount!</p>
            </div>
          </div>
        </div>

        {/* Naira Information */}
        <div className="currency-info">
          <p>All discounts are in Nigerian Naira (₦)</p>
        </div>
      </div>
    </div>
  );
}