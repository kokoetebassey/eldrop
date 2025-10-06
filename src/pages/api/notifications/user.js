import clientPromise from "@/lib/mongodb";
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const userEmail = cookies.userEmail;

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db("eldrop");
    const notifications = db.collection("notifications");

    const userNotifications = await notifications
      .find({ userEmail: decodeURIComponent(userEmail), read: false })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ notifications: userNotifications });
  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
