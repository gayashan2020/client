// src/pages/api/dashboard/superAdminData.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in request." });
  }

  const { db } = await dbConnect();

  try {
    const courses = await db.collection("courses").find().toArray();
    const mentors = await db.collection("users").find({ role: "mentor" }).toArray();

    const courseOverview = courses.map(course => ({
      id: course.id,
      event: course.event,
      organizing_body: course.organizing_body,
      dates: course.dates,
      total_cpd_points: course.total_cpd_points,
    }));

    const mentorDetails = mentors.map(mentor => ({
      fullName: mentor.fullName,
      email: mentor.email,
      contactNumber: mentor.contactNumber,
    }));

    res.status(200).json({ courseOverview, mentorDetails });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
