import React from "react";
import { Card, CardActionArea, CardContent, Typography, Grid } from "@mui/material";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }} // Use 100vh to take full height of the viewport
    >
      <Grid item xs={12} sm={6} md={4} lg={3}> {/* Adjust the size props as needed */}
        <Card onClick={() => router.push("/register/studentRegister")}>
          <CardActionArea>
            <CardContent>
              <Typography variant="h5" component="div">
                Student Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click here to register as a student
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}> {/* Adjust the size props as needed */}
        <Card onClick={() => router.push("/register/mentorRegister")}>
          <CardActionArea>
            <CardContent>
              <Typography variant="h5" component="div">
                Mentor Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click here to register as a mentor
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
}
