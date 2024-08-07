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
import { Navbar } from "@/components/landingPageComponents/navbar";
import {
  fetchCourseById,
  enrollToCourse,
  getEnrolledDataByCourse,
} from "@/services/courses";
import { LoadingContext } from "@/contexts/LoadingContext";
import { AuthContext } from "@/contexts/AuthContext"; 
import { fetchCurrentUser, fetchUsers, updateUser } from "@/services/users";
import { toast } from "react-toastify";
import { userRoles } from "@/assets/constants/authConstants";
import { fetchReflectiveLogByUsersCourses } from "@/services/reflectiveLog";

export default function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [enroll, setEnroll] = useState(true);
  const [mentors, setMentors] = useState(null);
  const [mentorDialogOpen, setMentorDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [reflectiveLog, setReflectiveLog] = useState(null);
  const [open, setOpen] = useState(false);
  const [mentorSelected, setMentorSelected] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const { categoryId, courseId } = router.query;
  const { setLoading } = useContext(LoadingContext);
  const { isAuthenticated } = useContext(AuthContext);

 

  useEffect(() => {
    if (!router.isReady) return;

    setLoading(true);
    fetchCourseData();
    if (isAuthenticated) {
      fetchMentorData();
      fetchCurrentUser()
        .then((currentUser) => {
          getEnrolledData(currentUser);
          fetchReflectiveLogData(currentUser);
          setUser(currentUser);
          console.log(currentUser, "current user");
          if (currentUser?.mentorApprovalStatus === true) {
            setMentorSelected(true);
            setSelectedMentor(currentUser?.mentorId); 
          }
        })
        .catch((error) => {
          console.error("Failed to fetch current user", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [router.isReady, isAuthenticated, setLoading]);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers("", userRoles.MENTOR);
      setMentors(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const data = await fetchCourseById(categoryId, courseId);
      setCourse(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReflectiveLogData = async (currentUser) => {
    try {
      setLoading(true);
      const data = await fetchReflectiveLogByUsersCourses(
        currentUser._id,
        courseId
      );
      if (data) {
        setReflectiveLog(data);
      }
    } catch (error) {
      console.error("Failed to fetch reflective log:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEnrolledData = async (currentUser) => {
    try {
      setLoading(true);
      const data = await getEnrolledDataByCourse(currentUser._id, courseId);
      if (data && data[0]) {
        setEnroll(data[0].enrollStatus === 'pending');
      } else {
        setEnroll(false);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await enrollToCourse(user._id, courseId, selectedMentor);
      let payload = {
        email: user.email,
        mentorId: selectedMentor,
        mentorApprovalStatus: mentorSelected?mentorSelected:false,
      };
      await updateUser(payload);

      setMentorDialogOpen(false); // Close dialog after enrollment
      setEnroll(true);
      toast.success("Enrolled successfully!");
    } catch (error) {
      console.error("Enrollment failed", error.message);
      setMentorDialogOpen(false); // Ensure dialog is closed on error as well
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = () => {
    if (mentorSelected) {
      handleEnroll()
    } else {
      setMentorDialogOpen(true);
    }
    
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
        <DialogTitle style={{ textAlign: "center" }}>Select a Mentor</DialogTitle>
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
        <DialogActions style={{ justifyContent: "center", padding: theme.spacing(3) }}>
          <Button
            onClick={() => setMentorDialogOpen(false)}
            variant="outlined"
            style={{ marginRight: theme.spacing(1) }}
          >
            Cancel
          </Button>
          <Button onClick={handleEnroll} disabled={!selectedMentor} variant="contained" color="primary">
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
              <a href={reflectiveLog.file} target="_blank" rel="noopener noreferrer">
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

  return isAuthenticated ? (
    <Layout>
      <Container maxWidth="lg" style={{ marginTop: "2rem", minHeight: "100vh" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={course?.image || "/static/placeholderImage.webp"}
                alt={course?.name}
                style={{ height: "auto", maxWidth: "100%" }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {course?.event}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
              {course?.organizing_body}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }} gutterBottom>
              Max CPD Points: {course?.total_cpd_points}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }} gutterBottom>
              Dates: {course?.dates}
            </Typography>
            <Button
              variant="contained"
              style={!enroll ? { backgroundColor: "rgb(32 176 31)", color: "#ffffff" } : {}}
              disabled={enroll}
              onClick={handleEnrollClick}
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
                  router.push(`/admin/courses/${categoryId}/${course._id}/reflectiveLog`)
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
              style={{
                marginLeft: "1rem",
                backgroundColor: "rgb(234 62 155)",
                color: "#ffffff",
              }}
              onClick={() => router.back()}
            >
              Back
            </Button>
            {user && [userRoles.SUPER_ADMIN, userRoles.ADMIN].includes(user.role) && (
              <Button
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "rgb(240 35 35)",
                  color: "#ffffff",
                }}
                onClick={() =>
                  router.push(`/admin/courses/${categoryId}/${course._id}/editCourse`)
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
  ) : (
    <>
    <Navbar />
    <Container maxWidth="lg" style={{ marginTop: "2rem", minHeight: "100vh" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={course?.image || "/static/placeholderImage.webp"}
                alt={course?.name}
                style={{ height: "auto", maxWidth: "100%" }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {course?.event}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }} gutterBottom>
              {course?.organizing_body}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }} gutterBottom>
              Max CPD Points: {course?.total_cpd_points}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }} gutterBottom>
              Dates: {course?.dates}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
