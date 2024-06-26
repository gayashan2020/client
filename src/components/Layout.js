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
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { darkTheme } from "@/styles/theme";
import { userRoles } from "@/assets/constants/authConstants";
import { routes } from "@/assets/constants/routeConstants";
import { logoutUser } from "@/services/auth";

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const drawerWidth = 250;
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const drawerContent = (
    <List sx={{ mt: "64px" }}>
      {/* Dashboard */}
      <ListItemButton component="a" href={routes.ADMIN}>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      {/* admin Registration */}
      {user && [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
        <ListItemButton component="a" href={routes.ADMIN_USERS_SITE_ADMIN_USER_MANAGEMENT}>
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
      {user && [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
        <ListItemButton component="a" href={routes.ADMIN_COURSES_MANAGE_COURSE}>
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
        [userRoles.SUPER_ADMIN, userRoles.MENTOR].includes(user.role) && (
          <ListItemButton component="a" href={routes.ADMIN_MENTEEMANAGEMENT}>
            <ListItemText primary="Mentee Management" />
          </ListItemButton>
        )}

      {/* Chat*/}
      <ListItemButton component="a" href={routes.ADMIN_CHAT}>
        <ListItemText primary="Chat" />
      </ListItemButton>

      {/* Settings*/}
      <ListItemButton component="a" href={routes.ADMIN_SETTING}>
        <ListItemText primary="Settings" />
      </ListItemButton>

      {/* Logout Button */}
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );

  // The style applied to the main content should be conditional on the drawer being open
  // in non-mobile view, otherwise it should take full width
  const mainContentStyle = {
    flexGrow: 1,
    p: 3, // Adjust padding as needed
    marginLeft: isMobile ? 0 : `${drawerWidth}px`, // Conditional marginLeft for non-mobile view
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(mobileOpen && {
      // Only apply this style when the mobile drawer is open
      marginLeft: `${drawerWidth}px`, // Make sure the main content is pushed to the right when the drawer is open
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    // marginTop: `64px`, // This height might need adjustment based on your AppBar's height
    width: isMobile ? "auto" : `calc(100% - ${drawerWidth}px)`, // Full width in mobile view
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: isMobile ? "block" : "none", mb: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              LMS Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
        <Box component="main" sx={mainContentStyle}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
