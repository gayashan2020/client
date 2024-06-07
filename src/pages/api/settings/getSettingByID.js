// src/pages/api/settings/getSettingByID.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const { db } = await dbConnect();

    // Access settings collection
    const settings = db.collection("settings");

    // Find setting by ID
    const setting = await settings.findOne({ userId: id });

    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }

    res.status(200).json({ message: "Setting retrieved successfully", body: setting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving setting" });
  }
}
