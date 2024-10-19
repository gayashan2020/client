// src/pages/api/message/getConversationsWithNames.js

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const {
    query: { userId },
    method,
  } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID must be provided" });
  }

  const { db } = await dbConnect();

  try {
    // Fetch all conversations involving the user
    const conversations = await db.collection("conversations")
      .find({
        $or: [
          { initiator: new ObjectId(userId) },
          { responder: new ObjectId(userId) },
        ],
      })
      .toArray();

    const userMap = new Map();
    // Collect all unique user IDs excluding the current user
    const userIds = conversations
      .flatMap((convo) => [convo.initiator, convo.responder])
      .filter((id) => id.toString() !== userId);

    // Fetch user information for all users involved in conversations
    await Promise.all(
      Array.from(new Set(userIds)).map(async (id) => {
        if (!userMap.has(id.toString())) {
          const userDoc = await db.collection("users").findOne({ _id: id });
          userMap.set(id.toString(), userDoc);
        }
      })
    );

    // Add partner name and unread messages count to each conversation
    const conversationsWithNames = await Promise.all(conversations.map(async (convo) => {
      // Determine the ID of the conversation partner
      const partnerId =
        convo.initiator.toString() === userId
          ? convo.responder.toString()
          : convo.initiator.toString();

      const partner = userMap.get(partnerId);

      // Count unread messages that are not read by the current user
      const unreadCount = await db.collection("messages").countDocuments({
        conversationId: convo._id,
        sender: { $ne: new ObjectId(userId) }, // Messages sent by others
        readBy: { $ne: new ObjectId(userId) } // Messages not read by current user
      });

      return {
        ...convo,
        partnerName: partner?.fullName || `${partner?.firstName} ${partner?.lastName}` || "Unknown User",
        unreadCount,
      };
    }));

    res.status(200).json(conversationsWithNames);
  } catch (error) {
    console.error("Error retrieving conversations:", error);
    res.status(500).json({
      message: "Error retrieving conversations",
      error: error.message,
    });
  }
}
