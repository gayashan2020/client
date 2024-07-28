import dbConnect from "@/lib/dbConnect";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { db } = await dbConnect();

      const { email } = jwt.verify(token, process.env.JWT_SECRET);

      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user has mentor approval status
      if (!user.mentorApprovalStatus || !user.mentorId) {
        return res.status(403).json({ message: "Mentor approval required" });
      }

      const userId = user._id;
      const mentorId = new ObjectId(user.mentorId);

      // Get total enrolled courses for the current user with mentor approval
      const totalEnrolledCourses = await db
        .collection("users_courses")
        .countDocuments({
          userId: userId,
          enrollStatus: true,
          mentorId: mentorId,
        });

      // Get currently enrolled and approved course details with mentor approval
      const courseDetails = await db
        .collection("users_courses")
        .aggregate([
          {
            $match: {
              userId: userId,
              enrollStatus: true,
              mentorId: mentorId,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          { $unwind: "$userDetails" },
          {
            $match: {
              "userDetails.mentorApprovalStatus": true,
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
            $project: {
              _id: 0,
              courseId: 1,
              event: "$courseDetails.event", // Changed field name to match your sample data
              image: "$courseDetails.image", // Ensure this field exists in the `courses` collection
              category: "$courseDetails.category",
              dates: "$courseDetails.dates", // Ensure this field exists in the `courses` collection
              total_cpd_points: "$courseDetails.total_cpd_points",
              organizing_body: "$courseDetails.organizing_body", // Ensure this field exists in the `courses` collection
              competency_assessed: "$courseDetails.competency_assessed", // Ensure this field exists in the `courses` collection
              contact: "$courseDetails.contact", // Ensure this field exists in the `courses` collection
            },
          },
        ])
        .toArray();

      res.status(200).json({
        totalEnrolledCourses,
        courseDetails,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
