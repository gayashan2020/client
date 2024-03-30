// src/pages/api/conversations/getConversationsWithNames.js

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
    const conversations = await db
      .collection("conversations")
      .find({
        $or: [
          { initiator: new ObjectId(userId) },
          { responder: new ObjectId(userId) },
        ],
      })
      .toArray();

    const userMap = new Map();

    // Retrieve all unique user IDs involved in the conversations
    const userIds = conversations
      .flatMap((convo) => [convo.initiator, convo.responder])
      .filter((id) => id.toString() !== userId); // Exclude the current user

    // Fetch all users by their IDs
    await Promise.all(
      Array.from(new Set(userIds)).map(async (id) => {
        if (!userMap.has(id.toString())) {
          const userDoc = await db.collection("users").findOne({ _id: id });
          userMap.set(id.toString(), userDoc);
        }
      })
    );

    const conversationsWithNames = conversations.map((convo) => {
      // Determine the ID of the conversation partner
      const partnerId =
        convo.initiator.toString() === userId
          ? convo.responder.toString()
          : convo.initiator.toString();

      const partner = userMap.get(partnerId);

      // Function to decide which name to use: fullName or firstName + lastName
      const getUserName = (user) => {
        if (!user) return "Unknown User"; // Return a default string if user is not found
        if (user.fullName) return user.fullName;
        return `${user.firstName} ${user.lastName}`;
      };

      return {
        ...convo,
        partnerName: getUserName(partner), // Use the name of the partner
        // Keep other properties of the conversation as needed
      };
    });

    res.status(200).json(conversationsWithNames);
  } catch (error) {
    console.error("Error retrieving conversations:", error);
    res.status(500).json({
      message: "Error retrieving conversations",
      error: error.message,
    });
  }
}