import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { db } = await dbConnect();
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res
      .status(400)
      .json({ message: "Missing userId or courseId in request." });
  }

  try {
    // Find the matching document in the users_courses collection
    const usersCourses = db.collection("users_courses");
    const userCourseDocument = await usersCourses.findOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
    });

    if (!userCourseDocument) {
      return res
        .status(404)
        .json({ message: "No matching user course entry found." });
    }

    // Fetch additional course and mentor details
    const coursesCollection = db.collection("courses");
    const usersCollection = db.collection("users");

    const course = await coursesCollection.findOne({
      _id: userCourseDocument.courseId,
    });
    const mentor = await usersCollection.findOne({
      _id: userCourseDocument.mentorId,
    });
    console.log(mentor, "course");
    if (!course || !mentor) {
      return res.status(404).json({ message: "Course or Mentor not found." });
    }
    console.log("reflectiveLogEntry", mentor);
    // Use the _id from the users_courses entry to find the reflective log
    const reflectiveLog = db.collection("reflectiveLog");
    const reflectiveLogEntry = await reflectiveLog.findOne({
      users_courses_id: userCourseDocument._id,
    });

    if (!reflectiveLogEntry) {
      return res
        .status(404)
        .json({ message: "No reflective log entry found." });
    }

    // Return the reflective log entry with courseName and mentorName
    res.status(200).json({
      ...reflectiveLogEntry,
      courseName: course.name,
      mentorName: mentor.fullName,
    });
  } catch (error) {
    console.error("Failed to fetch reflective log by user and course", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
