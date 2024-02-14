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
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  AccountBox,
  People,
  School,
  Business,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import { useEffect, useState, useContext } from "react";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "next/router";
import { routes } from "@/assets/constants/routeConstants";
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

  const RoleCard = () => (
    <Card
      variant="outlined"
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "40px 20px",
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center"  onClick={() => router.push(routes.ADMIN_USERS_SITE_ADMIN_USER_MANAGEMENT)}>
        <AccountBox fontSize="large" />
        <Typography>Admin</Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center"  onClick={() => router.push(routes.ADMIN_USERS_STUDENTS_USER_MANAGEMENT)}>
        <School fontSize="large" />
        <Typography>Mentee</Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center"  onClick={() => router.push(routes.ADMIN_USERS_MENTORS_USER_MANAGEMENT)}>
        <People fontSize="large" />
        <Typography>Mentor</Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" onClick={() => router.push(routes.ADMIN_USERS_CPD_PROVIDERS_USER_MANAGEMENT)}>
        <Business fontSize="large" />
        <Typography>CPD Provider</Typography>
      </Box>
    </Card>
  );

  return (
    <Layout>
      <Grid container style={{ minHeight: "100vh" }} spacing={4}>
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
            {/* Box to contain the Avatar and give it a shadow */}
            <Box
              style={{
                position: "absolute", // Absolute position of the avatar
                top: "-40px", // Half of the avatar size to make it pop out
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1, // To lift the avatar above the Divider
              }}
            >
              <Avatar
                src={user?.image}
                sx={{
                  width: 150, // Size of the avatar
                  height: 150, // Size of the avatar
                  border: "3px solid #121212", // Border color matching the Card's background
                  boxShadow: "0 4px 8px rgba(0,0,0,0.5)", // Shadow effect for the 3D pop
                }}
              />
            </Box>
            <CardContent style={{ marginTop: "60px" }}>
              {" "}
              {/* Adjust this value based on the size of the Avatar */}
              <Typography
                variant="h5"
                component="div"
                align="center"
                style={{ paddingTop: "100px" }}
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
                color="primary"
                style={{ backgroundColor: "#1976d2", color: "white" }}
              >
                Reset Password
              </Button>
              <Button
                variant="outlined"
                style={{ borderColor: "white", color: "white" }}
              >
                Edit Profile
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}
