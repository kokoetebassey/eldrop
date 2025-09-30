import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    // Get email from cookie (you must set this cookie on login)
    const email = req.cookies?.userEmail;
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const client = await clientPromise;
    const db = client.db("eldrop");
    const users = db.collection("users");
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return user info (exclude password)
    return res.status(200).json({
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
    console.error("ME API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
