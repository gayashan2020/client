// api/dashboard/occupationData.js
import dbConnect from '@/lib/dbConnect';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();

      const occupationData = await db.collection('users').aggregate([
        { $group: { _id: "$occupation", count: { $sum: 1 } } }
      ]).toArray();

      res.status(200).json(occupationData.map(item => ({
        occupation: item._id || 'Unknown', // Use 'Unknown' if _id is null
        count: item.count
      })));
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};