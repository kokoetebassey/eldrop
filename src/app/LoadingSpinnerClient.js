"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./getstarted/getstarted.module.css";

export default function LoadingSpinnerClient() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 600); // fake delay for demo
    return () => clearTimeout(timeout);
  }, [pathname]);

  return loading ? (
    <div className={styles["global-spinner-overlay"]}>
      <div className={styles["global-spinner"]} />
    </div>
  ) : null;
}
