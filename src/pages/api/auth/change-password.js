import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const userEmail = cookies.userEmail;

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const client = await clientPromise;
    const db = client.db("eldrop");
    const users = db.collection("users");

    const user = await users.findOne({ email: decodeURIComponent(userEmail) });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await users.updateOne(
      { email: decodeURIComponent(userEmail) },
      { $set: { password: hashedPassword } }
    );

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
