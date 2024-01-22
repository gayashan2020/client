// pages/api/auth.js

import dbConnect from '../../lib/dbConnect';
import { comparePasswords, generateToken } from '../../lib/auth';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { db } = await dbConnect();

    // Destructure the username and password from the request body
    const { email, password } = req.body;

    // Find the user in the database
    const user = await db.collection('users').findOne({ email });

    if (user && await comparePasswords(password, user.password)) {
      // Check if the user has been approved
      if (user.approval) {
        // If the user is found and the password is correct, create a JWT
        const token = generateToken(user);

        // Return the JWT to the client
        res.status(200).json({ token });
      } else {
        // If the user has not been approved, return a 403 Forbidden status
        res.status(403).json({ message: 'Approval has not been given by admin' });
      }
    } else {
      // If the user is not found or the password is incorrect, return a 401 Unauthorized status
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } else if (req.method === 'GET') {
    // Handle GET requests
    const token = req.cookies.token; // Assuming the token is stored in a cookie

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).json({ message: 'Method not allowed' });
  }
}