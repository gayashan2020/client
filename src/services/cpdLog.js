// services/cpdLog.js
export async function addCpdLogEntry(cpdLogEntry) {
  try {
    const response = await fetch("/api/cpdLog/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cpdLogEntry),
    });

    if (!response.ok) {
      throw new Error(`Failed to add CPD log entry: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("addCpdLogEntry error:", error);
    throw error;
  }
}

export async function getCpdLogEntries(startDate, endDate, mentorId = null) {
  try {
    // Build the query parameters
    let query = `startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`;

    if (mentorId) {
      query += `&mentorId=${encodeURIComponent(mentorId)}`;
    }

    // Make the API request
    const response = await fetch(`/api/cpdLog/get?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch CPD log entries: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("getCpdLogEntries error:", error);
    throw error;
  }
}

export async function updateCpdTotals(userId) {
  const response = await fetch("/api/cpdLog/updateCpdTotals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(`Error updating CPD totals: ${response.status}`);
  }

  return response.json();
}
