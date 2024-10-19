import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const conversationId = req.query.conversationId;

  if (!conversationId) {
    return res.status(400).json({ message: "Missing conversationId in query." });
  }

  const { db } = await dbConnect();

  try {
    const messages = await db.collection("messages").find({
      conversationId: new ObjectId(conversationId),
    }).toArray();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}


/**
 * Fetches all conversations for a given user.
 *
 * @param {string} userId - The ID of the user whose conversations are to be retrieved.
 * @returns {Promise<Object[]>} A promise that resolves with the list of conversations.
 */
export async function fetchConversations(userId) {
  try {
    const response = await fetch(
      `/api/message/conversations?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Convert non-2xx HTTP responses into errors
      const errorBody = await response.text();
      throw new Error(
        `Error fetching conversations: ${response.status} - ${errorBody}`
      );
    }

    const conversations = await response.json();
    return conversations;
  } catch (error) {
    console.error("Error in fetchConversations:", error);
    throw error; // Re-throw the error to be handled by the calling code
  }
}

/**
 * Fetches all messages relevant to the current conversation.
 *
 * @param {string} conversationId - The ID of the conversation whose messages are to be retrieved.
 * @returns {Promise<Object[]>} A promise that resolves with the list of messages.
 */
export async function fetchMessages(conversationId) {
  try {
    const response = await fetch(
      `/api/message/messages?conversationId=${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Convert non-2xx HTTP responses into errors
      const errorBody = await response.text();
      throw new Error(
        `Error fetching messages: ${response.status} - ${errorBody}`
      );
    }

    const messages = await response.json();
    return messages;
  } catch (error) {
    console.error("Error in fetchMessages:", error);
    throw error; // Re-throw the error to be handled by the calling code
  }
}
