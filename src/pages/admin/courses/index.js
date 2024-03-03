import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { routes } from "@/assets/constants/routeConstants";
import { fetchCourses } from "@/services/courses";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";

export default function Index() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(true);
    fetchData();
    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading]);

  const router = useRouter();

  const cardStyle = {
    width: 250, // You can set this to the size you desire
    height: 400, // Making the height the same as width to create a square
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center", // This centers the content vertically
    alignItems: "center", // This centers the content horizontally
    textAlign: "center", // Ensures text is centered within the content area
    // "&:hover": {
    //   transform: "scale(1.05)", // Slightly increase the size of the card on hover
    //   transition: "transform 0.3s ease-in-out", // Smooth transition for the transform
    //   minHeight: "auto", // Ensure the card expands to fill the available space
    //   zIndex: 1, // Ensure the card is above others when it expands
    //   position: "relative", // Position relative for proper stacking context
    //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // Optional: add shadow for better emphasis
    // },
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchCourses("");
      setLoading(false);
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const navigateToCourse = (course) => {
    // Navigate to the dynamic route for course details
    router.push(`/admin/courses/${course._id}`);
  };
  

  return (
    <Layout>
      <Grid
        container
        spacing={2}
        alignItems="start"
        justifyContent="flex-start"
        style={{ padding: '20px' }}
      >
        {courses.map((course) => (
          <Grid item key={course._id["$oid"]} xs={12} sm={6} md={4} lg={3}>
            <Card sx={cardStyle} onClick={() => navigateToCourse(course)}>
              <CardActionArea
                sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: "flex-start" }}
              >
                {course.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image}
                    alt={course.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {course.name}
                  </Typography>
                  {/* <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {course.description}
                  </Typography> */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                  >
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      Duration:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight="fontWeightMedium"
                    >
                      {course.duration} hours
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      CPD Total:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight="fontWeightMedium"
                    >
                      {course.cpdTotal} points
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      CPD Minimum:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight="fontWeightMedium"
                    >
                      {course.cpdMin} points
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      Type:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight="fontWeightMedium"
                    >
                      {course.type}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {/* Add Course card */}
        {user && (user.role === "admin" || user.role === "super_admin") && (
          <Grid item>
            <Card
              sx={cardStyle}
              onClick={() => router.push(routes.ADMIN_COURSES_ADD_COURSE)}
            >
              <CardActionArea sx={{ height: "100%", minHeight: "250px" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Add Courses
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click here to add new courses
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
}
