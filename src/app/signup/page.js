"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../getstarted/getstarted.module.css";






export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", repeatPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.username, email: form.email, password: form.password })
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Account created! Redirecting to verification...");
      setTimeout(() => router.push(`/verify?email=${encodeURIComponent(form.email)}`), 1500);
    } else setError(data.error || "Signup failed");
  };

  return (
    
    <div className={styles.signback}>
    <div className={styles.centresignback}>
    <div className={styles.signuplogo}>
      <Image src="/images/sigupLog.png" alt="Eldrop Logo" width={204} height={335} />
    </div>

    <div className={styles.inputer}>


    <div className={styles.signcenter}>

      <h1>Create <br /> Account</h1>

      <form className={styles.centreIput} onSubmit={handleSubmit}>
        <input className={styles.signupInput} name="username" placeholder="Username" value={form.username} onChange={handleChange} required  />
        <hr className={styles.hr}/>
        <input className={styles.signupInput}  name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
                <hr className={styles.hr}/>
        <input className={styles.signupInput}  name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
        <hr className={styles.hr}/>
        <input className={styles.signupInput}  name="repeatPassword" type="password" placeholder="Repeat Password" value={form.repeatPassword} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
        <hr className={styles.hr}/>
        <button className={styles.inputBtn} type="submit">Sign Up</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p style={{ marginTop: 16, textAlign: "center", color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        Already have an account? <a href="/login" style={{ color: '#f3ad04', textDecoration: 'underline' }}>
      <Image src="/images/rightArrow.png" alt="Eldrop Logo" width={20} height={20} />
        </a>
      </p>
    </div>
    
    </div>
<div className={styles.signuplogobottom1}>
      <Image src="/images/signbottom.png" alt="Eldrop Logo" width={193} height={393} />
    </div>
    </div>
    </div>
  );
}
