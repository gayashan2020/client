import dbConnect from '@/lib/dbConnect';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();

      // Get count of online users grouped by role
      const onlineUserCount = await db.collection('users').aggregate([
        // { $match: { isOnline: true } },
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]).toArray();

      // Convert the array of group counts to an object with role as key
      const onlineUserCountByRole = onlineUserCount.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      res.status(200).json({
        onlineUserCountByRole
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
