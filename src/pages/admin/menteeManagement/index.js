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
import CancelIcon from "@mui/icons-material/Cancel";
import { NotificationContext } from "@/contexts/NotificationProvider";

const MentorMenteesList = () => {
  const [mentees, setMentees] = useState([]);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [dialogType, setDialogType] = useState("");
  const { setLoading } = useContext(LoadingContext);
  const { updatePendingMenteeApprovals } = useContext(NotificationContext);
  const router = useRouter();

  useEffect(() => {
    fetchMentees();
  }, []);

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

  const handleMenteeAction = async (action) => {
    if (!selectedMentee) return;
    try {
      setLoading(true);
      let payload = {
        email: selectedMentee.email,
        mentorApprovalStatus: action === "approve" ? true : null,
        mentorId: action === "reject" ? null : undefined,
      };

      await updateUser(payload);
      setOpenDialog(false);
      setSelectedMentee(null);
      await fetchMentees();
      const user = await fetchCurrentUser();
      console.log("user id --> ",user._id);
      
      await updatePendingMenteeApprovals(user._id);
    } catch (error) {
      console.error(`Failed to ${action} mentee:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mentee, type) => {
    setSelectedMentee(mentee);
    setDialogType(type);
    setOpenDialog(true);
  };

  const navigateToCourse = (mentee) => {
    router.push(`/admin/menteeManagement/${mentee._id}`);
  };

  return (
    <Layout>
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Mentees List
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Occupation</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>SLMC Reg Number</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mentees.length > 0 ? (
                mentees.map((mentee, index) => (
                  <TableRow
                    key={index}
                    hover
                    style={{ cursor: "pointer" }}
                    onClick={() => navigateToCourse(mentee)}
                  >
                    <TableCell>
                      {mentee.fullName || `${mentee.firstName} ${mentee.lastName}`}
                    </TableCell>
                    <TableCell>{mentee.occupation}</TableCell>
                    <TableCell>
                      {mentee.city}, {mentee.district}
                    </TableCell>
                    <TableCell>{mentee.contactNumber}</TableCell>
                    <TableCell>{mentee.slmcRegNumber || "N/A"}</TableCell>
                    <TableCell>
                      {mentee?.mentorApprovalStatus !== true && (
                        <>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(mentee, "approve");
                            }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(mentee, "reject");
                            }}
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography align="center">No mentees found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            Confirm {dialogType === "approve" ? "Approval" : "Rejection"}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {dialogType === "approve" ? "approve" : "reject"} mentorship for {selectedMentee?.fullName || `${selectedMentee?.firstName} ${selectedMentee?.lastName}`}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={() => handleMenteeAction(dialogType)}
              color="primary"
            >
              {dialogType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default MentorMenteesList;
