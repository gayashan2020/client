import dbConnect from '../../lib/dbConnect';
import { comparePasswords, generateToken } from '../../lib/auth';
import jwt from 'jsonwebtoken';
import cookie from 'cookie'; // Ensure you have this package for setting cookies

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Login functionality remains unchanged
    const { db } = await dbConnect();
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });

    if (user && await comparePasswords(password, user.password)) {
      if (user.approval) {
        const token = generateToken(user);
        res.status(200).json({ token });
      } else {
        res.status(403).json({ message: 'Approval has not been given by admin' });
      }
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } else if (req.method === 'GET') {
    // Handle GET requests
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  } else if (req.method === 'DELETE') {
    // Logout functionality
    // Clear the token cookie by setting its expiration to the past
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Set expiration to epoch time
      path: '/',
    }));

    res.status(204).json({ message: 'Logged out successfully' });
  } else {
    // Handle other HTTP methods
    res.status(405).json({ message: 'Method not allowed' });
  }
}
