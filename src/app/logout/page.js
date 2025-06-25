"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Remove any stored auth info (for demo, localStorage)
    localStorage.removeItem("user");
    // Redirect to login page after logout
    router.replace("/login");
  }, [router]);

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8, textAlign: "center" }}>
      <h2>Logging out...</h2>
    </div>
  );
}
