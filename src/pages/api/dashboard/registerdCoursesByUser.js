// src/pages/api/dashboard/registeredCourses.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in request." });
  }

  const { db } = await dbConnect();

  try {
    const pipeline = [
      {
        $match: {
          userId: new ObjectId(userId),
          enrollStatus: 'pending',
          mentor_approved: true,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      { $unwind: "$courseDetails" },
      {
        $group: {
          _id: "$courseId",
          courseName: { $first: "$courseDetails.name" },
          userCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          courseId: "$_id",
          courseName: 1,
          userCount: 1,
        },
      },
    ];

    const registeredCourses = await db
      .collection("users_courses")
      .aggregate(pipeline)
      .toArray();
    res.status(200).json(registeredCourses);
  } catch (error) {
    console.error("Error fetching registered courses:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
