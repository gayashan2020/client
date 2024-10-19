// src/pages/api/message/unreadMessagesCount.js

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query." });
  }

  const { db } = await dbConnect();

  try {
    // Count unread messages where the recipient is the current user and the sender is someone else
    const unreadCount = await db.collection("messages").countDocuments({
      conversationId: {
        $in: await db.collection("conversations").distinct("_id", {
          $or: [
            { initiator: new ObjectId(userId) },
            { responder: new ObjectId(userId) }
          ]
        })
      },
      sender: { $ne: new ObjectId(userId) },
      readBy: { $ne: new ObjectId(userId) }
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
