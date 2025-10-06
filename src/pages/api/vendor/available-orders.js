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
    const orders = db.collection("orders");
    const users = db.collection("users");

    const availableOrders = await orders
      .find({ status: "pending", vendorId: null })
      .sort({ createdAt: -1 })
      .toArray();

    for (let order of availableOrders) {
      if (!order.userName || !order.userPhone) {
        const user = await users.findOne({ email: order.userEmail });
        order.userName = user?.username || user?.name || 'Unknown';
        order.userPhone = user?.phone || 'Not provided';
        order.userAvatar = user?.avatar || '/avatar.png';
      }
    }

    return res.status(200).json({ orders: availableOrders });
  } catch (err) {
    console.error("GET AVAILABLE ORDERS ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
