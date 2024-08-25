// src/pages/api/settings/fetchMonthlyCpd.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { settingId, year, month } = req.query;

  if (!ObjectId.isValid(settingId)) {
    return res.status(400).json({ error: "Invalid setting ID" });
  }

  try {
    const { db } = await dbConnect();
    const monthlyCpd = await db.collection("monthlyCpd").findOne({
      settingId: new ObjectId(settingId),
      year: parseInt(year),
      month: parseInt(month),
    });

    if (!monthlyCpd) {
      return res.status(404).json({ error: "Monthly CPD not found" });
    }

    res.status(200).json({ message: "Monthly CPD retrieved successfully", body: monthlyCpd });
  } catch (error) {
    console.error("Error fetching monthly CPD:", error);
    res.status(500).json({ error: "Error fetching monthly CPD" });
  }
}
