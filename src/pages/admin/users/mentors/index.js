import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { routes } from "@/assets/constants/routeConstants";

export default function Index() {
  const router = useRouter();

  const cardStyle = {
    width: 250, // You can set this to the size you desire
    height: 250, // Making the height the same as width to create a square
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // This centers the content vertically
    alignItems: 'center', // This centers the content horizontally
    textAlign: 'center', // Ensures text is centered within the content area
  };

  return (
    <Layout>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Card sx={cardStyle} onClick={() => router.push(routes.ADMIN_USERS_MENTORS_REGISTER)}>
            <CardActionArea sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Register
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click here to visit the registration page
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item>
          <Card sx={cardStyle} onClick={() => router.push(routes.ADMIN_USERS_MENTORS_USER_MANAGEMENT)}>
            <CardActionArea sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click here to visit the user management page
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
