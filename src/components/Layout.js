import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";

// Create a dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff", // Adjust the primary color if needed
    },
    // ... You can add more color options here
  },
  components: {
    // Override MUI component styles globally
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.08)", // Adjust selected item background
          },
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)", // Adjust hover background
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: "#fff", // Text color for list items
          textDecoration: "none", // Remove underline from links
        },
      },
    },
  },
});

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <ThemeProvider theme={darkTheme}>
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
            {/* Add your navigation items here */}
            <ListItemButton component="a" href="/admin">
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton component="a" href="/admin/userProfile">
              <ListItemText primary="User Profile" />
            </ListItemButton>
            {/* ... */}
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
