// src/pages/api/courses/byCategoryIds.js

import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
    const { db } = await dbConnect();

  if (req.method === "POST") {
    const { categoryIds } = req.body;

    try {
      const courses = await db.collection('courses').find({
        categoryId: { $in: categoryIds },
      }).toArray();
    //   console.log('courses', courses);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
