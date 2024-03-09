// src\pages\api\courses\getCategories.js

import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { filter } = req.body;

    const { db } = await dbConnect();
    let courses;

    if (filter) {
      // If filter is provided, find courses where name, category, authors or keywords matches the filter
      courses = await db.collection("courseCategories").find({}).toArray();
    } else {
      // If no filter is provided, return all courses
      courses = await db.collection("courseCategories").find({}).toArray();
    }

    return res.status(200).json(courses);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
