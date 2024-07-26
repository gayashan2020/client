// src\pages\admin\courses\[categoryId]\[courseId]\index.js

import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import {
  fetchCourseById,
  enrollToCourse,
  getEnrolledDataByCourse,
} from "@/services/courses";
import { LoadingContext } from "@/contexts/LoadingContext";
import { fetchCurrentUser, fetchUsers, updateUser } from "@/services/users";
import { toast } from "react-toastify";
import { userRoles } from "@/assets/constants/authConstants";
import { fetchReflectiveLogByUsersCourses } from "@/services/reflectiveLog";
import { set } from "mongoose";

export default function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [enroll, setEnroll] = useState(false);
  const [mentors, setMentors] = useState(null);
  const [mentorDialogOpen, setMentorDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [reflectiveLog, setReflectiveLog] = useState(null);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const { categoryId, courseId } = router.query;

  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    if (!router.isReady) return;

    setLoading(true);
    fetchCourseData();
    fetchMentorData();
    fetchCurrentUser()
      .then((currentUser) => {
        getEnrolledData(currentUser);
        fetchReflectiveLogData(currentUser);
        setUser(currentUser);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router.isReady, setLoading]);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers("", userRoles.MENTOR);
      setLoading(false);
      setMentors(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const data = await fetchCourseById(categoryId, courseId);
      setLoading(false);
      setCourse(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchReflectiveLogData = async (currentUser) => {
    try {
      setLoading(true);
      const data = await fetchReflectiveLogByUsersCourses(
        currentUser._id,
        courseId
      );
      setLoading(false);
      if (data) {
        setReflectiveLog(data);
      }
    } catch (error) {
      console.error("Failed to fetch reflective log:", error);
    }
  };

  const getEnrolledData = async (currentUser) => {
    try {
      setLoading(true);
      const data = await getEnrolledDataByCourse(currentUser._id, courseId);
      if (data && data[0]) {
        setEnroll(data[0].enrollStatus);
      }
      setLoading(false);
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
      await enrollToCourse(user._id, courseId, selectedMentor);
      let payload = {
        email: user.email,
        mentorId: selectedMentor,
        mentorApprovalStatus: false,
      }
      await updateUser(payload);

      setLoading(false);
      setMentorDialogOpen(false); // Close dialog after enrollment
      setEnroll(true);
      toast.success("Enrolled successfully!");
    } catch (error) {
      console.error("Enrollment failed", error.message);
      setLoading(false);
      setMentorDialogOpen(false); // Ensure dialog is closed on error as well
    }
  };

  const handleEnrollClick = () => {
    setMentorDialogOpen(true);
  };

  // Mentor Dialog
  const MentorSelectionDialog = () => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm")); // Responsive full-screen dialog on smaller screens

    return (
      <Dialog
        fullScreen={fullScreen}
        open={mentorDialogOpen}
        onClose={() => setMentorDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2), // Adds padding inside the dialog
            borderRadius: theme.shape.borderRadius, // Applies theme border radius
          },
        }}
      >
        <DialogTitle style={{ textAlign: "center" }}>
          Select a Mentor
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth style={{ marginTop: theme.spacing(2) }}>
            <Select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              style={{
                marginTop: theme.spacing(1), // Adds margin above the Select component
              }}
            >
              <MenuItem value="" disabled>
                Choose a mentor
              </MenuItem>
              {mentors &&
                mentors.map((mentor) => (
                  <MenuItem key={mentor._id} value={mentor._id}>
                    {mentor.fullName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "center", padding: theme.spacing(3) }}
        >
          <Button
            onClick={() => setMentorDialogOpen(false)}
            variant="outlined"
            style={{ marginRight: theme.spacing(1) }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={!selectedMentor}
            variant="contained"
            color="primary"
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const ReflectiveLogDetailsDialog = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="reflective-log-dialog-title"
        aria-describedby="reflective-log-dialog-description"
      >
        <DialogTitle id="reflective-log-dialog-title">
          Reflective Log Details for {reflectiveLog?.courseName} ({reflectiveLog?.approval})
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            <span style={{ fontWeight: "bold" }}>Mentor: </span>
            {reflectiveLog?.mentorName}
          </Typography>
          <Typography gutterBottom>
            <span style={{ fontWeight: "bold" }}>Learning Experience: </span>{" "}
            {reflectiveLog?.learning_experience}
          </Typography>
          <Typography gutterBottom>
            <span style={{ fontWeight: "bold" }}>What Did I Learn: </span>{" "}
            {reflectiveLog?.what_did_I_learn}
          </Typography>
          <Typography gutterBottom>
            <span style={{ fontWeight: "bold" }}>More To Learn: </span>{" "}
            {reflectiveLog?.more_to_learn}
          </Typography>
          <Typography gutterBottom>
            <span style={{ fontWeight: "bold" }}>How To Learn: </span>{" "}
            {reflectiveLog?.how_to_learn}
          </Typography>
          {reflectiveLog?.file && (
            <Typography gutterBottom>
              <a
                href={reflectiveLog.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Attached File
              </a>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
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
              {course.event}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
              {course.organizing_body}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }} gutterBottom>
              Max CPD Points: {course.total_cpd_points}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }} gutterBottom>
              Dates: {course.dates}
            </Typography>
            <Button
              variant="contained"
              style={
                !enroll
                  ? { backgroundColor: "rgb(32 176 31)", color: "#ffffff" }
                  : {}
              }
              disabled={enroll}
              onClick={handleEnrollClick} // Changed to handleEnrollClick to open the dialog
            >
              Enroll
            </Button>
            {!reflectiveLog ? (
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
                onClick={() =>
                  router.push(
                    `/admin/courses/${categoryId}/${course._id}/reflectiveLog`
                  )
                }
              >
                Completed
              </Button>
            ) : (
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
                onClick={handleOpen}
              >
                View Reflective Log
              </Button>
            )}
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
            {user &&
              [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
                <Button
                  style={{
                    marginLeft: "1rem",
                    backgroundColor: "rgb(240 35 35)",
                    color: "#ffffff",
                  }}
                  onClick={() =>
                    router.push(
                      `/admin/courses/${categoryId}/${course._id}/editCourse`
                    )
                  }
                >
                  Edit Course
                </Button>
              )}
          </Grid>
        </Grid>
      </Container>
      <MentorSelectionDialog />
      <ReflectiveLogDetailsDialog />
    </Layout>
  );
}
