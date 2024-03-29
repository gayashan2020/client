// src\services\reflectiveLog.js
export async function addReflectiveLog(data) {
  const response = await fetch("/api/reflectiveLog/addReflectiveLog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error adding reflective log: ${response.status}`);
  }

  return response.json();
}

export async function uploadReflectiveFile(reflectiveLogId, file) {
  const formData = new FormData();
  formData.append("reflectiveFile", file);
  formData.append("reflectiveLogId", reflectiveLogId);

  const response = await fetch("/api/reflectiveLog/upload", {
    method: "POST",
    body: formData,
  });

  return response;
}

export async function fetchReflectiveLogByUsersCourses(userId, courseId) {
  const response = await fetch("/api/reflectiveLog/fetchReflectiveLog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, courseId }),
  });

  if (!response.ok) {
    throw new Error(`Error fetching reflective log: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAllReflectiveLogs(userId) {
  const response = await fetch("/api/reflectiveLog/fetchAllReflectiveLogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(
      `Error fetching all reflective logs: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Sends a PATCH request to update a reflective log with a mentor's comment and score.
 *
 * @param {string} logId - The ID of the reflective log to update.
 * @param {string} comment - The mentor's comment.
 * @param {number} score - The score given by the mentor.
 * @returns {Promise<Object>} The response from the server.
 */
export async function addMentorComment(logId, comment, score) {
  try {
    const response = await fetch("/api/reflectiveLog/addMentorComment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ logId, comment, score }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in addMentorComment:", error);
    throw error;
  }
}
