import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { mentorId } = req.body;
  if (!mentorId) {
    return res.status(400).json({ message: 'Missing mentorId in request.' });
  }

  const { db } = await dbConnect();

  try {
    // Fetch entries from users_courses where mentorId matches
    const userCoursesCollection = db.collection('users_courses');
    const coursesCollection = db.collection('courses');
    const usersCollection = db.collection('users');
    const menteeEntries = await userCoursesCollection.find({ mentorId: new ObjectId(mentorId) }).toArray();

    // Extract userIds from users_courses
    const userIdsFromCourses = menteeEntries.map(entry => entry.userId);

    // Fetch details from users table
    const menteeDetailsFromCourses = await usersCollection.find({ _id: { $in: userIdsFromCourses } }).toArray();

    // Enhance menteeDetails with unapprovedCoursesCount and unapprovedCourses list
    const menteeDetailsWithUnapprovedCourses = await Promise.all(menteeDetailsFromCourses.map(async (mentee) => {
      // Find unapproved courses for this mentee
      const unapprovedCoursesEntries = await userCoursesCollection.find({
        userId: mentee._id,
        mentor_approved: { $ne: true }
      }).toArray();

      // Fetch course details for the unapproved courses
      const unapprovedCourseIds = unapprovedCoursesEntries.map(entry => entry.courseId);
      const unapprovedCourses = await coursesCollection.find({ _id: { $in: unapprovedCourseIds } }).project({ name: 1 }).toArray();

      // Map courses to include only courseId and courseName
      const unapprovedCoursesList = unapprovedCourses.map(course => ({
        courseId: course._id,
        courseName: course.name
      }));

      return {
        ...mentee,
        unapprovedCoursesCount: unapprovedCoursesEntries.length,
        unapprovedCourses: unapprovedCoursesList
      };
    }));

    // Fetch mentees directly from users table who have mentorId
    const additionalMentees = await usersCollection.find({
      mentorId: mentorId,
    }).toArray();
    

    // Remove duplicates from additionalMentees
    const uniqueAdditionalMentees = additionalMentees.filter(mentee => 
      !userIdsFromCourses.some(userId => userId.equals(mentee._id))
    );

    // Combine mentees from users_courses and additional mentees from users collection
    const allMentees = [...menteeDetailsWithUnapprovedCourses, ...uniqueAdditionalMentees];

    // Filter out sensitive information
    const filteredMenteeDetails = allMentees.map(({ password, ...rest }) => rest);

    res.status(200).json(filteredMenteeDetails);
  } catch (error) {
    console.error('Error fetching mentees by mentorId:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
