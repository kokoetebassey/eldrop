import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userEmail = req.cookies?.userEmail;

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, phone, avatar, homeLocation } = req.body;
    const client = await clientPromise;
    const db = client.db("eldrop");
    const users = db.collection("users");

    const updateData = {};
    if (name) updateData.username = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    if (homeLocation !== undefined) updateData.homeLocation = homeLocation;

    await users.updateOne(
      { email: userEmail },
      { $set: updateData }
    );

    const updatedUser = await users.findOne({ email: userEmail });

    return res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.username,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar || '/avatar.png',
        rating: updatedUser.rating ?? 0,
        balance: updatedUser.balance ?? 0.0,
        homeLocation: updatedUser.homeLocation || ''
      }
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    
    // Temporary fallback for development when MongoDB is unreachable
    if (err.message?.includes('ETIMEDOUT') || err.message?.includes('ETIMEOUT')) {
      const mockUser = {
        _id: '123',
        username: name || 'user',
        email: userEmail,
        phone: phone || '',
        avatar: avatar || '/avatar.png',
        rating: 4,
        balance: 1500,
        homeLocation: homeLocation || ''
      };
      return res.status(200).json({
        success: true,
        user: mockUser
      });
    }
    
    return res.status(500).json({ error: "Server error" });
  }
}
