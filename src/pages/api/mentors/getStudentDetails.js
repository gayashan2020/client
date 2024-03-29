// src/pages/api/mentors/getStudentDetails.js

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { mentorId, userId } = req.body;
  if (!mentorId || !userId) {
    return res
      .status(400)
      .json({ message: "Missing mentorId or userId in request." });
  }

  const { db } = await dbConnect();

  try {
    // Connect to collections
    const usersCollection = db.collection("users");
    const usersCoursesCollection = db.collection("users_courses");
    const coursesCollection = db.collection("courses");
    const reflectiveLogCollection = db.collection("reflectiveLog");

    // Fetch user details
    const userDetails = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!userDetails) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch courses related to this student
    const userCourses = await usersCoursesCollection
      .find({ userId: new ObjectId(userId), mentorId: new ObjectId(mentorId) })
      .toArray();
    const courseIds = userCourses.map((course) => course.courseId);

    // Fetch course details and reflective logs together
    let coursesDetailsWithLogs = [];
    for (let userCourse of userCourses) {
        const courseDetails = await coursesCollection.findOne({ _id: new ObjectId(userCourse.courseId) });
      
        // Adjust this line to correctly reference the users_courses record
        const reflectiveLog = await reflectiveLogCollection.findOne({ users_courses_id: userCourse._id });
      
        coursesDetailsWithLogs.push({
          ...courseDetails,
          reflectiveLog: reflectiveLog || null
        });
      }

    // Construct the nested response
    const response = {
      userDetails: {
        ...userDetails,
        password: undefined, // Exclude sensitive information
        courses: coursesDetailsWithLogs,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(
      "Error fetching student details with nested courses and logs:",
      error
    );
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
