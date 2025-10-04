"use client";

import React, { useState, useEffect } from 'react';
import { products } from '../products';
import { useCart } from '../CartContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../addtocart/addtocart.module.css';
import SearchIcon from '../addtocart/SearchIcon';
import Carousel from '../addtocart/Carousel';
import { useRouter } from 'next/navigation';
import { FaWallet, FaGift, FaClipboardList, FaBell, FaQuestionCircle, FaSignOutAlt, FaTrash, FaStar, FaChevronRight, FaUser } from "react-icons/fa";

export default function AddToCartPage() {
  const [search, setSearch] = useState('');
  const { cart, addToCart, notification } = useCart();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    console.log('loggedInUser from localStorage:', loggedInUser);
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      console.log('Parsed user data:', userData);
      setUser(userData);
      setLoading(false);
    } else {
      async function fetchUser() {
        setLoading(true);
        setError("");
        try {
          const res = await fetch("/api/user");
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            localStorage.setItem('loggedInUser', JSON.stringify(data));
          } else {
            setError("Not logged in");
          }
        } catch (err) {
          setError("Error loading user");
        }
        setLoading(false);
      }
      fetchUser();
    }
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <div className={styles['addtocart-container']}>
      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} >
            <div className={styles.modalProfile}>
              <img src={user?.avatar || "/avatar.png"} alt="Avatar" className={styles.avatar} />
              <div>
                <h1 className={styles.userName_modal}>
                  {loading
                    ? "Loading..."
                    : error
                      ? error
                      : user
                        ? user.name || user.username || "Guest"
                        : "Guest"}
                        <span className={styles.myAccount}>my Account</span>
                </h1>
                <div className={styles.flex_image_text}>
                  <div className={styles.userRating}>
                    {user && !loading
                      ? [...Array(5)].map((_, i) => (
                          <FaStar key={i} color={i < (user.rating ?? 0) ? "#FFD700" : "#D9D9D9"} />
                        ))
                      : null}
                    {user && !loading
                      ? (typeof user.rating === "number" ? user.rating : 0)
                      : null} 
                  </div>
                  <div className={styles.userBalance}>
                    Balance: <b>
                      {user && !loading
                        ? `₦${typeof user.balance === "number" ? user.balance.toLocaleString() : "0"}1500`
                        : ""}
                    </b>
                  </div>
                </div>
              </div>
            </div>


            



            <div className={styles.modalMenu}>
              <div className={styles.menuItem} style={{display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}} onClick={() => router.push('/profile')}><span><FaUser /> Profile</span> <FaChevronRight /></div>
              {/* <div className={styles.menuItem} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><span><FaWallet /> Wallet</span> <FaChevronRight /></div> */}
             < hr style={{ borderColor: '#D9D9D9', with: '100px'}} />
              <div className={styles.menuItem} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}   onClick={() => router.push('/discount')}><span><FaGift /> Promo Codes</span> <FaChevronRight /></div>
             < hr style={{ borderColor: '#D9D9D9', with: '100px'}} />
              <div className={styles.menuItem} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}  onClick={() => router.push('/cart')}><span><FaClipboardList /> Orders</span> <FaChevronRight /></div>
             < hr style={{ borderColor: '#D9D9D9', with: '100px'}} />
              <div className={styles.menuItem} style={{display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}} onClick={() => router.push('/notifications')}><span><FaBell /> Notification</span> <FaChevronRight /></div>
             < hr style={{ borderColor: '#D9D9D9', with: '100px'}} />
              <div className={styles.menuItem} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} onClick={() => router.push('/faq')}><span><FaQuestionCircle /> FAQ</span> <FaChevronRight /></div>
             < hr style={{ borderColor: '#D9D9D9', with: '100px'}} />
              <div className={styles.menuItem} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><span><FaSignOutAlt /> Logout</span> <FaChevronRight /></div>
             < hr style={{ borderColor: '#D9D9D9', with: '100px'}} />
              {/* <div className={styles.menuItemDanger} style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap: '87px', whiteSpace: 'nowrap'}}><span><FaTrash /> Delete Account</span> <FaChevronRight /></div> */}
            </div>


            <div className={styles.modalProfile_vendur}>
            <div className={styles.vendur_text}>
                    <h2>Become a vendor</h2>
                    <p>Earn commissions by helping customers shop for food items in the market.</p>
                    
          </div>
          </div>
          </div>


          
        </div>
      )}
      {/* Notification */}
      {notification && (
        <div className={styles['addtocart-notification']}>
          {notification}
        </div>
      )}
      <div className={styles['addtocart-header-bg']}>
        <div className={styles['addtocart-header']}>
          {/* Menu Bar Icon */}
          <span
            role="img"
            aria-label="menu"
            className={styles['menu-icon']}
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer" }}
          >
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
           
           {/* add under image here */}
           
            <Image src={product.image} alt={product.name} width={100} height={100} className={styles['addtocart-image']} />
            <p className={styles['name-card']}>{product.name}</p>
            <p className={styles['addtocart-title']}>₦{product.price.toFixed(2)}</p>
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
            <p className={styles['addtocart-title']}>₦{product.price.toFixed(2)}</p>
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
// No changes needed for login error in this file.