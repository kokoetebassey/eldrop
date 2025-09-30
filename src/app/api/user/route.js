import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import clientPromise from '../../../../lib/mongodb';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({}, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection('users').findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json({
    name: user.name,
    avatar: user.avatar || '/avatar.png',
    rating: user.rating || 0,
    balance: user.balance || 0
  });
}

