//to do --> add approval to enroll, reflectiveLog

import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardActionArea,
  Box,
  CardMedia,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  TableHead,
} from "@mui/material";
import Layout from "@/components/Layout";
import { fetchMenteesByMentor, approveMentee } from "@/services/mentorService";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { set } from "mongoose";

const MentorMenteesList = () => {
  const [mentees, setMentees] = useState([]);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  useEffect(() => {
    fetchMentees();
  }, []); // Empty dependency array means this effect runs once on mount

  const fetchMentees = async () => {
    setLoading(true);
    try {
      const user = await fetchCurrentUser();
      if (user?._id) {
        const menteeDetails = await fetchMenteesByMentor(user._id);
        setMentees(menteeDetails);
      } else {
        setError("User not found");
      }
    } catch (error) {
      setError("Failed to fetch mentees");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (mentee) => {
    if (mentee.unapprovedCoursesCount > 0) {
      console.log("Mentee has unapproved courses", mentee);
      setSelectedMentee(mentee);
      setOpenDialog(true);
    } else {
      navigateToCourse(mentee);
    }
  };

  const handleApproveMentee = async (courseId) => {
    try {
      setLoading(true);
      await approveMentee(selectedMentee._id, courseId);
      setLoading(false);
      // Close the dialog and refresh the mentees list to reflect the approval
      setOpenDialog(false);
      setSelectedMentee(null);
      // Refresh your mentees list here
      await fetchMentees();
    } catch (error) {
      setLoading(false);
      console.error("Failed to approve mentee:", error);
      // Handle error (e.g., display an error message)
    }
  };

  const navigateToCourse = (mentee) => {
    // Navigate to the dynamic route for course details
    router.push(`/admin/menteeManagement/${mentee._id}`);
  };

  return (
    <Layout>
      <Box sx={{ padding: "20px" }}>
        {/* Header outside the Grid container */}
        <Typography variant="h4" gutterBottom>
          Mentees List
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        {/* Grid container for the cards */}
        <Grid container spacing={3}>
          {mentees.map((mentee, index) => (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              onClick={() => handleCardClick(mentee)}
            >
              <Badge
                badgeContent={mentee.unapprovedCoursesCount}
                color="error"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardActionArea sx={{ height: "100%" }}>
                    {mentee.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={mentee.image}
                        alt={
                          mentee.fullName ||
                          `${mentee.firstName} ${mentee.lastName}`
                        }
                      />
                    )}
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {mentee.fullName ||
                          `${mentee.firstName} ${mentee.lastName}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Occupation: {mentee.occupation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location: {mentee.city}, {mentee.district}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Contact: {mentee.contactNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SLMC Reg Number: {mentee.slmcRegNumber || "N/A"}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Badge>
            </Grid>
          ))}
          {mentees.length === 0 && !error && (
            <Grid item xs={12}>
              <Typography>No mentees found.</Typography>
            </Grid>
          )}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            Unapproved Courses for{" "}
            {selectedMentee?.fullName
              ? selectedMentee?.fullName
              : selectedMentee?.firstName + " " + selectedMentee?.lastName}
          </DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Name</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedMentee?.unapprovedCourses?.map((course) => (
                  <TableRow key={course.courseId}>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleApproveMentee(course.courseId)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default MentorMenteesList;
