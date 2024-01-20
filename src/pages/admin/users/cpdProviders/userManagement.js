import React, { useEffect, useState } from "react";
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [currentStation, setCurrentStation] = useState("");
  const [nicOrPassport, setNicOrPassport] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [batch, setBatch] = useState("");
  const [faculty, setFaculty] = useState("");

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
        email, // Include the email to identify the user to update
        firstName,
        lastName,
        gender,
        occupation,
        city,
        district,
        currentStation,
        nicOrPassport,
        contactNumber,
        batch,
        faculty,
      }),
    });

    if (response.ok) {
      // Show a toast message
      toast.success("Update successful!");

      // Clear the form
      setFirstName("");
      setLastName("");
      setGender("");
      setEmail("");
      setOccupation("");
      setDistrict("");
      setCity("");
      setCurrentStation("");
      setNicOrPassport("");
      setContactNumber("");
      setBatch("");
      setFaculty("");

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
    setFirstName(user.firstName); // Update the firstName state
    setLastName(user.lastName); // Update the lastName state
    setGender(user.gender); // Update the gender state
    setEmail(user.email); // Update the email state
    setOccupation(user.occupation); // Update the occupation state
    setDistrict(user.district); // Update the district state
    setCity(user.city); // Update the city state
    setCurrentStation(user.currentStation); // Update the currentStation state
    setNicOrPassport(user.nicOrPassport); // Update the nicOrPassport state
    setContactNumber(user.contactNumber); // Update the contactNumber state
    setBatch(user.batch); // Update the batch state
    setFaculty(user.faculty); // Update the faculty state
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
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Current Station</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.occupation}</TableCell>
                <TableCell>{user.district}</TableCell>
                <TableCell>{user.currentStation}</TableCell>
                <TableCell>{user.contactNumber}</TableCell>
                <TableCell>{user.batch}</TableCell>
                <TableCell>{user.faculty}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(user)}>
                    <VisibilityIcon />
                  </IconButton>
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
      {/* View model */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User Details
          </Typography>
          {selectedUser && (
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Gender: {selectedUser.gender} <br />
              Email: {selectedUser.email} <br />
              City: {selectedUser.city} <br />
              NIC/Passport: {selectedUser.nicOrPassport} <br />
              Faculty Reg. Number: {selectedUser.facultyRegNumber}
            </Typography>
          )}
        </Box>
      </Modal>

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
                id="firstName"
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="gender"
                label="Gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
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
                id="occupation"
                label="Occupation"
                name="occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="district"
                label="District"
                name="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="city"
                label="City"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="currentStation"
                label="Current Station"
                name="currentStation"
                value={currentStation}
                onChange={(e) => setCurrentStation(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="nicOrPassport"
                label="NIC or Passport"
                name="nicOrPassport"
                value={nicOrPassport}
                onChange={(e) => setNicOrPassport(e.target.value)}
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
                id="batch"
                label="Batch"
                name="batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="faculty"
                label="Faculty"
                name="faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
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
