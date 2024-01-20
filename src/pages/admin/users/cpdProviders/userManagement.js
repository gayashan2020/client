import React, { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import Layout from "@/components/Layout";
import { userRoles } from "@/assets/constants/authConstants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [cpdProviderRegNumber, setCpdProviderRegNumber] = useState("");
  const [officialAddress, setOfficialAddress] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/users/allUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter: "", role: userRoles.CPD_PROVIDER }), // Fetch all users
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a PUT request to the /api/updateUser endpoint with the form data
    const response = await fetch("/api/users/updateUser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institution,
        email,
        contactNumber,
        officialAddress,
        username,
        cpdProviderRegNumber,
      }),
    });

    if (response.ok) {
      // Show a toast message
      toast.success("Update successful!");

      // Clear the form
      setInstitution("");
      setEmail("");
      setContactNumber("");
      setOfficialAddress("");
      setUsername("");
      setCpdProviderRegNumber("");

      // Update the table
      fetchData();

      // Close the modal
      setEditOpen(false);

      // Navigate to the login page
      toast.success("Update successful!");
      //   router.push("/login");
    } else {
      console.log("Failed to update");
      toast.error("Update failed.");
    }
  };

  const handleEditOpen = (user) => {
    setEditUser(user); // Set the user to be edited
    setInstitution(user.institution);
    setEmail(user.email);
    setContactNumber(user.contactNumber);
    setOfficialAddress(user.officialAddress);
    setUsername(user.username);
    setCpdProviderRegNumber(user.cpdProviderRegNumber);
    setEditOpen(true); // Open the modal
  };

  const handleEditClose = () => setEditOpen(false);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Layout>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Institution</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Official Address</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>CPD Provider</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.institution}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contactNumber}</TableCell>
                <TableCell>{user.officialAddress}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.cpdProviderRegNumber}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditOpen(user)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit model */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: "90vh", // 90% of the viewport height
            overflow: "auto", // Add a scrollbar when the content exceeds the maxHeight
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit User Details
          </Typography>
          {editUser && (
            <form>
              <TextField
                margin="normal"
                fullWidth
                id="username"
                label="User Name"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="officialAddress"
                label="Official Address"
                name="officialAddress"
                value={officialAddress}
                onChange={(e) => setOfficialAddress(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="institution"
                label="Institution"
                name="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="contactNumber"
                label="Contact Number"
                name="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="cpdProviderRegNumber"
                label="CPD Provider Reg Number"
                name="cpdProviderRegNumber"
                value={cpdProviderRegNumber}
                onChange={(e) => setCpdProviderRegNumber(e.target.value)}
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Update
              </Button>
            </form>
          )}
        </Box>
      </Modal>
    </Layout>
  );
}
