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

    const { orderId } = req.body;

    const client = await clientPromise;
    const db = client.db("eldrop");
    const orders = db.collection("orders");
    const notifications = db.collection("notifications");

    const order = await orders.findOne({ _id: new ObjectId(orderId), status: "pending", vendorId: null });

    if (!order) {
      return res.status(400).json({ error: "Order not available" });
    }

    await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          vendorId: decodeURIComponent(userEmail),
          status: "accepted",
          acceptedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    await notifications.insertOne({
      userEmail: order.userEmail,
      orderId: orderId,
      message: "Your order has been accepted by a vendor!",
      status: "accepted",
      read: false,
      createdAt: new Date()
    });

    return res.status(200).json({ message: "Order accepted successfully" });
  } catch (err) {
    console.error("ACCEPT ORDER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
