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
        // console.log(currentUser);
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
        fetchData();
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
          alignContent: "center",
        }}
        spacing={4}
      >
        <Grid item xs={12} md={6} lg={4}>
          <Card
            style={{
              // backgroundColor: "#121212",
              // color: "white",
              borderRadius: "10px", // Rounded corners for the card
              overflow: "visible", // Ensure that children can render outside the card
              position: "relative",
              textAlign: "center",
              minHeight: "50vh",
              alignContent: "center",
            }}
          >
            {statusDetails &&
            statusDetails.label !== userStatus.DELETED_NO_APPEAL.label ? (
              <Chip label={statusDetails?.label} style={statusDetails?.style} />
            ) : (
              <Grid container>
                <Grid item xs={12} md={12} lg={12}>
                  <Chip
                    label={
                      statusDetails?.label === userStatus.DELETED_NO_APPEAL.label
                        ? "Account deleted - appeal within 3 months"
                        : statusDetails?.label
                    }
                    style={statusDetails?.style}
                  />
                </Grid>
                {statusDetails?.label === userStatus.DELETED_NO_APPEAL.label &&(<Grid item xs={12} md={12} lg={12}>
                  <Chip
                    label={
                      "Reason : " + user?.reason
                    }
                    style={statusDetails?.style}
                  />
                </Grid>)}

                <Grid item xs={12} md={12} lg={12}>
                  <Button
                    color="primary"
                    onClick={() => handleAppeal(user)}
                    style={{
                      padding: "10px",
                      margin: "10px",
                      // backgroundColor: "green",
                      borderRadius: "10px",
                    }}
                  >
                    Appeal
                  </Button>
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
