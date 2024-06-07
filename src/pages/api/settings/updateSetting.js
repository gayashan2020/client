// src/pages/api/settings/updateSetting.js
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, year, month, value } = req.body;
console.log(id, year, month, value);
  if (!id || !year || !month || value === undefined) {
    return res.status(400).json({ error: "Missing id, year, month, or value" });
  }

  try {
    const { db } = await dbConnect();
    const settings = db.collection("settings");

    const updateKey = `cpdTarget.${year}.${month}`;
    const update = { [updateKey]: value };

    const response = await settings.updateOne(
      { userId: id },
      { $set: update },
      { upsert: true }
    );

    if (response.modifiedCount === 0 && response.upsertedCount === 0) {
      return res.status(404).json({ message: "No settings found for the provided userId" });
    }

    res
      .status(200)
      .json({ message: "Settings updated successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating settings" });
  }
}
