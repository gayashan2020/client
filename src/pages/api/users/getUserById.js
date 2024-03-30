// src/pages/api/users/getUserById.js

import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const {
    query: { userId },
    method,
  } = req;

  if (!userId) {
    return res.status(400).json({ message: 'User ID must be provided' });
  }

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const user = await req.db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Optionally, remove sensitive fields before sending the user object
        delete user.password;
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
