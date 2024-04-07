// src/pages/api/dashboard/userData.js
import dbConnect from '@/lib/dbConnect';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();

      // Get count of users pending approval (where 'approval' field does not exist) grouped by role
      const pendingApprovalCount = await db.collection('users').aggregate([
        { $match: { approval: { $exists: false } } },
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]).toArray();

      // Convert the array of group counts to an object with role as key
      const pendingApprovalByRole = pendingApprovalCount.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      // Get count of enrolled users per course
      const enrolledUsersPerCourse = await db.collection('users_courses').aggregate([
        {
          $group: {
            _id: "$courseId",
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "courseDetails"
          }
        },
        {
          $unwind: "$courseDetails"
        },
        {
          $project: {
            _id: 0,
            courseId: "$_id",
            courseName: "$courseDetails.name",
            enrolledUsersCount: "$count"
          }
        }
      ]).toArray();

      res.status(200).json({
        pendingApprovalByRole,
        enrolledUsersPerCourse
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
