// pages/admin/dashboard.js

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  Tooltip,
  Paper,
  Badge,
  Chip,
  ThemeProvider,
} from "@mui/material";

import Layout from "../../components/Layout";
import { useEffect, useState, useContext } from "react";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { userStatus } from "@/assets/constants/authConstants";
import { approveUser } from "@/services/users";
import { darkTheme } from "@/styles/theme";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const { setLoading } = useContext(LoadingContext);

  const [user, setUser] = useState(false);
  const [statusDetails, setStatusDetails] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        const statusKey = currentUser.status
          ? currentUser.status.toUpperCase()
          : "";
        const statusInfo = userStatus[statusKey];
        setStatusDetails(statusInfo);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading]);

  const handleAppeal = async (user) => {
    if (window.confirm("Do you really want to appeal this decision?")) {
      setLoading(true);
      let approval = {
        email: user.email,
        status: userStatus.DELETED_APPEALED.value,
      };
      const response = await approveUser(approval);
      setLoading(false);

      if (response.ok) {
        toast.success("Appealed successfully!");
        fetchCurrentUser()
          .then((currentUser) => {
            setUser(currentUser);
            const statusKey = currentUser.status
              ? currentUser.status.toUpperCase()
              : "";
            const statusInfo = userStatus[statusKey];
            setStatusDetails(statusInfo);
          })
          .catch((error) => {
            console.error("Failed to fetch current user", error);
          });
      } else {
        toast.error("Failed to appeal.");
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid
        container
        style={{
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: darkTheme.palette.background.default,
        }}
        spacing={4}
      >
        <Grid item xs={12} md={6} lg={4}>
          <Card
            style={{
              borderRadius: "15px",
              overflow: "visible",
              position: "relative",
              textAlign: "center",
              minHeight: "50vh",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: darkTheme.palette.background.paper,
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                style={{
                  marginBottom: "15px",
                  color: darkTheme.palette.text.primary,
                }}
              >
                Account Status
              </Typography>

              {statusDetails &&
              statusDetails.label !== userStatus.DELETED_NO_APPEAL.label ? (
                <Chip
                  label={statusDetails?.label}
                  style={{
                    ...statusDetails?.style,
                    fontSize: "1.2rem",
                    padding: "15px",
                    backgroundColor: statusDetails?.style?.backgroundColor || "#1976d2",
                    color: statusDetails?.style?.color || "#ffffff",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <Grid container justifyContent="center" spacing={2}>
                  <Grid item xs={12}>
                    <Chip
                      label={
                        statusDetails?.label === userStatus.DELETED_NO_APPEAL.label
                          ? "Account deleted - appeal within 3 months"
                          : statusDetails?.label
                      }
                      style={{
                        ...statusDetails?.style,
                        fontSize: "1.2rem",
                        padding: "10px",
                        backgroundColor: "#d32f2f",
                        color: "#ffffff",
                        borderRadius: "8px",
                      }}
                    />
                  </Grid>

                  {statusDetails?.label === userStatus.DELETED_NO_APPEAL.label && (
                    <Grid item xs={12}>
                      <Chip
                        label={"Reason : " + user?.reason}
                        style={{
                          ...statusDetails?.style,
                          fontSize: "1rem",
                          padding: "10px",
                          backgroundColor: "#ffb74d",
                          color: "#000000",
                          borderRadius: "8px",
                        }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button
                      color="primary"
                      onClick={() => handleAppeal(user)}
                      variant="contained"
                      style={{
                        padding: "15px 25px",
                        margin: "20px 0",
                        backgroundColor: "#4caf50",
                        color: "#ffffff",
                        fontSize: "1rem",
                        borderRadius: "25px",
                        textTransform: "none",
                      }}
                    >
                      Appeal
                    </Button>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
