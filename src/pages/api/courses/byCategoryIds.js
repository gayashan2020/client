import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const { db } = await dbConnect();

  if (req.method === "POST") {
    const { categoryNames, userId } = req.body;

    try {
      const courses = await db.collection('courses').find({
        category: { $in: categoryNames },
      }).toArray();

      if (userId) {
        const enrolledCoursesData = await db.collection('users_courses').find({
          userId: new ObjectId(userId),
        }).toArray();

        const enrolledCourseIds = enrolledCoursesData.map(course => course.courseId.toString());
        console.log(enrolledCourseIds);

        const enrolledCourses = courses.filter(course => enrolledCourseIds.includes(course._id.toString()));
        const otherCourses = courses.filter(course => !enrolledCourseIds.includes(course._id.toString()));

        res.status(200).json({ enrolledCourses, otherCourses });
      } else {
        res.status(200).json({ enrolledCourses: [], otherCourses: courses });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
