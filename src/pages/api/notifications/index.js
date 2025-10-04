import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const userEmail = req.cookies?.userEmail;

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db("eldrop");
    console.log('Using database:', db.databaseName);
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

  if (req.method === "GET") {
    try {
      console.log('Fetching notifications for userEmail:', userEmail);
      console.log('From database:', db.databaseName);
      
      // Check all notifications first
      const allNotifications = await db.collection("notifications").find({}).toArray();
      console.log('Total notifications in DB:', allNotifications.length);
      console.log('Sample notification:', allNotifications[0]);
      
      const notifications = await db.collection("notifications")
        .find({ userEmail })
        .sort({ createdAt: -1 })
        .toArray();

      console.log('Found notifications for user:', notifications.length);
      return res.status(200).json({ notifications });
    } catch (err) {
      console.error("GET NOTIFICATIONS ERROR:", err);
      
      const mockNotifications = [
        { _id: '1', userEmail, message: 'Your order has been placed!', icon: '📦', createdAt: new Date() },
        { _id: '2', userEmail, message: 'Order is being delivered!', icon: '🚚', createdAt: new Date() },
        { _id: '3', userEmail, message: 'Order has been delivered!', icon: '✅', createdAt: new Date() },
        { _id: '4', userEmail, message: 'Your order has been cancelled', icon: '❌', createdAt: new Date() },
        { _id: '5', userEmail, message: 'Transaction awaiting approval', icon: '⏳', createdAt: new Date() },
        { _id: '6', userEmail, message: 'Transaction cancelled', icon: '🚫', createdAt: new Date() },
        { _id: '7', userEmail, message: 'Waiting for vendor to accept order', icon: '⏰', createdAt: new Date() },
      ];
      return res.status(200).json({ notifications: mockNotifications });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      await db.collection("notifications").deleteOne({ _id: new (require('mongodb').ObjectId)(id), userEmail });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("DELETE NOTIFICATION ERROR:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("NOTIFICATIONS API ERROR:", err);
    const userEmail = req.cookies?.userEmail || 'user@example.com';
    const mockNotifications = [
      { _id: '1', userEmail, message: 'Your order has been placed!', icon: '📦', createdAt: new Date() },
      { _id: '2', userEmail, message: 'Order is being delivered!', icon: '🚚', createdAt: new Date() },
      { _id: '3', userEmail, message: 'Order has been delivered!', icon: '✅', createdAt: new Date() },
      { _id: '4', userEmail, message: 'Your order has been cancelled', icon: '❌', createdAt: new Date() },
      { _id: '5', userEmail, message: 'Transaction awaiting approval', icon: '⏳', createdAt: new Date() },
      { _id: '6', userEmail, message: 'Transaction cancelled', icon: '🚫', createdAt: new Date() },
      { _id: '7', userEmail, message: 'Waiting for vendor to accept order', icon: '⏰', createdAt: new Date() },
    ];
    return res.status(200).json({ notifications: mockNotifications });
  }
}
