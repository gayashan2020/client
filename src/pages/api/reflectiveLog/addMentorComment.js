import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  // Ensure we're dealing with a PATCH request
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { db } = await dbConnect();

  const {
    logId, // Assuming this is passed in the body and represents the _id of the reflectiveLog to be updated
    comment, // The comment to be added to the reflectiveLog
    score, // The score to be added to the reflectiveLog
  } = req.body;

  try {
    // Access the reflectiveLog collection
    const reflectiveLog = db.collection("reflectiveLog");

    // Find the reflectiveLog document to get the users_courses_id
    const logEntry = await reflectiveLog.findOne({ _id: new ObjectId(logId) });

    if (!logEntry) {
      return res.status(404).json({ message: "Reflective Log not found." });
    }

    // Update the reflectiveLog document with the new comment, score, and set approval to "approved"
    const response = await reflectiveLog.updateOne(
      { _id: new ObjectId(logId) },
      {
        $set: {
          comment, // Set the comment
          score, // Set the score
          approval: "approved", // Set the approval to "approved"
        },
      }
    );

    // Check if the document was successfully updated
    if (response.modifiedCount === 0) {
      return res.status(404).json({ message: "Reflective Log not found or no changes made." });
    }

    // Access the users_courses collection to update the enrollStatus
    const usersCourses = db.collection("users_courses");

    // Update the enrollStatus to "approved" for the corresponding users_courses_id
    const updateResponse = await usersCourses.updateOne(
      { _id: new ObjectId(logEntry.users_courses_id) },
      { $set: { enrollStatus: "approved" } }
    );

    // Check if the enrollStatus was successfully updated
    if (updateResponse.modifiedCount === 0) {
      return res.status(404).json({ message: "Users Courses entry not found or no changes made." });
    }

    res.status(200).json({ message: "Reflective Log and enrollment status updated successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating Reflective Log and enrollment status" });
  }
}
