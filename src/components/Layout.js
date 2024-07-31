import React, { useState, useEffect, useContext } from "react";
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
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { darkTheme } from "@/styles/theme";
import { userRoles } from "@/assets/constants/authConstants";
import { routes } from "@/assets/constants/routeConstants";
import { logoutUser } from "@/services/auth";
import { AuthContext } from "@/contexts/AuthContext"; 
import { LoadingContext } from "@/contexts/LoadingContext";

export default function Layout({ children }) {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext); 
  const drawerWidth = 200;
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { loading, setLoading } = useContext(LoadingContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user, setLoading]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await logoutUser();
      if (response.status === 204) {
        logout(); // Update AuthContext
        router.push("/login");
        setLoading(false);
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  };

  const drawerContent = (
    <List sx={{ mt: "64px" }}>
      <ListItemButton
        component="a"
        href={routes.ADMIN}
        selected={router.pathname === routes.ADMIN}
      >
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      {user && [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.ADMIN_USERS_SITE_ADMIN_USER_MANAGEMENT}
          selected={router.pathname === routes.ADMIN_USERS_SITE_ADMIN_USER_MANAGEMENT}
        >
          <ListItemText primary="Users" />
        </ListItemButton>
      )}

      {user && [userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.CPD_PROVIDER, userRoles.STUDENT].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.ADMIN_COURSES}
          selected={router.pathname === routes.ADMIN_COURSES}
        >
          <ListItemText primary="Courses" />
        </ListItemButton>
      )}

      {user && [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.ADMIN_COURSES_MANAGE_COURSE}
          selected={router.pathname === routes.ADMIN_COURSES_MANAGE_COURSE}
        >
          <ListItemText primary="Manage Courses" />
        </ListItemButton>
      )}

      {user && [userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.CPD_PROVIDER, userRoles.STUDENT].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.ADMIN_REFLOG}
          selected={router.pathname === routes.ADMIN_REFLOG}
        >
          <ListItemText primary="Reflective Logs" />
        </ListItemButton>
      )}

      {user && [userRoles.SUPER_ADMIN, userRoles.MENTOR].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.ADMIN_MENTEEMANAGEMENT}
          selected={router.pathname === routes.ADMIN_MENTEEMANAGEMENT}
        >
          <ListItemText primary="Mentee Management" />
        </ListItemButton>
      )}

      <ListItemButton
        component="a"
        href={routes.ADMIN_CHAT}
        selected={router.pathname === routes.ADMIN_CHAT}
      >
        <ListItemText primary="Chat" />
      </ListItemButton>

      <ListItemButton
        component="a"
        href={routes.ADMIN_SETTING}
        selected={router.pathname === routes.ADMIN_SETTING}
      >
        <ListItemText primary="Settings" />
      </ListItemButton>

      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );

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
              sx={{ mr: 1, display: isMobile ? "block" : "none", mb: 1 }}
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
