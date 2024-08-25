import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { startDate, endDate, mentorId } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Missing required query parameters" });
  }

  const { db } = await dbConnect();

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let usersCoursesIds = [];

    if (mentorId) {
      // Fetch the corresponding _ids from the users_courses collection
      const userCourses = await db.collection("users_courses").find({
        mentorId: new ObjectId(mentorId),
      }).toArray();

      usersCoursesIds = userCourses.map(course => course._id);
    }

    // Aggregate CPD log entries
    const cpdLogs = await db.collection("cpdLog").aggregate([
      {
        $match: {
          dateTime: {
            $gte: start,
            $lte: end,
          },
          ...(mentorId && usersCoursesIds.length > 0 ? { users_courses_id: { $in: usersCoursesIds } } : {}),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateTime" } }, // Group by date only (YYYY-MM-DD)
          totalCpdPoints: { $sum: "$cpdPoints" }, // Sum the CPD points
          entries: { $push: "$$ROOT" } // Optionally push all entries of that day
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date (ascending)
      },
    ]).toArray();

    res.status(200).json(cpdLogs);
  } catch (error) {
    console.error("Error fetching CPD log entries:", error);
    res.status(500).json({ message: "Failed to fetch CPD log entries", error });
  }
}
