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
  Badge,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { darkTheme } from "@/styles/theme";
import { userRoles, userStatus } from "@/assets/constants/authConstants";
import { routes } from "@/assets/constants/routeConstants";
import { logoutUser } from "@/services/auth";
import { AuthContext } from "@/contexts/AuthContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { fetchMenteesByMentor } from "@/services/mentorService";
import { fetchUsers } from "@/services/users";
import { fetchUnreadMessagesCount } from "@/services/conversations";
import { NotificationContext } from "@/contexts/NotificationProvider";


export default function Layout({ children }) {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const {
    unreadMessagesCount,
    pendingUserApprovals,
    pendingMenteeApprovals,
    setUnreadMessagesCount,
    setPendingUserApprovals,
    setPendingMenteeApprovals,
  } = useContext(NotificationContext);
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
      fetchPendingApprovals();
      fetchPendingUserApprovals();
      fetchUnreadMessages();
    }
  }, [user, setLoading]);

  const fetchUnreadMessages = async () => {
    if (user) {
      setLoading(true);
      try {
        const totalUnread = await fetchUnreadMessagesCount(user._id);
        setUnreadMessagesCount(totalUnread);
      } catch (error) {
        console.error("Failed to fetch unread messages count:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchPendingApprovals = async () => {
    if (user && [userRoles.SUPER_ADMIN, userRoles.MENTOR].includes(user.role)) {
      setLoading(true);
      try {
        const mentees = await fetchMenteesByMentor(user._id);
        const pendingCount = mentees.filter(
          (mentee) => mentee.mentorApprovalStatus !== true
        ).length;
        setPendingMenteeApprovals(pendingCount);
      } catch (error) {
        console.error("Failed to fetch pending approvals:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchPendingUserApprovals = async () => {
    if (user && [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role)) {
      setLoading(true);
      try {
        const users = await fetchUsers();
        const pendingCount = users.filter((user) => {
          const statusKey = user.status ? user.status.toUpperCase() : "";
          const statusInfo = userStatus[statusKey];
          return (
            !statusInfo || statusInfo.value !== userStatus.ACTIVE.value
          ) && statusKey !== userStatus.DELETED_NO_APPEAL.value;
        }).length;
        setPendingUserApprovals(pendingCount);
      } catch (error) {
        console.error("Failed to fetch pending user approvals:", error);
      } finally {
        setLoading(false);
      }
    }
  };

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
          href={routes.ADMIN_USERS}
          selected={router.pathname === routes.ADMIN_USERS}
        >
          <Badge
            color="error"
            badgeContent={pendingUserApprovals > 99 ? '99+' : pendingUserApprovals}
            invisible={pendingUserApprovals === 0}
          >
            <ListItemText primary="Users" />
          </Badge>
        </ListItemButton>
      )}

      {user &&
        [
          userRoles.SUPER_ADMIN,
          userRoles.ADMIN,
          userRoles.CPD_PROVIDER,
          userRoles.STUDENT,
        ].includes(user.role) && (
          <ListItemButton
            component="a"
            href={routes.ADMIN_COURSES}
            selected={router.pathname === routes.ADMIN_COURSES}
          >
            <ListItemText primary="Courses" />
          </ListItemButton>
        )}

      {user && [userRoles.STUDENT].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.MY_COURSES}
          selected={router.pathname === routes.MY_COURSES}
        >
          <ListItemText primary="My Courses" />
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

      {user &&
        [
          userRoles.SUPER_ADMIN,
          userRoles.ADMIN,
          userRoles.CPD_PROVIDER,
          userRoles.STUDENT,
        ].includes(user.role) && (
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
          <Badge
            color="error"
            badgeContent={pendingMenteeApprovals > 99 ? '99+' : pendingMenteeApprovals}
            invisible={pendingMenteeApprovals === 0}
          >
            <ListItemText primary="Mentee Management" />
          </Badge>
        </ListItemButton>
      )}

      <ListItemButton
        component="a"
        href={routes.ADMIN_CHAT}
        selected={router.pathname === routes.ADMIN_CHAT}
      >
        <Badge
          color="error"
          badgeContent={unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
          invisible={unreadMessagesCount === 0}
        >
          <ListItemText primary="Chat" />
        </Badge>
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
