"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "../getstarted/getstarted.module.css";





export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputsRef = [useRef(), useRef(), useRef(), useRef(), useRef()];
  const router = useRouter();

  const handleCodeChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < 4) {
      inputsRef[idx + 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const codeStr = code.join("");
    if (codeStr.length !== 5) {
      setError("Please enter the 5-digit code.");
      return;
    }
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: codeStr })
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Verification successful! Redirecting...");
      setTimeout(() => router.push("/success"), 1500);
    } else setError(data.error || "Verification failed");
  };

  return (
     <div className={styles.centresignback}>
        <div className={styles.signuplogo}>
          <img src="/images/sigupLog.png" alt="Eldrop Logo" style={{ width: "204px", height: "335px" }} />
        </div>
        <div className={styles.inputer}>


    <div className={styles.signcenter}>
      <h1 className={styles.verifycenter}> Verification</h1>
      <h3 className={styles.textncenter}> A 5-digit code has been sent to your mail, please input to verify with your registered email.</h3>
      
      <form className={styles.centreIput} onSubmit={handleSubmit}>
        <input className={styles.signupInput} name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <hr className={styles.hr}/>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, justifyContent: "center" }}>
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={inputsRef[idx]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleCodeChange(idx, e.target.value)}
              style={{ width: 40, height: 40, textAlign: "center", fontSize: 24, border: "1px solid #ccc", borderRadius: 4, backgroundColor: '#fff', marginTop: '32px' }}
              required
            />
          ))}
        </div>
        <button className={styles.inputBtn} type="submit" style={{ width: "40%", padding: 8 }}>Verify</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
    
    </div>
     <div className={styles.signuplogobottom}>
      <img src="/images/signbottom.png" alt="Eldrop Logo" style={{  width: "193px", height: "393px" }} />
    </div>
    </div>
  );
}
