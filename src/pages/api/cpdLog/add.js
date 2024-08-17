// src/pages/api/cpdLog/add.js
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { cpdPoints, users_courses_id, dateTime } = req.body;

  if (!cpdPoints || !users_courses_id || !dateTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const { db } = await dbConnect();

  try {
    const cpdLogEntry = {
      cpdPoints,
      users_courses_id: new ObjectId(users_courses_id),
      dateTime: new Date(dateTime),
    };

    const result = await db.collection("cpdLog").insertOne(cpdLogEntry);

    if (!result.acknowledged) {
      throw new Error("Failed to insert CPD log entry");
    }

    res.status(201).json({ message: "CPD log entry added successfully" });
  } catch (error) {
    console.error("Error adding CPD log entry:", error);
    res.status(500).json({ message: "Failed to add CPD log entry", error });
  }
}
