// api/dashboard/cityData.js
import dbConnect from '@/lib/dbConnect';

export default async (req, res) => {
    if (req.method === 'GET') {
        try {
            const { db } = await dbConnect();

            const cityData = await db.collection('users').aggregate([
                { $group: { _id: "$city", count: { $sum: 1 } } }
            ]).toArray();

            res.status(200).json(cityData.map(item => ({
                city: item._id,
                count: item.count
            })));
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};