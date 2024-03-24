// src\pages\api\courses\getCourses.js

import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { filter } = req.body;

    const { db } = await dbConnect();
    let courses;

    if (filter) {
      // If filter is provided, find courses where name, category, authors or keywords matches the filter
      courses = await db.collection('courses').find({
        $or: [
          { name: { $regex: filter, $options: 'i' } },
          { category: { $regex: filter, $options: 'i' } },
          { authors: { $regex: filter, $options: 'i' } },
          { keywords: { $regex: filter, $options: 'i' } },
        ],
      }).toArray();
    } else {
      // If no filter is provided, return all courses
      courses = await db.collection('courses').find({}).toArray();
    }

    return res.status(200).json(courses);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}