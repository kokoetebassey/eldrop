"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./addtocart.module.css";

const carouselData = [
  {
    image: "/pizza.svg",
    name: "Special Pizza",
    price: 2500,
    description: "Delicious cheesy pizza with fresh toppings."
  },
  {
    image: "/pizza.svg",
    name: "Burger Deluxe",
    price: 1800,
    description: "Juicy beef burger with crispy fries."
  },

];


//   {
//     image: "/carousel3.png",
//     name: "Chicken Shawarma",
//     price: 1200,
//     description: "Spicy chicken shawarma with veggies."
//   },
//   {
//     image: "/carousel4.png",
//     name: "Ice Cream Sundae",
//     price: 900,
//     description: "Creamy sundae with chocolate syrup."
//   }

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % carouselData.length), 15000);
    return () => clearInterval(timer);
  }, [current]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 50) {
        // swipe left
        setCurrent((c) => (c + 1) % carouselData.length);
      } else if (diff < -50) {
        // swipe right
        setCurrent((c) => (c - 1 + carouselData.length) % carouselData.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const item = carouselData[current];

  return (
    <div className={styles.carouselCardWrapper}>
      <div
        className={styles.carouselCard}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
      
        
        <div className={styles.carouselCardContentFlex}>
       
        <div className={styles.carouselCardContent}>
          <h3 className={styles.carouselCardTitle}>{item.name}</h3>
          <p className={styles.carouselCardDesc}>{item.description}</p>
          <p className={styles.carouselCardPrice}>N{item.price.toFixed(2)}</p>
 <Image src="/BottomLeft.png" alt="Bottom Left" width={32} height={32} className={styles['carousel-bottomleft-img']} />

        </div>
          <div className={styles.carouselImageStack}>
            <Image src="/pizza-background.svg" alt="Bottom Left" width={320} height={320} className={styles['carousel-pizzbackground-img']} />    
            <Image src={item.image} alt={item.name} width={420} height={420} className={styles.carouselImage} />
          </div>
          <div>
          <button className={styles.carouselOrderBtn}>Order Now</button>
          </div>
        </div>
      
      </div>
     <div className={styles.carouselDots}>
        {carouselData.map((_, idx) => (
          <span
            key={idx}
            className={idx === current ? styles.carouselDotActive : styles.carouselDot}
          />
        ))}
      </div>
      
    </div>
  );
}
