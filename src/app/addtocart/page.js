"use client";

import React, { useState, useEffect } from 'react';
import { products } from '../products';
import { useCart } from '../CartContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './addtocart.module.css';
import SearchIcon from './SearchIcon';
import Carousel from './Carousel';
import { useRouter } from 'next/navigation';

export default function AddToCartPage() {
  const [search, setSearch] = useState('');
  const { cart, addToCart, notification } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) {
    return <div className={styles['addtocart-container']}>Loading...</div>;
  }

  return (
    <div className={styles['addtocart-container']}>
      {/* Notification */}
      {notification && (
        <div className={styles['addtocart-notification']}>
          {notification}
        </div>
      )}
      <div className={styles['addtocart-header-bg']}>
        <div className={styles['addtocart-header']}>
          {/* Menu Bar Icon */}
          <span role="img" aria-label="menu" className={styles['menu-icon']}>
            ☰
          </span>
          <div className={styles['cart-icon-container']}>
            <Link href="/cart" style={{ position: 'relative', marginRight: 16 }}>
              <span role="img" aria-label="cart" className={styles['cart-icon']} style={{ color: 'white' }}>🛒</span>
              {cart.length > 0 && (
                <span className={styles['cart-badge']}>
                  {cart.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className={styles['addtocart-search']}>
          <div className={styles['search-input-wrapper']}>
            <input
              type="text"
              placeholder="Search your food item..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles['addtocart-input']}
              style={{ background: '#fff' }}
            />
            <span className={styles['search-icon']}><SearchIcon /></span>
          </div>
        </div>
      </div>
      <div className={styles['addtocart-grid']}>
        {filtered.slice(0, 4).map(product => (
          <div key={product.id} className={styles['addtocart-card']}>
            <Image src="/topRight.png" alt="Top Right" width={32} height={32} className={styles['card-topright-img']} />
            <Image src={product.image} alt={product.name} width={100} height={100} className={styles['addtocart-image']} />
            <p className={styles['name-card']}>{product.name}</p>
            <p className={styles['addtocart-title']}>N{product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)} className={styles['addtocart-btn']}>
              Add to Cart
            </button>
            <Image src="/BottomLeft.png" alt="Bottom Left" width={32} height={32} className={styles['card-bottomleft-img']} />
          </div>
        ))}
      </div>
      <Carousel />
      <div className={styles['addtocart-grid']}>
        {filtered.slice(4).map(product => (
          <div key={product.id} className={styles['addtocart-card']}>
            <Image src="/topRight.png" alt="Top Right" width={32} height={32} className={styles['card-topright-img']} />
            <Image src={product.image} alt={product.name} width={100} height={100} className={styles['addtocart-image']} />
            <p className={styles['name-card']}>{product.name}</p>
            <p className={styles['addtocart-title']}>N{product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)} className={styles['addtocart-btn']}>
              Add to Cart
            </button>
            <Image src="/BottomLeft.png" alt="Bottom Left" width={32} height={32} className={styles['card-bottomleft-img']} />
          </div>
        ))}
        {filtered.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}
