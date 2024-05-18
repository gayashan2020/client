import dbConnect from "@/lib/dbConnect";
import jwt from "jsonwebtoken";

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
      const userId = user._id;

      // Get total enrolled courses for the current user
      const totalEnrolledCourses = await db
        .collection("users_courses")
        .countDocuments({
          userId: userId,
          enrollStatus: true,
        });

      // Get total approved courses for the current user
      const totalApprovedCourses = await db
        .collection("users_courses")
        .countDocuments({
          userId: userId,
          enrollStatus: true,
          mentor_approved: true,
        });

      // Get currently enrolled and approved course details
      const courseDetails = await db
        .collection("users_courses")
        .aggregate([
          {
            $match: {
              userId: userId,
              enrollStatus: true,
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
            $project: {
              _id: 0,
              courseId: "$courseId",
              courseName: "$courseDetails.name",
              courseImage: "$courseDetails.image",
              courseCategory: "$courseDetails.category",
              courseDuration: "$courseDetails.duration",
              courseCpdTotal: "$courseDetails.cpdTotal",
              courseCpdMin: "$courseDetails.cpdMin",
              courseType: "$courseDetails.type",
              courseLink: "$courseDetails.link",
              courseDescription: "$courseDetails.description",
              courseObjectives: "$courseDetails.objectives",
              courseAuthors: "$courseDetails.authors",
              courseKeywords: "$courseDetails.keywords",
              courseApproved: "$courseDetails.approved",
            },
          },
        ])
        .toArray();

      res.status(200).json({
        totalEnrolledCourses,
        totalApprovedCourses,
        courseDetails,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
