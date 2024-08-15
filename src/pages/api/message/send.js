import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { initiator, responder, message, imageUrl } = req.body;

  if (!initiator || !responder || (!message && !imageUrl)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const { db } = await dbConnect();

  try {
    // Check if a conversation already exists between initiator and responder
    let conversation = await db.collection("conversations").findOne({
      $or: [
        {
          initiator: new ObjectId(initiator),
          responder: new ObjectId(responder),
        },
        {
          initiator: new ObjectId(responder),
          responder: new ObjectId(initiator),
        },
      ],
    });

    let conversationId;

    if (!conversation) {
      // No conversation exists, create a new one
      const newConversation = await db.collection("conversations").insertOne({
        initiator: new ObjectId(initiator),
        responder: new ObjectId(responder),
        createdAt: new Date(),
        messages: [],
      });
      conversationId = newConversation.insertedId; // Get the ID of the newly inserted conversation
    } else {
      conversationId = conversation._id; // Existing conversation ID
    }

    // Insert the new message
    const newMessage = await db.collection("messages").insertOne({
      conversationId: conversationId,
      timestamp: new Date(),
      message: message || null,
      imageUrl: imageUrl || null, // Store imageUrl if provided
      status: "sent",
      sender: new ObjectId(initiator),
    });

    // Update the conversation with the new message ID
    await db
      .collection("conversations")
      .updateOne(
        { _id: conversationId },
        { $push: { messages: newMessage.insertedId } }
      );

    // Fetch the updated conversation with the new message included
    conversation = await db.collection("conversations").findOne(
      { _id: conversationId },
      {
        projection: { messages: { $slice: -50 } }, // Limits to the last 50 messages for example
      }
    );

    res.status(201).json({
      message: "Message sent",
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    res.status(500).json({ message: "Failed to send message", error });
  }
}
