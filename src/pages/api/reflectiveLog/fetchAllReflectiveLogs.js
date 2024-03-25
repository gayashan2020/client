import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { db } = await dbConnect();
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in request." });
  }

  try {
    // Fetch all matching documents in the users_courses collection for the given userId
    const usersCourses = db.collection("users_courses");
    const coursesForUserCursor = usersCourses.find({ userId: new ObjectId(userId) });
    const coursesForUser = await coursesForUserCursor.toArray();

    if (coursesForUser.length === 0) {
      return res.status(404).json({ message: "No course entries found for the user." });
    }

    // Initialize collections
    const coursesCollection = db.collection("courses");
    const usersCollection = db.collection("users");
    const reflectiveLogCollection = db.collection("reflectiveLog");

    // Fetch reflective logs and attach courseName and mentorName
    const reflectiveLogsPromises = coursesForUser.map(async (userCourse) => {
      const reflectiveLogEntry = await reflectiveLogCollection.findOne({ users_courses_id: userCourse._id });
      if (!reflectiveLogEntry) return null;

      const [course, mentor] = await Promise.all([
        coursesCollection.findOne({ _id: userCourse.courseId }),
        usersCollection.findOne({ _id: userCourse.mentorId }),
      ]);

      if (!course || !mentor) return null;

      return {
        ...reflectiveLogEntry,
        courseName: course.name,
        mentorName: mentor.fullName,
      };
    });

    const reflectiveLogs = (await Promise.all(reflectiveLogsPromises)).filter(log => log !== null);

    res.status(200).json(reflectiveLogs);
  } catch (error) {
    console.error("Failed to fetch all reflective logs for user", error);
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
