import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
} from "@mui/material";
import { cardData, activities } from "@/assets/constants/landingPageConstants";
import Link from "next/link";
import {routes} from "@/assets/constants/routeConstants";

export default function IntroSection() {
  return (
    <>
      {/* Box for the Top header section of the page */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "300px", sm: "400px", md: "500px", lg: "600px" }, // Adjust height for different screen sizes
          color: "white",
          background: `url('img-intro.png') no-repeat center center`,
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: { xs: 2, sm: 3 }, // Adjust padding for different screen sizes
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark overlay for better text visibility
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 2, // Above the overlay
            p: { xs: 2, sm: 3 }, // Adjust padding for different screen sizes
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem", md: "3rem" } }}
          >
            Learning and ePortfolio Management System
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
          >
            NATIONAL CPD SYSTEM FOR HEALTH PROFESSIONALS
          </Typography>
          <Box
            sx={{
              "& > button": {
                m: 1,
                width: "auto",
                fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
              },
            }}
          >
            <Link href={routes.LOGIN} passHref>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                Log in
              </Button>
            </Link>
            <Link href={routes.REGISTER} passHref>
              <Button variant="contained" color="secondary">
                Sign up
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Box for the Basics of CPD Competencies section of the page */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Basics of CPD Competencies
        </Typography>
        {cardData.map((card, index) => (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            key={index}
            direction={{
              xs: "column-reverse",
              sm: card.reverse ? "row-reverse" : "row",
            }}
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={3}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2">{card.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box
                component="img"
                src={card.image}
                alt={card.title}
                sx={{ width: "100%", height: "auto" }}
              />
            </Grid>
          </Grid>
        ))}
      </Box>
      {/* Box for the CPD Activities section of the page */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          CPD Activities
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {activities.map((activity, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card
                raised
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ my: 2, ".MuiSvgIcon-root": { fontSize: 60 } }}>
                    {activity.icon}
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{ textAlign: "center" }}
                  >
                    {activity.title}
                  </Typography>
                  {activity.items.map((detail, detailIndex) => (
                    <Typography
                      key={detailIndex}
                      variant="body2"
                      color="textSecondary"
                      sx={{ textAlign: "center" }}
                    >
                      {detail}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
