// pages/admin/dashboard.js

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  AccountBox,
  People,
  School,
  Business,
  CloudUpload,
  CameraAlt
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import { useEffect, useState, useContext } from "react";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "next/router";
import { routes } from "@/assets/constants/routeConstants";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { updateUser, updateAvatar } from "@/services/users";
// import { userRoles } from "@/assets/constants/authConstants";
// import { useTheme } from "@mui/material/styles";
// import { PieChartComponent } from "@/components/PieChartComponent";
// import { BarChartComponent } from "@/components/BarChartComponent";
// import { getOccupationData, getCityData } from "@/services/dashboard";

// export default function AdminDashboard() {
//     const [user, setUser] = useState(null);
//     const [occupationData, setOccupationData] = useState([]);
//     const [cityData, setCityData] = useState([{district: "", count: 0}]);

//     const { setLoading } = useContext(LoadingContext);

//     const theme = useTheme();

//     useEffect(() => {
//         const getUser = async () => {
//             setLoading(true);
//             try {
//                 const currentUser = await fetchCurrentUser();
//                 setUser(currentUser);
//             } catch (error) {
//                 console.error('Failed to fetch current user', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchData = async () => {
//             try {
//                 const data = await getOccupationData();
//                 if (data) {
//                     setOccupationData(data);
//                 } else {
//                     console.error('Failed to fetch occupation data');
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch occupation data', error);
//             }
//         };

//         const fetchCityData = async () => {
//             try {
//                 const data = await getCityData();
//                 console.log("getCityData",data);
//                 if (data) {
//                     setCityData(data);
//                 } else {
//                     console.error('Failed to fetch city data');
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch city data', error);
//             }
//         };

//         getUser();
//         fetchData();
//         fetchCityData();
//     }, []);

//     return (
//         <Layout>
//             <Grid container spacing={3} justifyContent="flex-start">
//                 <Grid item xs={12} lg={3}>
//                     <Box component="section">
//                         <h2>User Profile</h2>
//                         {user ? (
//                             <Card>
//                                 <CardContent>
//                                     <Typography variant="h5" component="div">
//                                         {(user.role === userRoles.MENTOR || user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN) ? user.fullName : `${user.firstName} ${user.lastName}`}
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Initials: {user.initialsName}
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Email: {user.email}
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Role: {user.role}
//                                     </Typography>
//                                 </CardContent>
//                             </Card>
//                         ) : (
//                             <p></p>
//                         )}
//                     </Box>
//                 </Grid>

//                 <Grid item xs={12} lg={5}>
//                     <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
//                         <Paper sx={{ padding: theme.spacing(2), boxSizing: 'border-box' }}>
//                             <PieChartComponent data={occupationData} />
//                         </Paper>
//                         <Paper sx={{ padding: theme.spacing(2), boxSizing: 'border-box' }}>
//                             <BarChartComponent data={cityData} />
//                         </Paper>
//                     </Box>
//                 </Grid>

