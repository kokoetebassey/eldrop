'use client';
import { useRouter } from 'next/navigation';
import './faq.css';

export default function FAQ() {
  const router = useRouter();

  const faqs = [
    {
      question: "What is Eldrop?",
      answer: "Eldrop is a digital marketplace that connects local vendors with customers."
    },
    {
      question: "Can I cancel an order after it has been placed?",
      answer: "Yes, you can.\nYou can only cancel an order after it has been fulfilled by the vendor."
    },
    {
      question: "What happens if my order doesn't get delivered?",
      answer: "Please reach out to us, we will help rectify this."
    },
    {
      question: "Funded my account but has not reflected in my account?",
      answer: "Please reach out to us, we will help rectify this."
    },
    {
      question: "The item I ordered is not what I got?",
      answer: "We are sorry about this, kindly reach out to us with the packaging and we will investigate the matter and take appropriate actions. We will refund you or get you the item you ordered, all on our guarantee."
    }
  ];

  return (
    <div className="faq-container">
      <div className="faq-header">
        <button onClick={() => router.back()} className="back-button">
          ←
        </button>
        <h1>FAQ</h1>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
