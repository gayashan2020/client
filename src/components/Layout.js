import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import { darkTheme as theme } from "@/styles/theme";

export default function Layout({ children }) {
  const router = useRouter();
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This ensures that the background is dark */}
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "#121212", // Drawer background color
              color: "#fff", // Drawer text color
            },
          }}
        >
          <IconButton onClick={() => router.push("/")}>
            <HomeIcon />
          </IconButton>
          <List>
            {/* Dashboard */}
            <ListItemButton component="a" href="/admin">
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            {/* user Profile */}
            <ListItemButton component="a" href="/admin/userProfile">
              <ListItemText primary="User Profile" />
            </ListItemButton>
            {/* admin Registration */}
            {user && user.role === "superAdmin" && (
              <ListItemButton component="a" href="/admin/adminRegistration">
                <ListItemText primary="Registration" />
              </ListItemButton>
            )}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, color: "#fff", backgroundColor: "#121212" }}
        >
          {children} {/* This is where the current page will be rendered */}
        </Box>
      </Box>
    </ThemeProvider>
  );
}