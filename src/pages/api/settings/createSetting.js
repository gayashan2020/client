// src\pages\api\settings\createSetting.js
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const { db } = await dbConnect();

  // Access settings collection
  const settings = db.collection("settings");

  let {
    userId
  } = req.body;

  let setting = {
    userId,
    currentCPD: 0,
    currentCPDTarget: {monthly:0, yearly:0},
    cpdTarget: {monthly:0, yearly:0},
  };

  try {
    // Insert new settings
    let response = await settings.insertOne(setting);

    res
      .status(200)
      .json({ message: "settings added successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding settings" });
  }
}
