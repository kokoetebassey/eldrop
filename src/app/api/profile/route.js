import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import clientPromise from '../../../lib/mongodb';

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, avatar } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  // Check if username is unique
  if (name) {
    const existingUser = await db.collection('users').findOne({ 
      name, 
      email: { $ne: session.user.email } 
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (avatar) updateData.avatar = avatar;

  await db.collection('users').updateOne(
    { email: session.user.email },
    { $set: updateData }
  );

  return NextResponse.json({ success: true });
}