//                 <Grid item xs={12} lg={4}>
//                     <Box component="section">
//                         <h2>User Details</h2>
//                         {user ? (
//                             <TableContainer component={Paper}>
//                                 <Table>
//                                     <TableBody>
//                                         <TableRow>
//                                             <TableCell>Gender</TableCell>
//                                             <TableCell>{user.gender}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell>Occupation</TableCell>
//                                             <TableCell>{user.occupation}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell>Working Station</TableCell>
//                                             <TableCell>{user.workingStation}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell>City</TableCell>
//                                             <TableCell>{user.city}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell>District</TableCell>
//                                             <TableCell>{user.district}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell>NIC or Passport Number</TableCell>
//                                             <TableCell>{user.nicOrPassport}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell>Contact Number</TableCell>
//                                             <TableCell>{user.contactNumber}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell>SLMC Registration Number</TableCell>
//                                             <TableCell>{user.slmcregNumber}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell>CPD Provider Registration Number</TableCell>
//                                             <TableCell>{user.cpdProviderRegNumber}</TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell>Official Address</TableCell>
//                                             <TableCell>{user.officialAddress}</TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         ) : (
//                             <p></p>
//                         )}
//                     </Box>
//                 </Grid>
//             </Grid>
//         </Layout>
//     );
// }

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [avatar, setAvatar] = useState(null); // State to store the selected file
  const [avatarPreview, setAvatarPreview] = useState(null); // State to store the preview URL

  const [fullName, setFirstName] = useState("");
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
    setLoading(true);
    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditOpen = (user) => {
    setEditUser(user); // Set the user to be edited
    setFirstName(user.fullName); // Update the firstName state
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

  const handleAvatarSubmit = async () => {
    // Send a PUT or POST request to the endpoint handling file uploads
    const response = await updateAvatar(user._id, avatar);

    // Handle the response from the file upload endpoint
    if (response.ok) {
      // Handle successful upload
      toast.success("Avatar updated successfully!");
      // Optionally, fetch the updated user data to refresh the avatar preview
    } else {
      // Handle errors
      toast.error("Failed to update avatar.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      email,
      fullName,
      gender,
      occupation,
      city,
      district,
      currentStation,
      nicOrPassport,
      contactNumber,
      batch,
      faculty,
    };
    setLoading(true);
    const response = await updateUser(userData);
    setLoading(false);

    if (response.ok) {
      await handleAvatarSubmit();
      // Show a toast message
      toast.success("Update successful!");

      // Clear the form
      setFirstName("");
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
      fetchCurrentUser()
        .then((currentUser) => {
          setUser(currentUser);
        })
        .catch((error) => {
          console.error("Failed to fetch current user", error);
        })
        .finally(() => {
          setLoading(false);
        });

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

  const handleEditClose = () => setEditOpen(false);

  const CPDProgressBar = ({ label, value, max }) => (
    <Box>
      <Typography variant="body2" style={{ fontWeight: "bold" }}>
        {label}
      </Typography>
      <Box display="flex" alignItems="center" style={{ padding: "10px" }}>
        <Box width="100%" mr={1}>
          <LinearProgress
            color="primary"
            variant="determinate"
            value={(value / max) * 100}
            style={{ height: "10px", borderRadius: "5px" }}
          />
        </Box>
        <Box minWidth={35}>
          <Typography
            variant="body2"
            color="white"
          >{`${value}/${max}`}</Typography>
        </Box>
      </Box>
    </Box>
  );

  const contactInfo = [
    { icon: Phone, text: user?.contactNumber, key: "phone" },
    { icon: AccountBox, text: user?.nicOrPassport, key: "nic" },
    {
      icon: Email,
      text: user?.email,
      key: "email",
    },
    {
      icon: LocationOn,
      text: user?.officialAddress || "Hospital 1, Kollupitiya, Colombo",
      key: "location",
    },
  ];

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const RoleCard = () => (
    <Card
      variant="outlined"
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "40px 20px",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        onClick={() =>
          router.push(routes.ADMIN_USERS_SITE_ADMIN_USER_MANAGEMENT)
        }
      >
        <AccountBox fontSize="large" />
        <Typography>Admin</Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        onClick={() => router.push(routes.ADMIN_USERS_STUDENTS_USER_MANAGEMENT)}
      >
        <School fontSize="large" />
        <Typography>Mentee</Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        onClick={() => router.push(routes.ADMIN_USERS_MENTORS_USER_MANAGEMENT)}
      >
        <People fontSize="large" />
        <Typography>Mentor</Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        onClick={() =>
          router.push(routes.ADMIN_USERS_CPD_PROVIDERS_USER_MANAGEMENT)
        }
      >
        <Business fontSize="large" />
        <Typography>CPD Provider</Typography>
      </Box>
    </Card>
  );

  return (
    <Layout>
      <Grid
        container
        style={{ minHeight: "100vh", marginLeft: "-15%" }}
        spacing={4}
      >
        <Grid item xs={12} md={6} lg={4}>
          <Card
            style={{
              backgroundColor: "#121212",
              color: "white",
              borderRadius: "10px", // Rounded corners for the card
              overflow: "visible", // Ensure that children can render outside the card
              position: "relative", // Position relative for absolute positioning of children
            }}
          >
            {/* Avatar Box */}
            <Box
              style={{
                position: "absolute",
                top: "-40px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
              }}
            >
              <Avatar
                src={avatarPreview || user?.image}
                sx={{
                  width: 150,
                  height: 150,
                  border: "3px solid #121212",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
                }}
              />
              {/* Upload Button Box */}
              <Box
                style={{
                  position: "absolute",
                  top: 110, // adjust this value as needed
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2, // above the avatar
                }}
              >
                <Button
                  component="label"
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor:"white",
                    minWidth: 0,
                    padding: "10px",
                    borderRadius: "50%", // Makes the button circular
                    position: "absolute", // Position the button absolutely
                    top: "calc(100% - 10px)", // Position it 20px from the bottom of the avatar
                    left: "calc(50% - 20px)", // Center it horizontally with respect to the avatar
                    boxShadow: 3, // Apply some shadow for better visibility
                    "& .MuiButton-startIcon": {
                      margin: 0, // Remove the margin from the start icon
                    },
                    "& .MuiButton-label": {
                      display: "none", // Hide the label
                    },
                  }}
                >
                  <CameraAlt />
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleAvatarChange}
                  />
                </Button>
              </Box>
            </Box>
            <CardContent style={{ marginTop: "60px" }}>
              <Typography
                variant="h5"
                component="div"
                align="center"
                style={{ paddingTop: "120px" }}
              >
                {user?.fullName}
              </Typography>
              <Typography
                variant="subtitle1"
                style={{ color: "#aaaaaa" }}
                align="center"
              >
                {user?.role}
              </Typography>
              {/* <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUpload />}
                style={{ alignContent: "center" }}
              >
                Upload New Avatar
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleAvatarChange}
                />
              </Button> */}
              <List dense style={{ position: "relative", marginTop: "20px" }}>
                {/* Vertical line container */}
                <Box
                  style={{
                    position: "absolute",
                    left: "50px", // Adjust as needed
                    top: 0,
                    bottom: 0,
                    width: "1px", // Line thickness
                    backgroundColor: "white",
                  }}
                />

                {contactInfo.map((info, index) => (
                  <ListItem key={info.key} style={{ padding: "8px 10px" }}>
                    <ListItemIcon
                      style={{
                        minWidth: "30px",
                        color: "white",
                        fontSize: "20px",
                      }}
                    >
                      <info.icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          type="body2"
                          style={{ color: "white", marginLeft: "45px" }}
                        >
                          {info.text}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={7} container>
          <Grid item xs={12} md={12} lg={12}>
            <Card
              style={{
                backgroundColor: "#121212",
                color: "white",
                marginTop: "60px",
              }}
            >
              <CardContent>
                <CPDProgressBar
                  label="Monthly CPD target"
                  value={user?.monthlyCPDPoints || 5}
                  max={user?.monthlyCPDMax || 8}
                />
                <CPDProgressBar
                  label="Yearly CPD target"
                  value={user?.yearlyCPDPoints || 21}
                  max={user?.yearlyCPDMax || 38}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <RoleCard />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Box display="flex" justifyContent="space-between" padding={2}>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                    backgroundColor:"red"
                }}
              >
                Reset Password
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEditOpen(user)}
                sx={{
                    backgroundColor:"green"
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      {/* Edit Profile model */}
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
                onChange={(e) => setFirstName(e.target.value)}
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
