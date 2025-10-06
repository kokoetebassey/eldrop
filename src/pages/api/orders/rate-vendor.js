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

    const { orderId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const client = await clientPromise;
    const db = client.db("eldrop");
    const orders = db.collection("orders");
    const users = db.collection("users");

    const order = await orders.findOne({ 
      _id: new ObjectId(orderId), 
      userEmail: decodeURIComponent(userEmail),
      status: "delivered"
    });

    if (!order) {
      return res.status(400).json({ error: "Order not found or not delivered" });
    }

    if (order.rated) {
      return res.status(400).json({ error: "Order already rated" });
    }

    await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { rated: true, vendorRating: rating } }
    );

    const vendor = await users.findOne({ email: order.vendorId });
    const currentRating = vendor?.rating || 0;
    const totalRatings = vendor?.totalRatings || 0;
    const newTotalRatings = totalRatings + 1;
    const newRating = ((currentRating * totalRatings) + rating) / newTotalRatings;

    await users.updateOne(
      { email: order.vendorId },
      { $set: { rating: Math.round(newRating * 10) / 10, totalRatings: newTotalRatings } }
    );

    return res.status(200).json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("RATE VENDOR ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
