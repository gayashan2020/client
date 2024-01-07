// components/Layout.js
import { Box, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          {/* Add your navigation items here */}
          <Link href="/admin" passHref>
            <ListItemButton component="a">
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
          <Link href="/admin/userProfile" passHref>
            <ListItemButton component="a">
              <ListItemText primary="User Profile" />
            </ListItemButton>
          </Link>
          {/* ... */}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children} {/* This is where the current page will be rendered */}
      </Box>
    </Box>
  );
}
