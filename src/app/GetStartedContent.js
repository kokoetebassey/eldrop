"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./getstarted/getstarted.module.css";

const slides = [
	{
		title: "Welcome to Eldrop",
		subtitle: "Get your food item delivered at your Doorstep",
		button: true,
	},
	{
		// title: "Fast & Secure",
		subtitle: "Fresh Food, Fast Delivery, Right to Your Door",
		button: false,
	},
	{
		// title: "Easy Shopping",
		subtitle: "Doorstep Delights Fresh Food Items, Just a Click Away",
		button: false,
	},
	{
		// title: "Join Our Community",
		subtitle: "Hassle-Free Grocery Delivery Straight to Your Door",
		button: false,
	},
];

export default function GetStartedContent() {
	const router = useRouter();
	const [current, setCurrent] = useState(0);
	const intervalRef = useRef();

	useEffect(() => {
		if (typeof window !== "undefined" && localStorage.getItem("user")) {
			router.replace("/login");
		}
	}, [router]);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setCurrent((prev) => (prev + 1) % slides.length);
		}, 3500);
		return () => clearInterval(intervalRef.current);
	}, []);

	const handleDotClick = (idx) => {
		setCurrent(idx);
		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setCurrent((prev) => (prev + 1) % slides.length);
		}, 3500);
	};

	return (
		<>
		<div className={styles.background}>
      <div className={styles.topLeftImage}> 
        <Image
           className={styles.topLeftImageMain}
          src="/images/eldroWhite.png"
          alt="Top Left Decoration"
          width={100}
          height={100}
         />  
      </div>
      <div className={styles.topLeftImage}> 
        <Image
           className={styles.topLeftLogo}
          src="/images/eldroplogo.png"
          alt="Top Left Decoration"
          width={100}
          height={100}
         />  
      </div>

			<div 
      // className={styles.blurOverlay} 
      />
			<div className={styles.centerContent}>
				
				<p className={styles.subtitle}>{slides[current].subtitle}</p>
				{current === slides.length - 1 && (
  <Link href="/signup" className={styles.getStartedBtn}>
    GET STARTED
  </Link>
)}
				<div
					className={styles.dotsContainer}
				>
					{slides.map((_, idx) => (
						<span
							key={idx}
							onClick={() => handleDotClick(idx)}
							style={{
								width: 12,
								height: 12,
								borderRadius: "50%",
								background: idx === current ? "#F3AD04" : "#fff",
								opacity: idx === current ? 1 : 0.5,
								cursor: "pointer",
								border: "1px solid #F3AD04",
								display: "inline-block",
								color: "#fff",
							}}
						/>
					))}
				</div>
				
			</div>


	
		</div>


<div className={styles.flexContainer}> 
	
	<div className={styles.bottomLeftImage}> 
        <Image
           className={styles.bottomyellow}
          src="/images/yellow.png"
          alt="bottm Left Decoration"
          width={100}
          height={100}
         />  
      </div>

	<div className={styles.bottomLeftImagegreen}> 
        <Image
           className={styles.bottomgreen}
          src="/images/green.svg"
          alt="bottom Left Decoration"
          width={200}
          height={300}
         />  
		 
      </div>
      </div>
		{/* </div> */}
		</>
	);
}
