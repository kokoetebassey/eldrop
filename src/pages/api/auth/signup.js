import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

function generateCode() {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit code
}

async function sendVerificationEmail(email, code) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Eldrop Verification Code",
    text: `Your verification code is: ${code}`,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const client = await clientPromise;
    const db = client.db("eldrop"); // use 'eldrop' database
    const users = db.collection("users");
    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateCode();
    await users.insertOne({ username, email, password: hashedPassword, verified: false, verificationCode });
    await sendVerificationEmail(email, verificationCode);
    return res.status(201).json({ message: "User registered successfully. Please check your email for the verification code." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
