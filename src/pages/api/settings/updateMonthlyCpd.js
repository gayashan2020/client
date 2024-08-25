// src/pages/api/settings/updateMonthlyCpd.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { settingId, year, month, monthlyTarget } = req.body;

  if (!settingId || !year || !month || monthlyTarget === undefined) {
    return res.status(400).json({ error: "Missing settingId, month, or monthlyTarget" });
  }

  try {
    const { db } = await dbConnect();
    const monthlyCpdCollection = db.collection("monthlyCpd");

    const response = await monthlyCpdCollection.updateOne(
      { settingId: new ObjectId(settingId), month, year },
      { $set: { monthlyTarget } },
      { upsert: true }
    );

    if (response.modifiedCount === 0 && response.upsertedCount === 0) {
      return res.status(404).json({ message: "No record found for the provided settingId and month" });
    }

    res.status(200).json({ message: "Monthly CPD updated successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating monthly CPD" });
  }
}
