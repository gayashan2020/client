import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { db } = await dbConnect();

  if (req.method === "POST") {
    const { categoryNames, userId } = req.body;

    try {
      // Fetch courses that match the given category names
      const courses = await db.collection('courses').find({
        category: { $in: categoryNames },
      }).toArray();

      if (userId) {
        // Fetch the user's enrolled courses
        const enrolledCoursesData = await db.collection('users_courses').find({
          userId: new ObjectId(userId),
        }).toArray();

        // Create a map of courseId to enrollStatus
        const enrolledCoursesMap = enrolledCoursesData.reduce((map, course) => {
          map[course.courseId.toString()] = course.enrollStatus;
          return map;
        }, {});

        // Separate courses into enrolled and other courses, and add enrollStatus to each enrolled course
        const enrolledCourses = courses
          .filter(course => enrolledCoursesMap[course._id.toString()])
          .map(course => ({
            ...course,
            enrollStatus: enrolledCoursesMap[course._id.toString()],
          }));

        const otherCourses = courses.filter(course => !enrolledCoursesMap[course._id.toString()]);

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
