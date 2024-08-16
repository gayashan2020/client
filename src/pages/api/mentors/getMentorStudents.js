import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  // Ensure the mentorId is a valid ObjectId
  const { mentorId } = req.body;

  // Connect to the database
  const { db } = await dbConnect();

  try {
    // Step 1: Find all entries in `users_courses` where `mentorId` matches the provided mentorId
    const usersCourses = await db.collection("users_courses").aggregate([
      {
        $match: {
          mentorId: new ObjectId(mentorId),
          enrollStatus: "approved", // Assuming you only want to fetch approved students
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
        $project: {
          _id: 0,
          studentId: "$studentDetails._id",
          name: "$studentDetails.fullName",
          status: "$studentDetails.status",
          courseName: "$courseDetails.event",
          category: "$courseDetails.category",
        },
      },
    ]).toArray();

    res.status(200).json(usersCourses);
  } catch (error) {
    console.error("Error fetching mentor's students:", error);
    throw new Error("Failed to fetch mentor's students");
  }
}
