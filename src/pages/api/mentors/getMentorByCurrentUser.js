import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const { db } = await dbConnect();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming user document contains mentorId field
    const { mentorId } = user;

    if (!mentorId) {
      return res.status(400).json({ message: 'No mentor assigned to this user.' });
    }

    const mentor = await db.collection('users').findOne({ _id: new ObjectId(mentorId) });

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Remove sensitive information
    delete mentor.password;

    return res.status(200).json(mentor);
  } catch (error) {
    console.error('Error fetching mentor by currentUser:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
