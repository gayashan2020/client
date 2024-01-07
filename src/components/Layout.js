// components/Layout.js
import { Box, Drawer, List, ListItemButton, ListItemText } from "@mui/material";

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
          <ListItemButton>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Item 2" />
          </ListItemButton>
          {/* ... */}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children} {/* This is where the current page will be rendered */}
      </Box>
    </Box>
  );
}
