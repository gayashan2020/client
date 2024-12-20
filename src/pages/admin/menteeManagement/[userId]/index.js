import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Layout from "@/components/Layout";
import { fetchStudentDetails } from "@/services/mentorService";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { addMentorComment } from "@/services/reflectiveLog";
import { addCpdLogEntry, updateCpdTotals } from "@/services/cpdLog";
import { toast } from "react-toastify";

export default function StudentDetails() {
  const [studentDetails, setStudentDetails] = useState(null);
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);
  const { setLoading } = useContext(LoadingContext);

  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const dialogContentTextStyle = {
    paddingBottom: '10px', // or whatever value you need
  };

  useEffect(() => {
    if (!router.isReady) return;

    setLoading(true);
    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        return fetchStudentDetailsData(currentUser._id, userId); // Ensure to pass both currentUser._id and userId
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router.isReady, setLoading, userId]); // Added userId as a dependency

  const fetchStudentDetailsData = async (mentorId, studentId) => {
    try {
      const details = await fetchStudentDetails(mentorId, studentId);
      setStudentDetails(details.userDetails); // Adjusted based on the expected response structure
    } catch (error) {
      console.error("Failed to fetch student details:", error);
    }
  };

  if (!studentDetails) {
    return <Typography>Loading...</Typography>;
  }

  // Function to handle opening the course details dialog
  const handleOpenCourseDialog = (course) => {
    setSelectedCourse(course);
    setOpenCourseDialog(true);
  };

  // Function to handle opening the reflective log details dialog
  const handleOpenLogDialog = (log, course) => {
    setSelectedLog(log);
    setSelectedCourse(course);
    setOpenLogDialog(true);
  };

  const handleSubmitReflectiveLog = async (event) => {
    event.preventDefault();
    if (!selectedLog || !selectedLog._id) return;
  
    const { _id: logId, comment, score } = selectedLog;
  
    // Validation: Ensure the score is within the allowed range
    if (Number(score) < 0 || Number(score) > selectedCourse.total_cpd_points) {
      toast.error(`Score must be between 0 and ${selectedCourse.total_cpd_points}`);
      return;
    }
  
    try {
      await addMentorComment(logId, comment, Number(score));
  
      // Add entry to cpdLog
      const cpdLogEntry = {
        cpdPoints: Number(score),
        users_courses_id: selectedLog?.users_courses_id,
        dateTime: new Date().toISOString(),
      };
  
      await addCpdLogEntry(cpdLogEntry); // Call the service function to insert the cpdLog entry
  
      // Update the user's CPD totals
      await updateCpdTotals(userId);
  
      setOpenLogDialog(false);
      toast.success("Reflective log updated successfully!");
      // Optionally, refresh the data to show the updated log
      fetchStudentDetailsData(user._id, userId);
    } catch (error) {
      console.error("Error updating reflective log and adding CPD log entry:", error);
      toast.error("Failed to update reflective log.");
    }
  };   

  return (
    <Layout>
      <Box sx={{ margin: 4 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h4">{studentDetails.fullName}</Typography>
            {/* Add more student details here */}
          </CardContent>
        </Card>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="courses table">
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell align="right">Dates</TableCell>
                <TableCell align="right">CPD Points</TableCell>
                <TableCell align="right">Reflective Log Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentDetails.courses.map((course) => (
                <TableRow
                  key={course._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {course.event}
                  </TableCell>
                  <TableCell align="right">{course.dates}</TableCell>
                  <TableCell align="right">{course.total_cpd_points} points</TableCell>
                  <TableCell align="right">
                    {course.reflectiveLog
                      ? course.reflectiveLog.approval
                      : "No Log"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenCourseDialog(course)}>
                      <InfoIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenLogDialog(course?.reflectiveLog, course)}
                    >
                      <AssignmentIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Course Details Dialog */}
        <Dialog
          open={openCourseDialog}
          onClose={() => setOpenCourseDialog(false)}
        >
          <DialogTitle>Course Details</DialogTitle>
          <DialogContent>
            {selectedCourse && (
              <>
                <DialogContentText sx={dialogContentTextStyle}>
                  <span style={{ fontWeight: "bold" }}>Name:</span>{" "}
                  {selectedCourse.event}
                </DialogContentText>
                <DialogContentText sx={dialogContentTextStyle}>
                  <span style={{ fontWeight: "bold" }}>Category:</span>{" "}
                  {selectedCourse.category}
                </DialogContentText>
                <DialogContentText sx={dialogContentTextStyle}>
                  <span style={{ fontWeight: "bold" }}>Dates:</span>{" "}
                  {selectedCourse.dates}
                </DialogContentText>
                <DialogContentText sx={dialogContentTextStyle}>
                  <span style={{ fontWeight: "bold" }}>CPD Total:</span>{" "}
                  {selectedCourse.total_cpd_points}
                </DialogContentText>
                <DialogContentText sx={dialogContentTextStyle}>
                  <span style={{ fontWeight: "bold" }}>Contact Email:</span>{" "}
                  {selectedCourse?.contact?.email}
                </DialogContentText>
                <DialogContentText sx={dialogContentTextStyle}>
                  <span style={{ fontWeight: "bold" }}>Link:</span>{" "}
                  <a
                    href={selectedCourse.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedCourse.link}
                  </a>
                </DialogContentText>
                <DialogContentText sx={dialogContentTextStyle}>
                  <span style={{ fontWeight: "bold" }}>Organizing Body:</span>{" "}
                  {selectedCourse.organizing_body}
                </DialogContentText>
                {selectedCourse.image && (
                  <img
                    src={selectedCourse.image}
                    alt="Course Image"
                    style={{ maxWidth: "100%", marginTop: "20px" }}
                  />
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Reflective Log Details Dialog */}
        <Dialog open={openLogDialog} onClose={() => setOpenLogDialog(false)}>
          <DialogTitle>Reflective Log Details</DialogTitle>
          <form onSubmit={handleSubmitReflectiveLog}>
            <DialogContent>
              {selectedLog ? (
                <>
                  <DialogContentText sx={dialogContentTextStyle}>
                    <span style={{ fontWeight: "bold" }}>
                      Learning Experience:
                    </span>{" "}
                    {selectedLog.learning_experience}
                  </DialogContentText>
                  <DialogContentText sx={dialogContentTextStyle}>
                    <span style={{ fontWeight: "bold" }}>
                      What Did I Learn:
                    </span>{" "}
                    {selectedLog.what_did_I_learn}
                  </DialogContentText>
                  <DialogContentText sx={dialogContentTextStyle}>
                    <span style={{ fontWeight: "bold" }}>More To Learn:</span>{" "}
                    {selectedLog.more_to_learn}
                  </DialogContentText>
                  <DialogContentText sx={dialogContentTextStyle}>
                    <span style={{ fontWeight: "bold" }}>How To Learn:</span>{" "}
                    {selectedLog.how_to_learn}
                  </DialogContentText>
                  <DialogContentText sx={dialogContentTextStyle}>
                    <span style={{ fontWeight: "bold" }}>Approval Status:</span>{" "}
                    {selectedLog.approval}
                  </DialogContentText>
                  {selectedLog.file && (
                    <DialogContentText sx={dialogContentTextStyle}>
                      <span style={{ fontWeight: "bold" }}>File:</span>{" "}
                      <a
                        href={selectedLog.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    </DialogContentText>
                  )}
                  <TextField
                    margin="dense"
                    id="comment"
                    label="Mentor Comment"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={selectedLog.comment || ""}
                    onChange={(e) =>
                      setSelectedLog({
                        ...selectedLog,
                        comment: e.target.value,
                      })
                    }
                    multiline
                    rows={4}
                  />
                  <TextField
                    margin="dense"
                    id="score"
                    label="Score"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={selectedLog.score || ""}
                    onChange={(e) =>
                      setSelectedLog({ ...selectedLog, score: e.target.value })
                    }
                  />
                </>
              ) : (
                <DialogContentText sx={dialogContentTextStyle}>No Reflective Log Found</DialogContentText>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenLogDialog(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Layout>
  );
}
