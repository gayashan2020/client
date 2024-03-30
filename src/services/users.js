// services/users.js

export async function fetchUsers(filter = "", role) {
  const response = await fetch("/api/users/allUsers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filter, role }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchCurrentUser() {
  const response = await fetch("/api/users/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies in the request
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function updateUser(userData) {
  const response = await fetch("/api/users/updateUser", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return response;
}

export async function updateAvatar(userId, file) {
  // Create a FormData object to hold the file and any other data
  const formData = new FormData();
  formData.append("avatar", file);
  formData.append("userId", userId); // Assuming you want to pass the user ID

  // Make a PUT request to the "updateAvatar" API endpoint
  const response = await fetch("/api/users/updateAvatar", {
    method: "PUT",
    body: formData, // Send the FormData object directly without JSON.stringify
    // Do not set "Content-Type": "application/json" here because it's multipart/form-data
  });

  return response;
}

export async function approveUser(user) {
  const response = await fetch("/api/users/approveUser", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      approval: true,
    }),
  });

  return response;
}

export async function sendEmail(options) {
  const response = await fetch("/api/users/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchUserById(userId) {
  const res = await fetch(`/api/users/getUserById?userId=${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }
  return await res.json();
}