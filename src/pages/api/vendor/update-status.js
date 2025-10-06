import clientPromise from "@/lib/mongodb";
import { parse } from 'cookie';
import { ObjectId } from 'mongodb';

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

    const { orderId, status } = req.body;

    const client = await clientPromise;
    const db = client.db("eldrop");
    const orders = db.collection("orders");
    const notifications = db.collection("notifications");

    const order = await orders.findOne({ _id: new ObjectId(orderId), vendorId: decodeURIComponent(userEmail) });

    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }

    await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );

    const statusMessages = {
      'in-progress': 'Your vendor is shopping for your items!',
      'delivering': 'Your order is out for delivery!',
      'delivered': 'Your order has been delivered!'
    };

    await notifications.insertOne({
      userEmail: order.userEmail,
      orderId: orderId,
      message: statusMessages[status] || `Order status updated to ${status}`,
      status: status,
      read: false,
      createdAt: new Date()
    });

    return res.status(200).json({ message: "Order status updated" });
  } catch (err) {
    console.error("UPDATE ORDER STATUS ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
