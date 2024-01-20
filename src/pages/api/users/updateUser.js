// pages/api/updateUser.js

import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { db, client } = await dbConnect();

    // Destructure the request body
    const { email, firstName, lastName, gender, occupation, city, district, currentStation, nicOrPassport, contactNumber, batch, faculty } = req.body;

    // Update the user in the 'users' collection
    const result = await db.collection('users').updateOne(
      { email },
      { $set: { firstName, lastName, gender, occupation, city, district, currentStation, nicOrPassport, contactNumber, batch, faculty } }
    );

    // Return a success message
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    // If the request method is not PUT, return a 405 Method Not Allowed status
    res.status(405).json({ message: 'Method not allowed' });
  }
}