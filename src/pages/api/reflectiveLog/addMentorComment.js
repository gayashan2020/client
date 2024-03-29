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

    // Update the specified reflectiveLog document with the new comment and score
    const response = await reflectiveLog.updateOne(
      { _id: new ObjectId(logId) },
      {
        $set: {
          comment, // Set the comment
          score, // Set the score
          approval: "approved", // Set the approval to true
        },
      }
    );

    // Check if the document was successfully updated
    if (response.modifiedCount === 0) {
      return res.status(404).json({ message: "Reflective Log not found or no changes made." });
    }

    res.status(200).json({ message: "Reflective Log updated successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating Reflective Log" });
  }
}
