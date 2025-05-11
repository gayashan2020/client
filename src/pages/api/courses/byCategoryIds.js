// src/pages/api/courses/byCategoryIds.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { db } = await dbConnect();

  if (req.method === "POST") {
    const {
      categoryNames,
      userId,
      searchTerm = "",
      organizers = [],
    } = req.body;

    try {
      const filter = {
        category: { $in: categoryNames },
      };

      // Add search filter
      if (searchTerm) {
        filter.$or = [
          { event: { $regex: searchTerm, $options: "i" } },
          { organizing_body: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
        ];
      }

      // Add organizer filter
      if (organizers.length > 0) {
        filter.organizing_body = { $in: organizers };
      }

      const courses = await db
        .collection("courses")
        .find(filter)
        .collation({ locale: "en", strength: 2 }) // Add this line
        .toArray();

      // Rest of your existing user enrollment logic...
      if (userId) {
        const enrolledCoursesData = await db
          .collection("users_courses")
          .find({
            userId: new ObjectId(userId),
          })
          .toArray();

        const enrolledCoursesMap = enrolledCoursesData.reduce((map, course) => {
          map[course.courseId.toString()] = course.enrollStatus;
          return map;
        }, {});

        const enrolledCourses = courses
          .filter((course) => enrolledCoursesMap[course._id.toString()])
          .map((course) => ({
            ...course,
            enrollStatus: enrolledCoursesMap[course._id.toString()],
          }));

        const otherCourses = courses.filter(
          (course) => !enrolledCoursesMap[course._id.toString()]
        );

        res.status(200).json({ enrolledCourses, otherCourses });
      } else {
        res.status(200).json({ enrolledCourses: [], otherCourses: courses });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
