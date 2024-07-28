import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { courseId } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      // Handle the GET request for course details (existing code)
      // Example: fetching course details by courseId
      try {
        const db = (await dbConnect()).db;
        const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) });
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch course details", error });
      }
      break;

    case "PUT":
      // Handle the PUT request to update the course category by name
      try {
        const { categoryName } = req.body;

        if (!ObjectId.isValid(courseId)) {
          return res.status(400).json({ message: "Invalid course ID format" });
        }

        const db = (await dbConnect()).db;
        const result = await db.collection("courses").updateOne(
          { _id: new ObjectId(courseId) },
          { $set: { category: categoryName } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Course not found or category unchanged" });
        }

        res.status(200).json({ message: "Course category updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Failed to update course category", error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
