import clientPromise from "@/lib/mongodb";
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

    const { items, total, deliveryAddress } = req.body;

    const client = await clientPromise;
    const db = client.db("eldrop");
    const orders = db.collection("orders");

    const users = db.collection("users");
    const user = await users.findOne({ email: decodeURIComponent(userEmail) });

    const order = {
      userEmail: decodeURIComponent(userEmail),
      userName: user?.username || user?.name || 'Unknown',
      userPhone: user?.phone || 'Not provided',
      userAvatar: user?.avatar || '/avatar.png',
      items,
      total,
      deliveryAddress,
      status: "pending",
      vendorId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await orders.insertOne(order);

    return res.status(200).json({ 
      message: "Order created successfully",
      orderId: result.insertedId
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
