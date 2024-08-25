import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const { mentorId } = req.body;

  if (!mentorId) {
    return res.status(400).json({ message: "Missing mentorId in request." });
  }

  const { db } = await dbConnect();

  try {
    // Step 1: Find all entries in `users_courses` where `mentorId` matches the provided mentorId
    const usersCourses = await db.collection("users_courses").aggregate([
      {
        $match: {
          mentorId: new ObjectId(mentorId),
          enrollStatus: "approved", // Fetch only approved students
        },
      },
      {
        $lookup: {
          from: "users", // Join with `users` collection
          localField: "userId",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      {
        $unwind: "$studentDetails", // Unwind the array to flatten the structure
      },
      {
        $lookup: {
          from: "courses", // Join with `courses` collection
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails", // Unwind the array to flatten the structure
      },
      {
        $group: {
          _id: "$studentDetails._id",
          name: { $first: "$studentDetails.fullName" },
          email: { $first: "$studentDetails.email" },
          status: { $first: "$studentDetails.status" },
          courses: {
            $push: {
              courseName: "$courseDetails.event",
              category: "$courseDetails.category",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          name: 1,
          email: 1,
          status: 1,
          courses: 1,
        },
      },
    ]).toArray();

    res.status(200).json(usersCourses);
  } catch (error) {
    console.error("Error fetching mentor's students:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
