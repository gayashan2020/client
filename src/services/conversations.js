// src/services/conversations.js

/**
 * Sends a message from one user to another, creating a conversation if one does not already exist.
 *
 * @param {string} initiator - The ID of the user sending the message.
 * @param {string} responder - The ID of the user receiving the message.
 * @param {string} message - The content of the message being sent.
 * @param {string} [imageUrl] - Optional URL of an image being sent with the message.
 * @returns {Promise<Object>} The response from the server.
 */
export async function sendMessage(initiator, responder, message, imageUrl = null) {
  try {
    const response = await fetch("/api/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initiator, responder, message, imageUrl }),
    });

    if (!response.ok) {
      // Convert non-2xx HTTP responses into errors
      const errorBody = await response.text();
      throw new Error(`Error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error; // Re-throw the error to be handled by the calling code
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

export async function fetchConversationsWithNames(userId) {
  const res = await fetch(
    `/api/message/getConversationsWithNames?userId=${userId}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch conversations: ${res.status}`);
  }
  return await res.json();
}
