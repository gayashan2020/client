// pages/api/courses/addCourse.js
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { db } = await dbConnect();

  let {
    event,
    image,
    category,
    competency_assessed,
    dates,
    contact,
    total_cpd_points,
    organizing_body,
  } = req.body;

  // Convert total_cpd_points to integer
  total_cpd_points = parseInt(total_cpd_points);

  // Access courses collection
  const courses = db.collection("courses");

  try {
    // Insert new course
    let response = await courses.insertOne({
      image,
      event,
      category,
      competency_assessed,
      dates,
      contact,
      total_cpd_points,
      organizing_body,
    });

    res.status(200).json({ message: "Course added successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding course" });
  }
}
