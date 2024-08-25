// src/pages/api/settings/fetchYearlyCpd.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { settingId, year } = req.query;

  if (!ObjectId.isValid(settingId)) {
    return res.status(400).json({ error: "Invalid setting ID" });
  }

  try {
    const { db } = await dbConnect();
    const yearlyCpd = await db.collection("yearlyCpd").findOne({
      settingId: new ObjectId(settingId),
      year: parseInt(year),
    });

    if (!yearlyCpd) {
      return res.status(404).json({ error: "Yearly CPD not found" });
    }

    res.status(200).json({ message: "Yearly CPD retrieved successfully", body: yearlyCpd });
  } catch (error) {
    console.error("Error fetching yearly CPD:", error);
    res.status(500).json({ error: "Error fetching yearly CPD" });
  }
}
