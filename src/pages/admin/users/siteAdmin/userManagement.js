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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Grid,
  Chip,
} from "@mui/material";
import Layout from "@/components/Layout";
import { userRoles, userStatus } from "@/assets/constants/authConstants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { LoadingContext } from "@/contexts/LoadingContext";
import { PersonAdd, AccountBox, People, School, Business } from "@mui/icons-material";
import { routes } from "@/assets/constants/routeConstants";
import { useRouter } from "next/router";
import { approveUser } from "@/services/users";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function UserManagement() {
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [addUser, setAddUser] = useState(false);
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
  const [selectedRole, setSelectedRole] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState("");

  useEffect(() => {
    fetchData(selectedRole);
  }, [selectedRole]);

  const fetchData = async (role) => {
    console.log("fetching data", role);
    try {
      setLoading(true);
      const response = await fetch("/api/users/allUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter: "", role: role }), // Fetch all users
      });
      setLoading(false);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/users/updateUser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
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
      toast.success("Update successful!");
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
      fetchData(selectedRole);
      setEditOpen(false);
    } else {
      console.log("Failed to update");
      toast.error("Update failed.");
    }
  };

  const handleEditOpen = (user) => {
    setEditUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setGender(user.gender);
    setEmail(user.email);
    setOccupation(user.occupation);
    setDistrict(user.district);
    setCity(user.city);
    setCurrentStation(user.currentStation);
    setNicOrPassport(user.nicOrPassport);
    setContactNumber(user.contactNumber);
    setBatch(user.batch);
    setFaculty(user.faculty);
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAddOpen = () => setAddUser(true);

  const handleAddClose = () => setAddUser(false);

  const handleConfirm = async (reason) => {
    if (selectedUser && dialogState) {
      setLoading(true);
      let approval = {
        email: selectedUser.email,
        status: dialogState === "reject" ? userStatus.DELETED_NO_APPEAL.value : userStatus.ACTIVE.value,
        reason: dialogState === "reject" ? reason : null,
      };
      const response = await approveUser(approval);
      setLoading(false);

      if (response.ok) {
        toast.success(`User ${dialogState}ed successfully!`);
        fetchData(selectedRole);
      } else {
        toast.error(`Failed to ${dialogState} user.`);
      }
      setDialogOpen(false);
      setSelectedUser(null);
      setDialogState("");
    }
  };

  const openConfirmationDialog = (user, state) => {
    setSelectedUser(user);
    setDialogOpen(true);
    setDialogState(state);
  };

  const closeConfirmationDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setDialogState("");
  };

  return (
    <Layout>
      <Grid container alignItems="center">
        <Grid item xs={6} md={4} lg={1} sx={{ display: "flex", justifyContent: "center" }}>
          <PersonAdd
            onClick={() => handleAddOpen()}
            sx={{
              cursor: "pointer",
              fontSize: 40,
              "&:hover": {
                color: "primary.main",
                transform: "scale(1.1)",
                transition: "transform 0.3s ease-in-out",
              },
            }}
          />
        </Grid>
        <Grid item xs={6} md={8} lg={11}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Filter by Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Filter by Role"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={userRoles.ADMIN}>Admin</MenuItem>
              <MenuItem value={userRoles.STUDENT}>Student</MenuItem>
              <MenuItem value={userRoles.MENTOR}>Mentor</MenuItem>
              <MenuItem value={userRoles.CPD_PROVIDER}>CPD Provider</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const statusKey = user.status ? user.status.toUpperCase() : "";
              const statusInfo = userStatus[statusKey];
              return (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName ? user.fullName : user.institution}</TableCell>
                  <TableCell>{user?.role?.replace("_", " ")}</TableCell>
                  <TableCell>{user.district}</TableCell>
                  <TableCell>{user.contactNumber}</TableCell>
                  <TableCell>{user.batch}</TableCell>
                  <TableCell>{user.faculty}</TableCell>
                  <TableCell>
                    {statusInfo ? <Chip label={statusInfo.label} style={statusInfo.style} /> : <></>}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(user)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleEditOpen(user)}>
                      <EditIcon />
                    </IconButton>
                    {(!user.status || user.status !== userStatus.ACTIVE.value) && (
                      <IconButton color="primary" onClick={() => openConfirmationDialog(user, "approve")}>
                        <CheckCircleIcon style={{ color: "green" }} />
                      </IconButton>
                    )}
                    {(!user.status || user.status !== userStatus.ACTIVE.value) &&
                      user.status !== userStatus.DELETED_NO_APPEAL.value && (
                        <IconButton color="primary" onClick={() => openConfirmationDialog(user, "reject")}>
                          <CancelIcon style={{ color: "red" }} />
                        </IconButton>
                      )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
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

      <Modal open={editOpen} onClose={handleEditClose} aria-labelledby="edit-modal-title" aria-describedby="edit-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: "90vh",
            overflow: "auto",
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
              <Button type="submit" fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                Update
              </Button>
            </form>
          )}
        </Box>
      </Modal>

      <Modal open={addUser} onClose={handleAddClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User Details
          </Typography>
          <Card
            variant="outlined"
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "40px 20px",
            }}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              padding: "40px 20px",
              "& .roleBox": {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.4s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                  cursor: "pointer",
                },
              },
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center" onClick={() => router.push(routes.ADMIN_USERS_SITE_ADMIN_REGISTER)} className="roleBox">
              <AccountBox fontSize="large" />
              <Typography>Admin</Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" onClick={() => router.push(routes.ADMIN_USERS_STUDENTS_REGISTER)} className="roleBox">
              <School fontSize="large" />
              <Typography>Mentee</Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" onClick={() => router.push(routes.ADMIN_USERS_MENTORS_REGISTER)} className="roleBox">
              <People fontSize="large" />
              <Typography>Mentor</Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" onClick={() => router.push(routes.ADMIN_USERS_CPD_PROVIDERS_REGISTER)} className="roleBox">
              <Business fontSize="large" />
              <Typography>CPD Provider</Typography>
            </Box>
          </Card>
        </Box>
      </Modal>
      
      <ConfirmationDialog
        open={dialogOpen}
        handleClose={closeConfirmationDialog}
        handleConfirm={handleConfirm}
        title="Confirmation"
        content={`Do you really want to ${dialogState} this user?`}
        dialogState={dialogState}
      />
    </Layout>
  );
}
