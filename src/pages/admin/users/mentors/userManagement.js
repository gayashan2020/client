import React, { useEffect, useState, useContext } from "react";
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
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import Layout from "@/components/Layout";
import { userRoles } from "@/assets/constants/authConstants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";
import { updateUser, fetchUsers, approveUser } from "@/services/users";
import { formatString } from "@/components/stringUtils";
import { OCCUPATION_OPTIONS } from "@/assets/constants/adminConstants";
import { LoadingContext } from "@/contexts/LoadingContext";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const { setLoading } = useContext(LoadingContext);

  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [fullName, setFullName] = useState("");
  const [initialsName, setInitialsName] = useState("");
  const [workingStation, setWorkingStation] = useState("");
  const [slmcRegNumber, setSlmcRegNumber] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers("", userRoles.MENTOR);
      setLoading(false);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      email,
      gender,
      occupation,
      city,
      district,
      contactNumber,
      fullName,
      initialsName,
      workingStation,
      slmcRegNumber,
      username,
    };
    setLoading(true);
    const response = await updateUser(userData);
    setLoading(false);

    if (response.ok) {
      // Show a toast message
      toast.success("Update successful!");

      // Clear the form
      setGender("");
      setEmail("");
      setDistrict("");
      setCity("");
      setContactNumber("");
      setFullName("");
      setInitialsName("");
      setWorkingStation("");
      setSlmcRegNumber("");
      setUsername("");

      // Update the table
      fetchData();

      // Close the modal
      setEditOpen(false);
    } else {
      console.log("Failed to update");
      toast.error("Update failed.");
    }
  };

  const handleEditOpen = (user) => {
    setEditUser(user); // Set the user to be edited
    setGender(user.gender); // Update the gender state
    setEmail(user.email); // Update the email state
    setContactNumber(user.contactNumber); // Update the contactNumber state
    setDistrict(user.district); // Update the district state
    setCity(user.city); // Update the city state
    setFullName(user.fullName);
    setInitialsName(user.initialsName);
    setWorkingStation(user.workingStation);
    setSlmcRegNumber(user.slmcRegNumber);
    setUsername(user.username);

    setEditOpen(true); // Open the modal
  };

  const handleEditClose = () => setEditOpen(false);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleApproval = async (user) => {
    if (window.confirm("Do you really want to approve this user?")) {
      setLoading(true);
      const response = await approveUser(user);
      setLoading(false);

      if (response.ok) {
        toast.success("User approved successfully!");
        fetchData();
      } else {
        toast.error("Failed to approve user.");
      }
    }
  };

  return (
    <>
      <Layout>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Occupation</TableCell>
                <TableCell>Working Station</TableCell>
                <TableCell>District</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{formatString(user.occupation)}</TableCell>
                  <TableCell>{user.workingStation}</TableCell>
                  <TableCell>{user.district}</TableCell>
                  <TableCell>{user.contactNumber}</TableCell>
                  <TableCell>{user.username}</TableCell>
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
                    {!user.approval && (
                      <IconButton color="primary" onClick={() => handleApproval(user)}>
                        <CheckCircleIcon />
                      </IconButton>
                    )}
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
                Initials Name: {selectedUser.initialsName} <br />
                Gender: {selectedUser.gender} <br />
                Email: {selectedUser.email} <br />
                City: {selectedUser.city} <br />
                NIC/Passport: {selectedUser.nicOrPassport} <br />
                SLMC Reg. Number: {selectedUser.slmcRegNumber}
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
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="initialsName"
                  label="Initials Name"
                  name="initialsName"
                  value={initialsName}
                  onChange={(e) => setInitialsName(e.target.value)}
                  required
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="workingStation"
                  label="Working Station"
                  name="workingStation"
                  value={workingStation}
                  onChange={(e) => setWorkingStation(e.target.value)}
                  required
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="slmcRegNumber"
                  label="SLMC Reg. Number"
                  name="slmcRegNumber"
                  value={slmcRegNumber}
                  onChange={(e) => setSlmcRegNumber(e.target.value)}
                  required
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                {/* <TextField
                  margin="normal"
                  fullWidth
                  id="occupation"
                  label="Occupation"
                  name="occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  required
                /> */}
                <FormControl fullWidth>
                  <InputLabel id="occupation-label">
                    Occupation
                  </InputLabel>
                  <Select
                    labelId="occupation-label"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    required
                  >
                    {OCCUPATION_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  id="contactNumber"
                  label="Contact Number"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
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
    </>
  );
}
