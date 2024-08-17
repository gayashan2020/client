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
  