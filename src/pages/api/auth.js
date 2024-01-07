// pages/api/auth.js

import dbConnect from '../../lib/dbConnect';
import { comparePasswords, generateToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { db, client } = await dbConnect();

    // Destructure the username and password from the request body
    const { username, password } = req.body;

    // Find the user in the database
    const user = await db.collection('users').findOne({ username });

    if (user && await comparePasswords(password, user.password)) {
      // If the user is found and the password is correct, create a JWT
      const token = generateToken(user);

      // Return the JWT to the client
      res.status(200).json({ token });
    } else {
      // If the user is not found or the password is incorrect, return a 401 Unauthorized status
      res.status(401).json({ message: 'Invalid username or password' });
    }

    client.close();
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed status
    res.status(405).json({ message: 'Method not allowed' });
  }
}