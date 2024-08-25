// src/pages/api/settings/updateYearlyCpd.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { settingId, year, yearlyTarget } = req.body;

  if (!settingId || !year || yearlyTarget === undefined) {
    return res.status(400).json({ error: "Missing settingId, year, or yearlyTarget" });
  }

  try {
    const { db } = await dbConnect();
    const yearlyCpdCollection = db.collection("yearlyCpd");

    const response = await yearlyCpdCollection.updateOne(
      { settingId: new ObjectId(settingId), year },
      { $set: { yearlyTarget } },
      { upsert: true }
    );

    if (response.modifiedCount === 0 && response.upsertedCount === 0) {
      return res.status(404).json({ message: "No record found for the provided settingId and year" });
    }

    res.status(200).json({ message: "Yearly CPD updated successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating yearly CPD" });
  }
}
