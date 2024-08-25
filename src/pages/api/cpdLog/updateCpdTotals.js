// src/pages/api/cpd/updateCpdTotals.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const { db } = await dbConnect();
    const userObjectId = new ObjectId(userId);

    // Fetch the settingId using the userId
    const setting = await db.collection("settings").findOne({ userId: userId });
    if (!setting) {
      return res.status(404).json({ error: "Setting not found for the user" });
    }
    const settingId = setting._id;

    // Get all CPD log entries for the user
    const userCourseIds = await getUserCourseIds(db, userObjectId);
    const cpdLogs = await db.collection("cpdLog").find({
      "users_courses_id": { $in: userCourseIds },
    }).toArray();

    // Aggregate CPD points by year and month
    const yearlyCpdMap = {};
    const monthlyCpdMap = {};
    let totalCpd = 0;

    cpdLogs.forEach((log) => {
      const date = new Date(log.dateTime);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-based

      const points = log.cpdPoints || 0;
      totalCpd += points;

      // Aggregate yearly CPD
      if (!yearlyCpdMap[year]) {
        yearlyCpdMap[year] = 0;
      }
      yearlyCpdMap[year] += points;

      // Aggregate monthly CPD
      const yearMonthKey = `${year}-${month}`;
      if (!monthlyCpdMap[yearMonthKey]) {
        monthlyCpdMap[yearMonthKey] = 0;
      }
      monthlyCpdMap[yearMonthKey] += points;
    });

    // Update yearly CPD records
    for (const [year, yearlyCpd] of Object.entries(yearlyCpdMap)) {
      await db.collection("yearlyCpd").updateOne(
        { settingId: settingId, year: parseInt(year) },
        { $set: { yearlyCpd } },
        { upsert: true }
      );
    }

    // Update monthly CPD records
    for (const [yearMonthKey, monthlyCpd] of Object.entries(monthlyCpdMap)) {
      const [year, month] = yearMonthKey.split("-");
      await db.collection("monthlyCpd").updateOne(
        { settingId: settingId, year: parseInt(year), month: parseInt(month) },
        { $set: { monthlyCpd } },
        { upsert: true }
      );
    }

    // Update total CPD for the user
    await db.collection("settings").updateOne(
      { _id: settingId },
      { $set: { totalCpd } }
    );

    res.status(200).json({ message: "CPD totals updated successfully" });
  } catch (error) {
    console.error("Error updating CPD totals:", error);
    res.status(500).json({ error: "Error updating CPD totals" });
  }
}

async function getUserCourseIds(db, userObjectId) {
  const userCourses = await db.collection("users_courses").find({
    userId: userObjectId,
  }).toArray();

  return userCourses.map((course) => course._id);
}
