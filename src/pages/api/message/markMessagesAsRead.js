// src/pages/api/message/markMessagesAsRead.js

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { conversationId, userId } = req.body;

  if (!conversationId || !userId) {
    return res.status(400).json({ message: "Missing conversationId or userId in request." });
  }

  const { db } = await dbConnect();

  try {
    // Update all messages in the conversation that haven't been read by the current user
    await db.collection("messages").updateMany(
      {
        conversationId: new ObjectId(conversationId),
        readBy: { $ne: new ObjectId(userId) },
      },
      {
        $addToSet: { readBy: new ObjectId(userId) }, // Add userId to readBy array
      }
    );

    res.status(200).json({ message: "Messages marked as read successfully" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
