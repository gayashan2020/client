// src/pages/api/mentors/approveMentee.js

import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ message: 'Missing userId or courseId in request.' });
  }

  const { db } = await dbConnect();

  try {
    // Access the users_courses collection
    const userCourses = db.collection('users_courses');

    // Update the specific entry for the mentee and course
    const updateResult = await userCourses.updateOne(
      { userId: new ObjectId(userId), courseId: new ObjectId(courseId) },
      { $set: { mentor_approved: true } }
    );

    // Check if the document was found and updated
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Mentee course enrollment not found." });
    }

    res.status(200).json({ message: "Mentee approved successfully." });
  } catch (error) {
    console.error('Error approving mentee:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
