// services/auth.js

import axios from 'axios';

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