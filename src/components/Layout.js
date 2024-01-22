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
import {userRoles} from "@/assets/constants/authConstants";
import {routes} from "@/assets/constants/routeConstants";

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/users/user")
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
            width: 100,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 200,
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
            <ListItemButton component="a" href={routes.ADMIN}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            {/* admin Registration */}
            {user && user.role === userRoles.SUPER_ADMIN && (
              <ListItemButton component="a" href={routes.ADMIN_USERS}>
                <ListItemText primary="Users" />
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