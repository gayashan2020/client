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
  Tooltip,
  Paper,
  Badge,
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
  CameraAlt,
} from "@mui/icons-material";
import Layout from "../../../components/Layout";
import { useEffect, useState, useContext } from "react";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "next/router";
import { routes } from "@/assets/constants/routeConstants";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { updateUser, updateAvatar } from "@/services/users";
import { userRoles } from "@/assets/constants/authConstants";
import { BarChartComponent } from "@/components/BarChartComponent";
import {
  getOccupationData,
  getCityData,
  getUserData,
  fetchRegisteredCourses,
  fetchRegisteredCoursesByUser,
} from "@/services/dashboard";
import { updateYearlyCpd, updateMonthlyCpd, getSettingByID, fetchMonthlyCpd, fetchYearlyCpd } from "@/services/setting"; // Import the new services

export default function Index() {
  const [user, setUser] = useState(null);
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

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

  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);
  const [enrolledUsersPerCourse, setEnrolledUsersPerCourse] = useState({
    names: [],
    counts: [],
  });
  const [registeredCourses, setRegisteredCourses] = useState({
    names: [],
    counts: [],
  });
  const [setting, setSetting] = useState(null);
  const [yearlyCPD, setYearlyCPD] = useState(0);
  const [monthlyCPD, setMonthlyCPD] = useState(0);

  const [cpdOpen, setCPDOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        if (currentUser?._id) {
          fetchRegisteredCoursesData(currentUser._id, currentUser.role);
        }
        fetchSettings(currentUser?._id);
        handleEditOpen(currentUser);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
    fetchData();
  }, [setLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUserData();
      setLoading(false);
      if (data) {
        setPendingApprovalCount(data?.pendingApprovalByRole);
        const courseNames = data?.enrolledUsersPerCourse.map(
          (item) => item.courseName
        );
        const userCounts = data?.enrolledUsersPerCourse.map(
          (item) => item.enrolledUsersCount
        );
        setEnrolledUsersPerCourse({ names: courseNames, counts: userCounts });
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchRegisteredCoursesData = async (userId, role) => {
    try {
      setLoading(true);
      if (role === userRoles.MENTOR) {
        const registeredCoursesData = await fetchRegisteredCourses(userId);
        const courseNames = registeredCoursesData.map(
          (item) => item.courseName
        );
        const userCounts = registeredCoursesData.map((item) => item.userCount);
        setRegisteredCourses({ names: courseNames, counts: userCounts });
        setLoading(false);
      } else {
        const registeredCoursesData = await fetchRegisteredCoursesByUser(
          userId
        );
        const courseNames = registeredCoursesData.map(
          (item) => item.courseName
        );
        const userCounts = registeredCoursesData.map((item) => item.userCount);
        setRegisteredCourses({ names: courseNames, counts: userCounts });
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setLoading(false);
    }
  };

  const fetchSettings = async (id) => {
    try {
      const setting = await getSettingByID(id);
      setSetting(setting?.body);
      
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
  
      const yearlyCpdData = await fetchYearlyCpd(setting?.body?._id, currentYear);
      const monthlyCpdData = await fetchMonthlyCpd(setting?.body?._id, currentYear, currentMonth);
  
      setYearlyCPD(yearlyCpdData?.body?.yearlyTarget || 0);
      setMonthlyCPD(monthlyCpdData?.body?.monthlyTarget || 0);
    } catch (error) {
      console.error("Error fetching CPD data:", error);
    }
  };
  

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setLoading(true);
      const response = await updateAvatar(user._id, file);
      setLoading(false);
      if (response.status === 200) {
        toast.success("Avatar updated successfully!");
      } else {
        toast.error("Failed to update avatar.");
      }
    }
  };

  const handleEditOpen = (user) => {
    setEditUser(user);
    setFirstName(user.fullName);
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

      setEditOpen(false);
      toast.success("Update successful!");
    } else {
      toast.error("Update failed.");
    }
  };

  const handleSubmitCPD = async (event) => {
    event.preventDefault();

    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      setLoading(true);
      await updateYearlyCpd(setting._id, year, yearlyCPD);
      console.log(setting._id, year, month,monthlyCPD);
      await updateMonthlyCpd(setting._id, month, monthlyCPD, year);
      setLoading(false);

      setCPDOpen(false);
      toast.success("CPD Targets updated successfully!");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update CPD Targets.");
    }
  };

  const handleCPDClose = () => setCPDOpen(false);

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

  return (
    <Layout>
      <Grid container style={{ minHeight: "100vh" }} spacing={4}>
        <Grid item xs={12} md={12} lg={7} container>
          <Card
            style={{
              backgroundColor: "#121212",
              color: "white",
              marginTop: "60px",
              marginBottom: "10px",
            }}
          >
            <CardContent>
              <Typography id="edit-modal-title" variant="h6" component="h2">
                Edit User Details
              </Typography>
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
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card
            style={{
              backgroundColor: "#121212",
              color: "white",
              borderRadius: "10px",
              overflow: "visible",
              position: "relative",
            }}
          >
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
              <Box
                style={{
                  position: "absolute",
                  top: 110,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                }}
              >
                <Button
                  component="label"
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: "white",
                    minWidth: 0,
                    padding: "10px",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "calc(100% - 10px)",
                    left: "calc(50% - 20px)",
                    boxShadow: 3,
                    "& .MuiButton-startIcon": {
                      margin: 0,
                    },
                    "& .MuiButton-label": {
                      display: "none",
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
              <List dense style={{ position: "relative", marginTop: "20px" }}>
                <Box
                  style={{
                    position: "absolute",
                    left: "50px",
                    top: 0,
                    bottom: 0,
                    width: "1px",
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
                        <Tooltip title={info.text} placement="top">
                          <Typography
                            type="body2"
                            sx={{
                              color: "white",
                              marginLeft: "45px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {info.text}
                          </Typography>
                        </Tooltip>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          <Grid item xs={12} md={12} lg={12}>
            <Card
              style={{
                backgroundColor: "#121212",
                color: "white",
                marginTop: "60px",
                marginBottom: "10px",
              }}
            >
              <CardContent>
                <CPDProgressBar
                  label="Monthly CPD target"
                  value={setting?.totalCpd}
                  max={monthlyCPD}
                />
                <CPDProgressBar
                  label="Yearly CPD target"
                  value={setting?.totalCpd}
                  max={yearlyCPD}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="monthlyCPD"
                  label="Monthly CPD Target"
                  name="monthlyCPD"
                  value={monthlyCPD}
                  onChange={(e) => setMonthlyCPD(e.target.value)}
                  required
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="yearlyCPD"
                  label="Yearly CPD Target"
                  name="yearlyCPD"
                  value={yearlyCPD}
                  onChange={(e) => setYearlyCPD(e.target.value)}
                  required
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Box display="flex" justifyContent="space-between" padding={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setCPDOpen(true)}
                sx={{
                  backgroundColor: "green",
                }}
              >
                Update CPD Targets
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={cpdOpen}
        onClose={handleCPDClose}
        aria-labelledby="cpd-modal-title"
        aria-describedby="cpd-modal-description"
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
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 2 }}>
            Do you wish to set your monthly CPD target to {monthlyCPD} and
            yearly CPD target to {yearlyCPD}?
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitCPD}
              sx={{ bgcolor: "blue", color: "white" }}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCPDClose}
              sx={{ bgcolor: "red", color: "white" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
}
