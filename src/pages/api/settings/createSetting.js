// src/pages/api/settings/createSetting.js
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const { db } = await dbConnect();

  const settingsCollection = db.collection("settings");

  const { userId } = req.body;

  let setting = {
    userId,
    totalCpd: 0,
  };

  try {
    // Insert new settings
    let response = await settingsCollection.insertOne(setting);

    res.status(200).json({ message: "Settings added successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding settings" });
  }
}
