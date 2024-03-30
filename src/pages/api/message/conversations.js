// src/pages/api/message/conversations.js

import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = req.query.userId; // Assuming the user's ID is passed as a query parameter

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId in query.' });
  }

  const { db } = await dbConnect();

  try {
    const conversations = await db.collection('conversations').find({
      $or: [
        { initiator: new ObjectId(userId) },
        { responder: new ObjectId(userId) }
      ]
    }).toArray();

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
