// pages/api/approveUser.js

import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { db } = await dbConnect();

    // Destructure the request body
    const { email, status, reason } = req.body;

    // Construct the update object
    const updateData = { status };
    if (reason) {
      updateData.reason = reason;
    }

    // Update the user's approval status in the 'users' collection
    const result = await db.collection('users').updateOne(
      { email },
      { $set: updateData }
    );

    // Return a success message
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'User status updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    // If the request method is not PUT, return a 405 Method Not Allowed status
    res.status(405).json({ message: 'Method not allowed' });
  }
}