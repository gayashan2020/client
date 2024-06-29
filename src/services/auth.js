// services/auth.js

import axios from "axios";

export async function loginUser(email, password) {
  const response = await axios.post(
    "/api/auth",
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

export async function registerUser(userData) {
  const response = await axios.post("/api/register", userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function logoutUser() {
  const response = await axios.delete("/api/auth");
  return response;
}
