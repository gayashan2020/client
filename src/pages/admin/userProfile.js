//pages/admin/userProfile.js

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Box } from "@mui/material";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h1>User Profile</h1>
        {Object.entries(user).map(([key, value]) => (
          <p key={key}>{`${key}: ${value}`}</p>
        ))}
      </Box>
    </Layout>
  );
}
