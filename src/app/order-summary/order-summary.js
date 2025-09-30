import Head from "next/head";
import Image from "next/image";
import styles from "./order-summary.module.css";



export default function OrderSummary() {
  return (
    <>
      <Head>
        <title>Order Summary</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src="/bike.png" // replace with your own image in /public folder
            alt="Delivery Rider"
            layout="responsive"
            width={400}
            height={250}
            className={styles.image}
          />
        </div>

        <div className={styles.warningBox}>
          <p>
            Please note that prices of market goods are always changing, so the
            prices on your app order items does not represent final market
            prices. We will always confirm with you the final pricing.
          </p>
        </div>

        <div className={styles.summaryCard}>
          <h3>Order Summary</h3>
          <div className={styles.row}>
            <span>Total Estimated cost of items</span>
            <span>₦ 150,000</span>
          </div>
          <div className={styles.row}>
            <span>Estimated delivery cost</span>
            <span>₦ 5,000</span>
          </div>
          <hr />
          <div className={`${styles.row} ${styles.totalRow}`}>
            <span>Total Payment</span>
            <span>₦ 160,000</span>
          </div>
          <button className={styles.processBtn}>Process Order</button>
        </div>
      </div>
    </>
  );
}
