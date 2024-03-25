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
