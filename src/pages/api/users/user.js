// pages/api/user.js

import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method === 'GET') {
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

      // Don't send the password to the client
      delete user.password;

      return res.status(200).json(user);
    } catch (err) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}