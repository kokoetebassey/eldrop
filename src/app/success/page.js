"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../getstarted/getstarted.module.css";








export default function SuccessPage() {
  const router = useRouter();
  const handleContinue = () => {
    router.push("/login");
  };


  return (
    <> 
    <div className={styles.successlogoCenter}>
    <div className={styles.successlogo}>
            <Image className={styles.successImage} src="/images/success.png" alt="Eldrop Logo" width={40} height={40} />
    </div>
    </div>
    <div className={styles.centresignbacksuccess} >
      <div className={styles.signcentersuccess}>
        <h2 className={styles.successtext}>Success</h2>
        <p style={{ color: "black", fontSize: 18, marginBottom: 32 }}>You have successfully signed up! Happy shopping!</p>
        <button className={styles.inputBtn} style={{ width: 180, fontSize: 18 }} onClick={handleContinue}>Continue</button>
      </div>
         <div className={styles.signuplogobottom}>
            <Image src="/images/signbottom.png" alt="Eldrop Logo" width={193} height={393} />
    </div>
    </div>
    </>
  );

}