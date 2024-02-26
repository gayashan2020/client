import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
} from "@mui/material";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import {
  fetchCourseById,
  enrollToCourse,
  getEnrolledDataByCourse,
} from "@/services/courses";
import { LoadingContext } from "@/contexts/LoadingContext";
import { fetchCurrentUser } from "@/services/users";
import { toast } from "react-toastify";

export default function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [enroll, setEnroll] = useState(false);
  const router = useRouter();
  const { courseId } = router.query;

  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(true);
    fetchCourseData();
    fetchCurrentUser()
      .then((currentUser) => {
        getEnrolledData(currentUser);
        setUser(currentUser);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const data = await fetchCourseById(courseId);
      setLoading(false);
      setCourse(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const getEnrolledData = async (currentUser) => {
    try {
      setLoading(true);
      const data = await getEnrolledDataByCourse(currentUser._id, courseId);
      console.log(data,"data");
      setLoading(false);
      setEnroll(data[0].enrollStatus);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  if (!course) {
    return <Typography>Loading course details...</Typography>;
  }

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await enrollToCourse(user._id, courseId);
      setLoading(false);
      setEnroll(true);
      toast.success("Enrolled successfully!");
    } catch (error) {
      console.error("Enrollment failed", error.message);
      // Handle the error, such as showing an error message to the user
    }
  };

  return (
    <Layout>
      <Container
        maxWidth="lg"
        style={{ marginTop: "2rem", minHeight: "100vh" }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={course.image || "/static/placeholderImage.webp"}
                alt={course.name}
                style={{ height: "auto", maxWidth: "100%" }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {course.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
              {course.description}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }} gutterBottom>
              Max CPD Points: {course.cpdTotal}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }} gutterBottom>
              Min CPD Points: {course.cpdMin}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }} gutterBottom>
              Duration: {course.duration} weeks
            </Typography>
            <Button
              variant="contained"
              style={{
                backgroundColor: "rgb(32 176 31)",
                color: "#ffffff",
              }}
              onClick={handleEnroll}
            >
              Enroll
            </Button>
            <Button
              variant="contained"
              color="success"
              style={
                !enroll
                  ? { marginLeft: "1rem" }
                  : {
                      marginLeft: "1rem",
                      backgroundColor: "#7F00FF",
                      color: "#ffffff",
                    }
              }
              disabled={!enroll}
            >
              Completed
            </Button>
            <Button
              //   variant="outlined"
              style={{
                marginLeft: "1rem",
                backgroundColor: "rgb(234 62 155)",
                color: "#ffffff",
              }}
              onClick={() => router.back()}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}