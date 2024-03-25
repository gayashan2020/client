import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const { db } = await dbConnect();

  let {
    learning_experience,
    what_did_I_learn,
    more_to_learn,
    how_to_learn,
    userId,
    courseId,
  } = req.body;

  try {
    // Search for the relevant entry in the users_courses table
    const usersCourses = db.collection("users_courses");
    const userCourseEntry = await usersCourses.findOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
    });

    // Check if user_course entry exists
    if (!userCourseEntry) {
      return res.status(404).json({ message: "User course entry not found." });
    }

    // Access reflectiveLog collection
    const reflectiveLog = db.collection("reflectiveLog");

    // Insert new reflectiveLog with the _id from the users_courses entry
    let response = await reflectiveLog.insertOne({
      learning_experience,
      what_did_I_learn,
      more_to_learn,
      how_to_learn,
      users_courses_id: new ObjectId(userCourseEntry._id),
    });

    res
      .status(200)
      .json({ message: "Reflective Log added successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding Reflective Log" });
  }
}
