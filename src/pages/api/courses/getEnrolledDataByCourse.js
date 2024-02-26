// src\pages\api\courses\getEnrolledDataByCourse.js

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb"; // You need to import ObjectId

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, courseId } = req.body;

    const { db } = await dbConnect();

    // Convert userId and courseId to ObjectId before querying
    try {
      const courses = await db.collection("users_courses").find({
        userId: new ObjectId(userId),
        courseId: new ObjectId(courseId),
      }).toArray();

      return res.status(200).json(courses);
    } catch (error) {
      // Catch errors related to invalid ObjectId conversion or other MongoDB errors
      console.error('Database query error', error);
      res.status(500).json({ message: "Error accessing database" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

