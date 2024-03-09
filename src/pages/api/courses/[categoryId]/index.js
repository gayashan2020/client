// src\pages\api\courses\[categoryId]\route.js

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const {
    query: { categoryId },
  } = req;

  if (req.method === "GET") {
    const { db } = await dbConnect();

    try {
      const category = await db.collection("courseCategories").findOne({
        _id: new ObjectId(categoryId),
      });

      // Check if the category was found
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const courses = await db.collection("courses").find({
        category: category.category,
      }).toArray(); // Convert cursor to array

      // Check if any courses were found
      if (!courses.length) {
        return res.status(404).json({ message: "No courses found for this category" });
      }

      res.status(200).json(courses);
    } catch (error) {
      // If there's an error casting to ObjectId (invalid format)
      if (error.name === 'BSONTypeError') {
        return res.status(400).json({ message: "Invalid category ID format" });
      }
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
