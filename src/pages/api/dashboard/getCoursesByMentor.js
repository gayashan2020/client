// src\pages\api\dashboard\getCoursesByMentor.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { mentorId } = req.query;

  const { db } = await dbConnect();

  try {
    let courseIds = [];

    // If mentorId is provided, fetch the corresponding courseIds from users_courses collection
    if (mentorId) {
      const userCourses = await db.collection("users_courses").find({
        mentorId: new ObjectId(mentorId),
      }).toArray();

      courseIds = userCourses.map(course => course.courseId);
    }

    // Fetch the course details from the courses collection
    const query = mentorId && courseIds.length > 0 ? { _id: { $in: courseIds } } : {};
    const courses = await db.collection("courses").find(query).toArray();

    const courseOverview = courses.map(course => ({
      id: course._id,
      event: course.event,
      organizing_body: course.organizing_body,
      dates: course.dates,
      total_cpd_points: course.total_cpd_points,
    }));

    res.status(200).json({ courseOverview });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
