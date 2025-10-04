"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../getstarted/getstarted.module.css";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.push("/home");
      }, 1200); // 1.2s delay for user to see success
      return () => clearTimeout(timeout);
    }
  }, [success, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log('Login response:', data);
    if (res.ok) {
      console.log('Saving user to localStorage:', data.user);
      localStorage.setItem('loggedInUser', JSON.stringify(data.user));
      setSuccess("Login successful!");
      setTimeout(() => router.push("/home"), 1000);
    } else setError(data.error || "Login failed");
  };

  return (
    <div className={styles.signback}>
      <div className={styles.centresignback}>
        <div className={styles.signuplogo}>
          <Image
            src="https://ik.imagekit.io/4f4lpmjjy/public/images/sigupLog.png?updatedAt=1751890900634"
            alt="Eldrop Logo"
            width={204}
            height={335}
          />
        </div>

        <div className={styles.inputer}>
          <div className={styles.signcenter}>
            <h1>Login</h1>
            <form className={styles.centreIput} onSubmit={handleSubmit}>
              <input
                className={styles.signupInput}
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ width: "100%", marginBottom: 8 }}
              />
              <hr className={styles.hr} />
              <input
                className={styles.signupInput}
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ width: "100%", marginBottom: 8 }}
              />
              <hr className={styles.hr} />
              <button
                className={styles.inputBtn}
                type="submit"
                style={{ width: "100%", padding: 8 }}
              >
                Login
              </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <p
              style={{
                marginTop: 16,
                textAlign: "center",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                style={{
                  color: "#f3ad04",
                  textDecoration: "underline",
                }}
              >
                <Image
                  src="https://ik.imagekit.io/4f4lpmjjy/public/images/rightArrow.png?updatedAt=1751890900602"
                  alt="Eldrop Logo"
                  width={20}
                  height={20}
                />
              </a>
            </p>
          </div>
        </div>
        <div className={styles.signuplogobottom}>
          <Image
            src="https://ik.imagekit.io/4f4lpmjjy/public/images/signbottom.png?updatedAt=1751890900596"
            alt="Eldrop Logo"
            width={193}
            height={393}
          />
        </div>
      </div>
    </div>
  );
}
