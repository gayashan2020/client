// pages/api/enroll.js

import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, courseId, mentorId } = req.body;

    // Ensure the required fields are provided
    if (!userId || !courseId) {
      return res.status(400).json({ message: 'Missing userId or courseId' });
    }

    const { db } = await dbConnect();

    const enrollment = {
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
      mentorId: new ObjectId(mentorId),
      enrollStatus: true, // Assuming true means they are enrolled
    };

    try {
      // Insert the new enrollment into the users_courses collection
      await db.collection('users_courses').insertOne(enrollment);
      res.status(201).json({ message: 'Enrollment successful' });
    } catch (error) {
      console.error('Request error', error);
      res.status(500).json({ error: 'Error enrolling user to course', message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
