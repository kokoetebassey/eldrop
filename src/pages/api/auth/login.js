import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const client = await clientPromise;
    const db = client.db("eldrop");
    const users = db.collection("users");
    const user = await users.findOne({ email });
    if (!user) {
      console.warn("LOGIN: User not found for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("LOGIN: Password mismatch for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Set cookie for userEmail (expires in 7 days, HttpOnly)
    res.setHeader("Set-Cookie", `userEmail=${encodeURIComponent(email)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; HttpOnly`);
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        rating: user.rating ?? 0,
        balance: user.balance ?? 0.0,
        verified: user.verified ?? false
      }
    });
  } catch (err) {
    console.error("LOGIN API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

