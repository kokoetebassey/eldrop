"use client";
import styles from "../getstarted/getstarted.module.css";

export default function HomePage() {
  return (
    <div className={styles.centerContent} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ color: "#f3ad04", fontSize: 36, marginBottom: 24 }}>Welcome to Eldrop!</h1>
      <p style={{ color: "#fff", fontSize: 20, marginBottom: 32 }}>You are now logged in. Start exploring our features and shop with ease.</p>
      <a href="/logout" className={styles.getStartedBtn} style={{ width: 180, fontSize: 18, textAlign: "center" }}>Logout</a>
    </div>
  );
}
