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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BookIcon from "@mui/icons-material/Book";
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
            (!statusInfo || statusInfo.value !== userStatus.ACTIVE.value) &&
            statusKey !== userStatus.DELETED_NO_APPEAL.value
          );
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
    <List
      sx={{
        mt: "64px",
        py: 2,
        backgroundColor: "#1a1a1a",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        height: "calc(100vh - 64px)",
        "& .MuiListItemButton-root": {
          mx: 2,
          mb: 1,
          borderRadius: "8px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.05)",
            transform: "translateX(4px)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(44, 102, 110, 0.15)",
            borderLeft: "3px solid #ff7f50",
            "&:hover": {
              backgroundColor: "rgba(44, 102, 110, 0.2)",
            },
          },
        },
      }}
    >
      <ListItemButton
        component="a"
        href={routes.ADMIN}
        selected={router.pathname === routes.ADMIN}
      >
        <ListItemIcon sx={{ color: "#ff7f50", minWidth: "40px" }}>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText
          primary="Dashboard"
          primaryTypographyProps={{
            variant: "body1",
            sx: { fontWeight: 500 },
          }}
        />
      </ListItemButton>

      {/* User Management Item */}
      {user && [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.ADMIN_USERS}
          selected={router.pathname === routes.ADMIN_USERS}
        >
          <ListItemIcon sx={{ color: "#ff7f50", minWidth: "40px" }}>
            <Badge
              color="error"
              badgeContent={
                pendingUserApprovals > 99 ? "99+" : pendingUserApprovals
              }
              invisible={pendingUserApprovals === 0}
            >
              <GroupsIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText
            primary="User Management"
            primaryTypographyProps={{ variant: "body1" }}
          />
        </ListItemButton>
      )}

      {/* Courses Item */}
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
            <ListItemIcon sx={{ color: "#ff7f50", minWidth: "40px" }}>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText
              primary="Course Catalog"
              primaryTypographyProps={{ variant: "body1" }}
            />
          </ListItemButton>
        )}

      {/* My Courses */}
      {user && [userRoles.STUDENT].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.MY_COURSES}
          selected={router.pathname === routes.MY_COURSES}
        >
          <ListItemIcon sx={{ color: "#ff7f50", minWidth: "36px" }}>
            <BookIcon />
          </ListItemIcon>
          <ListItemText
            primary="My Courses"
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontWeight: 500, letterSpacing: "0.5px" },
            }}
          />
        </ListItemButton>
      )}

      {/* Manage Courses */}
      {user && [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.ADMIN_COURSES_MANAGE_COURSE}
          selected={router.pathname === routes.ADMIN_COURSES_MANAGE_COURSE}
        >
          <ListItemIcon sx={{ color: "#ff7f50", minWidth: "36px" }}>
            <EditNoteIcon />
          </ListItemIcon>
          <ListItemText
            primary="Manage Courses"
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontWeight: 500, letterSpacing: "0.5px" },
            }}
          />
        </ListItemButton>
      )}

      {/* Reflective Logs */}
      {user && [userRoles.STUDENT].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.ADMIN_REFLOG}
          selected={router.pathname === routes.ADMIN_REFLOG}
        >
          <ListItemIcon sx={{ color: "#ff7f50", minWidth: "36px" }}>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText
            primary="Reflective Logs"
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontWeight: 500, letterSpacing: "0.5px" },
            }}
          />
        </ListItemButton>
      )}

      {/* Mentee Management */}
      {user && [userRoles.MENTOR].includes(user.role) && (
        <ListItemButton
          component="a"
          href={routes.ADMIN_MENTEEMANAGEMENT}
          selected={router.pathname === routes.ADMIN_MENTEEMANAGEMENT}
        >
          <ListItemIcon sx={{ color: "#ff7f50", minWidth: "36px" }}>
            <Badge
              color="error"
              badgeContent={
                pendingMenteeApprovals > 99 ? "99+" : pendingMenteeApprovals
              }
              invisible={pendingMenteeApprovals === 0}
            >
              <SupervisorAccountIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText
            primary="Mentee Management"
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontWeight: 500, letterSpacing: "0.5px" },
            }}
          />
        </ListItemButton>
      )}

      {/* Chat Item */}
      <ListItemButton
        component="a"
        href={routes.ADMIN_CHAT}
        selected={router.pathname === routes.ADMIN_CHAT}
      >
        <ListItemIcon sx={{ color: "#ff7f50", minWidth: "40px" }}>
          <Badge
            color="error"
            badgeContent={
              unreadMessagesCount > 99 ? "99+" : unreadMessagesCount
            }
            invisible={unreadMessagesCount === 0}
          >
            <ChatBubbleIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText
          primary="Messaging"
          primaryTypographyProps={{ variant: "body1" }}
        />
      </ListItemButton>

      {/* Settings */}
      <ListItemButton
        component="a"
        href={routes.ADMIN_SETTING}
        selected={router.pathname === routes.ADMIN_SETTING}
      >
        <ListItemIcon sx={{ color: "#ff7f50", minWidth: "36px" }}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText
          primary="Settings"
          primaryTypographyProps={{
            variant: "body2",
            sx: { fontWeight: 500, letterSpacing: "0.5px" },
          }}
        />
      </ListItemButton>

      {/* Logout Button */}
      <Box sx={{ mt: "auto", px: 2, py: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            backgroundColor: "rgba(255, 127, 80, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 127, 80, 0.2)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#ff7f50" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              variant: "body1",
              sx: { fontWeight: 500 },
            }}
          />
        </ListItemButton>
      </Box>
    </List>
  );

  const mainContentStyle = {
    flexGrow: 1,
    p: 3,
    marginLeft: isMobile ? 0 : `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: `
      linear-gradient(
        rgba(26, 26, 26, 0.95),
        rgba(26, 26, 26, 0.95)
      ),
      url('/images/dashboard-bg.png')`,
    backgroundSize: "cover",
    minHeight: "100vh",
    ...(mobileOpen && {
      marginLeft: `${drawerWidth}px`,
      width: `calc(100% - ${drawerWidth}px)`,
    }),
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            background: `
              linear-gradient(
                135deg,
                rgba(26, 26, 26, 0.98) 30%,
                rgba(30, 45, 46, 0.8) 100%
              )`,
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            borderBottom: "1px solid rgba(255, 127, 80, 0.2)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                color: "#ff7f50",
                display: isMobile ? "block" : "none",
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <SchoolIcon
                sx={{
                  fontSize: "2rem",
                  mr: 2,
                  color: "#ff7f50",
                }}
              />
              <Typography
                variant="h4"
                noWrap
                component="div"
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  background:
                    "linear-gradient(45deg, #ff7f50 30%, #ff9e80 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                LMS Portal
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              background: "linear-gradient(195deg, #1a1a1a, #121212)",
              borderRight: "1px solid rgba(255, 127, 80, 0.1)",
              boxShadow: "4px 0 20px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Box component="main" sx={mainContentStyle}>
          <Toolbar />
          <Box
            sx={{
              maxWidth: 1600,
              mx: "auto",
              "& > *": {
                backgroundColor: "rgba(26, 26, 26, 0.8)",
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 127, 80, 0.1)",
                p: 3,
                mb: 3,
              },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
