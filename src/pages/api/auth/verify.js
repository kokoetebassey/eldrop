import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }
  try {
    const client = await clientPromise;
    const db = client.db("eldrop");
    const users = db.collection("users");
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.verified) {
      return res.status(400).json({ error: "User already verified" });
    }
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    await users.updateOne({ email }, { $set: { verified: true }, $unset: { verificationCode: "" } });
    return res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
