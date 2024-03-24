// src\pages\api\courses\[categoryId]\[courseId].js

import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const {
    query: { courseId },
  } = req;

  if (req.method === 'GET') {
    const { db } = await dbConnect();

    try {
      const course = await db.collection('courses').findOne({
        _id: new ObjectId(courseId)
      });

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json(course);
    } catch (error) {
      // If there's an error casting to ObjectId (invalid format)
      if (error.message.includes('ObjectId')) {
        return res.status(400).json({ message: 'Invalid course ID format' });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
