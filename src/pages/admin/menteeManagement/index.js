import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  TableHead,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Layout from "@/components/Layout";
import { fetchMenteesByMentor, approveMentee } from "@/services/mentorService";
import { fetchCurrentUser, updateUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

  const handleApproveMentee = async () => {
    try {
      setLoading(true);
      // await approveMentee(selectedMentee._id);
      let payload = {
        email: selectedMentee.email,
        mentorApprovalStatus: true,
      }
      console.log(payload);
      await updateUser(payload);
      setLoading(false);
      // Close the dialog and refresh the mentees list to reflect the approval
      setOpenDialog(false);
      setSelectedMentee(null);
      await fetchMentees();
    } catch (error) {
      setLoading(false);
      console.error("Failed to approve mentee:", error);
      // Handle error (e.g., display an error message)
    }
  };

  const handleOpenDialog = (mentee) => {
    setSelectedMentee(mentee);
    setOpenDialog(true);
  };

  const navigateToCourse = (mentee) => {
    // Navigate to the dynamic route for course details
    router.push(`/admin/menteeManagement/${mentee._id}`);
  };

  return (
    <Layout>
      <Box sx={{ padding: "20px" }}>
        {/* Header outside the Table container */}
        <Typography variant="h4" gutterBottom>
          Mentees List
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        {/* Table for displaying mentees */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Occupation</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>SLMC Reg Number</TableCell>
                {/* <TableCell>Unapproved Courses</TableCell> */}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mentees.map((mentee, index) => (
                <TableRow
                  key={index}
                  hover
                  style={{ cursor: "pointer" }}
                  onClick={() => navigateToCourse(mentee)}
                >
                  <TableCell>
                    {mentee.fullName ||
                      `${mentee.firstName} ${mentee.lastName}`}
                  </TableCell>
                  <TableCell>{mentee.occupation}</TableCell>
                  <TableCell>
                    {mentee.city}, {mentee.district}
                  </TableCell>
                  <TableCell>{mentee.contactNumber}</TableCell>
                  <TableCell>{mentee.slmcRegNumber || "N/A"}</TableCell>
                  {/* <TableCell>{mentee.unapprovedCoursesCount}</TableCell> */}
                  {mentee?.mentorApprovalStatus !== true &&(<TableCell>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(mentee);
                      }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </TableCell>)}
                </TableRow>
              ))}
              {mentees.length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography align="center">No mentees found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>Confirm Approval</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to approve all courses for{" "}
              {selectedMentee?.fullName ||
                `${selectedMentee?.firstName} ${selectedMentee?.lastName}`}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={()=>handleApproveMentee()} color="primary">
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default MentorMenteesList;
