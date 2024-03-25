//src\components\Layout.js

import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  CssBaseline,
  ThemeProvider,
  ListItemIcon,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { darkTheme as theme } from "@/styles/theme";
import { userRoles } from "@/assets/constants/authConstants";
import { routes } from "@/assets/constants/routeConstants";
import { logoutUser } from "@/services/auth";

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const drawerWidth = 12;

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

  const handleLogout = () => {
    logoutUser()
      .then((response) => {
        if (response.status === 204) {
          // Assuming 204 No Content on successful logout
          setUser(null); // Clear user state
          router.push("/login"); // Redirect to login page
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => console.error("Logout error:", error));
  };

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
            {user &&
              [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
                <ListItemButton component="a" href={routes.ADMIN_USERS}>
                  <ListItemText primary="Users" />
                </ListItemButton>
              )}
            {user &&
              [
                userRoles.SUPER_ADMIN,
                userRoles.ADMIN,
                userRoles.CPD_PROVIDER,
                userRoles.STUDENT,
              ].includes(user.role) && (
                <ListItemButton component="a" href={routes.ADMIN_COURSES}>
                  <ListItemText primary="Courses" />
                </ListItemButton>
              )}
            {user &&
              [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
                <ListItemButton
                  component="a"
                  href={routes.ADMIN_COURSES_MANAGE_COURSE}
                >
                  <ListItemText primary="Manage Courses" />
                </ListItemButton>
              )}
            {user &&
              [
                userRoles.SUPER_ADMIN,
                userRoles.ADMIN,
                userRoles.CPD_PROVIDER,
                userRoles.STUDENT,
              ].includes(user.role) && (
                <ListItemButton component="a" href={routes.ADMIN_REFLOG}>
                  <ListItemText primary="Reflective Logs" />
                </ListItemButton>
              )}

{user &&
              [
                userRoles.SUPER_ADMIN,
                userRoles.MENTOR,
              ].includes(user.role) && (
                <ListItemButton component="a" href={routes.ADMIN_MENTEEMANAGEMENT}>
                  <ListItemText primary="Mentee Management" />
                </ListItemButton>
              )}


            {/* Logout Button */}
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: drawerWidth, // Add marginLeft equal to the drawer width
            width: `calc(100% - ${drawerWidth}px)`, // Adjust width to account for the drawer
            backgroundColor: "#121212",
            color: "#fff",
            minHeight: "100vh"
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
