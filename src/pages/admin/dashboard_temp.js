// pages/admin/dashboard.js
import styles from "../../styles/Dashboard.module.css";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
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
  AssignmentInd,
  Message,
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
import { userRoles } from "@/assets/constants/authConstants";
// import { useTheme } from "@mui/material/styles";
// import { PieChartComponent } from "@/components/PieChartComponent";
import { BarChartComponent } from "@/components/BarChartComponent";
import {
  getOccupationData,
  getCityData,
  getUserData,
  fetchRegisteredCourses,
  fetchRegisteredCoursesByUser,
  getUserCount,
  getUserCoursesCount,
} from "@/services/dashboard";
import { getSettingByID } from "@/services/setting";
import { fetchCourses } from "@/services/courses";

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

  const [courses, setCourses] = useState([]);

  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);
  const [enrolledUsersPerCourse, setEnrolledUsersPerCourse] = useState({
    names: [],
    counts: [],
  });
  const [registeredCourses, setRegisteredCourses] = useState({
    names: [],
    counts: [],
  });

  const [onlineUserCountByRole, setOnlineUserCountByRole] = useState({
    admin: 0,
    mentor: 0,
    student: 0,
    cpd_provider: 0,
  });

  const [coursesCount, setCoursesCount] = useState({
    totalEnrolledCourses: 0,
    totalApprovedCourses: 0,
    courseDetails: [],
  });

  const [setting, setSetting] = useState(null);
  const [yearlyCPD, setYearlyCPD] = useState(0);
  const [monthlyCPD, setMonthlyCPD] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        if (currentUser?._id) {
          fetchRegisteredCoursesData(currentUser._id, currentUser.role);
        }
        fetchSettings(currentUser?._id);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
    fetchData();
    getAllCourses();
  }, [setLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUserData();
      const countData = await getUserCount();
      const courseCountData = await getUserCoursesCount();
      setOnlineUserCountByRole(countData?.onlineUserCountByRole);
      setCoursesCount(courseCountData);
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
      // Handle error appropriately, perhaps set some error state
    }
  };

  const getAllCourses = async () => {
    setLoading(true);
    const response = await fetchCourses();
    console.log(response, "response");
    setLoading(false);
    if (response) {
      setCourses(response);
    } else {
      console.error("Failed to fetch courses");
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
      <Typography
        variant="body2"
        style={{ fontWeight: "bold", marginTop: "10px" }}
      >
        {label}
      </Typography>
      <Box display="flex" alignItems="center">
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

  const fetchSettings = async (id) => {
    const settings = await getSettingByID(id);
    setSetting(settings?.body);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const monthlyTarget =
      settings?.body?.cpdTarget?.[currentYear]?.[currentMonth]?.monthly || 0;
    const yearlyTarget =
      settings?.body?.cpdTarget?.[currentYear]?.[currentMonth]?.yearly || 0;
    setMonthlyCPD(monthlyTarget);
    setYearlyCPD(yearlyTarget);
  };

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
      sx={{
        display: "flex",
        justifyContent: "space-around",
        padding: "40px 20px",
        "& .roleBox": {
          // Adding a className for reference
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "transform 0.4s ease-in-out", // Smooth transition for transform
          "&:hover": {
            transform: "scale(1.1)", // Scale up box slightly on hover
            cursor: "pointer", // Change cursor to indicate clickable
          },
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        onClick={() =>
          router.push(routes.ADMIN_USERS_SITE_ADMIN_USER_MANAGEMENT)
        }
        className="roleBox"
      >
        <AccountBox fontSize="large" />
        <Typography>Admin</Typography>
      </Box>
      <Badge
        badgeContent={pendingApprovalCount.student}
        color="error"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          onClick={() =>
            router.push(routes.ADMIN_USERS_STUDENTS_USER_MANAGEMENT)
          }
          className="roleBox"
        >
          <School fontSize="large" />
          <Typography>Mentee</Typography>
        </Box>
      </Badge>
      <Badge
        badgeContent={pendingApprovalCount.mentor}
        color="error"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          onClick={() =>
            router.push(routes.ADMIN_USERS_MENTORS_USER_MANAGEMENT)
          }
          className="roleBox"
        >
          <People fontSize="large" />
          <Typography>Mentor</Typography>
        </Box>
      </Badge>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        onClick={() =>
          router.push(routes.ADMIN_USERS_CPD_PROVIDERS_USER_MANAGEMENT)
        }
        className="roleBox"
      >
        <Business fontSize="large" />
        <Typography>CPD Provider</Typography>
      </Box>
    </Card>
  );

  const navigateToCourse = (course) => {
    // Navigate to the dynamic route for course details
    // router.push(`/admin/courses/${categoryId}/${coursesCount?.courseDetails?._id}`);
    console.log("route");
  };

  const navigateShortCuts = (type) => {
    if (type === "course" && user?.role === userRoles.SITE_ADMIN) {
      router.push(routes.ADMIN_COURSES);
    } else if (type === "course" && user?.role === userRoles.STUDENT) {
      router.push(routes.ADMIN_COURSES);
    } 
  };

  const cardStyle = {
    width: 250, // You can set this to the size you desire
    height: 400, // Making the height the same as width to create a square
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // This centers the content horizontally
    textAlign: "center", // Ensures text is centered within the content area
    margin: "20px", // Add some space between the content and the card
  };

  return (
    <div className={styles.layout}>
      <div className={styles.topRow}>
        <div className={styles.profile}>
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
                    backgroundColor: "white",
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
                style={{ paddingTop: "18%" }}
              >
                {user?.fullName?user.fullName:user?.firstName?user.firstName + " " + user.lastName:user?.institution}
              </Typography>
              <Typography
                variant="subtitle1"
                style={{ color: "#aaaaaa" }}
                align="center"
              >
                {user?.role.replace('_', ' ')}
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
        </div>
        <div className={styles.cpd}>
          <div className={styles.cpdItem}>
            <Card
              style={{
                backgroundColor: "#2e2e2e",
                color: "white",
                height: "100%",
                width: "100%",
                alignContent: "center",
              }}
            >
              {user?.role&& user.role === userRoles.STUDENT && (<CardContent>
                <CPDProgressBar
                  label="Monthly CPD target"
                  value={setting?.currentCPD}
                  max={monthlyCPD}
                />
                <CPDProgressBar
                  label="Yearly CPD target"
                  value={setting?.currentCPD}
                  max={yearlyCPD}
                />
              </CardContent>)}
              <CardContent
                style={{ display: "flex", justifyContent: "center" }}
              >
                {user?.role&& user.role === userRoles.ADMIN && (<Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    paddingX: "2vh",
                    "&:hover .icon, &:hover .text": {
                      color: "primary.main", // Change to your desired hover color
                      transform: "scale(1.1)", // Scale the icon and text on hover
                      transition: "transform 0.3s ease-in-out", // Smooth transition
                    },
                  }}
                  onClick={() => {
                    router.push(routes.ADMIN_USERS_SITE_ADMIN_USER_MANAGEMENT);
                  }}
                >
                  <AssignmentInd
                    className="icon"
                    sx={{
                      fontSize: 60,
                      marginBottom: 1,
                    }}
                  />
                  <Typography className="text" align="center">
                    Manage Users
                  </Typography>
                </Box>)}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    paddingX: "2vh",
                    "&:hover .icon, &:hover .text": {
                      color: "primary.main", // Change to your desired hover color
                      transform: "scale(1.1)", // Scale the icon and text on hover
                      transition: "transform 0.3s ease-in-out", // Smooth transition
                    },
                  }}
                  onClick={() => {
                    navigateShortCuts("course");
                  }}
                >
                  <School
                    className="icon"
                    sx={{
                      fontSize: 60,
                      marginBottom: 1,
                    }}
                  />
                  <Typography className="text" align="center">
                    Courses
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    paddingX: "2vh",
                    "&:hover .icon, &:hover .text": {
                      color: "primary.main", // Change to your desired hover color
                      transform: "scale(1.1)", // Scale the icon and text on hover
                      transition: "transform 0.3s ease-in-out", // Smooth transition
                    },
                  }}
                  onClick={() => {
                    router.push(routes.ADMIN_CHAT);
                  }}
                >
                  <Message
                    className="icon"
                    sx={{
                      fontSize: 60,
                      marginBottom: 1,
                    }}
                  />
                  <Typography className="text" align="center">
                    Messages
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div className={styles.cpdItem}>
            <p>CPD Chart</p>
          </div>
        </div>
        <div className={styles.cards}>
          <div className={styles.card}>
            <p className={styles.roleName}>Mentors</p>
            <p className={styles.roleCount}>
              {onlineUserCountByRole.mentor || 0}
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.roleName}>Students</p>
            <p className={styles.roleCount}>
              {onlineUserCountByRole.student || 0}
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.roleName}>Admins</p>
            <p className={styles.roleCount}>
              {onlineUserCountByRole.admin || 0}
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.roleName}>CPD Providers</p>
            <p className={styles.roleCount}>
              {onlineUserCountByRole.cpd_provider || 0}
            </p>
          </div>
          {user?.role && user?.role === userRoles.STUDENT && (
            <>
              <div className={styles.card}>
                <p className={styles.roleName}>Total Approved Courses</p>
                <p className={styles.roleCount}>
                  {coursesCount.totalApprovedCourses}
                </p>
              </div>
              <div className={styles.card}>
                <p className={styles.roleName}>Total Enrolled Courses</p>
                <p className={styles.roleCount}>
                  {coursesCount.totalEnrolledCourses}
                </p>
              </div>
            </>
          )}
          {user?.role &&
            (user?.role === userRoles.SUPER_ADMIN ||
              user?.role === userRoles.ADMIN) && (
              <>
                <div className={styles.card}>
                  <p className={styles.roleName}>Total Courses</p>
                  <p className={styles.roleCount}>{courses?.length}</p>
                </div>
              </>
            )}
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.info}>
          <p>Mentor Info Section</p>
        </div>
        <div className={styles.chart}>
          {coursesCount?.courseDetails?.map((course, index) => (
            <Card
              key={index}
              sx={cardStyle}
              onClick={() => navigateToCourse(course)}
            >
              <CardActionArea
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  height: "100%",
                }}
              >
                {course.courseImage && (
                  <CardMedia
                    component="img"
                    image={course.courseImage}
                    alt={course.courseName}
                  />
                )}
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {course.courseName}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                  >
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      Duration:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight="fontWeightMedium"
                    >
                      {course.courseDuration} hours
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      CPD Total:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight="fontWeightMedium"
                    >
                      {course.courseCpdTotal} points
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      CPD Minimum:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight="fontWeightMedium"
                    >
                      {course.courseCpdMin} points
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="body2" color="text.secondary" mr={1}>
                      Type:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight="fontWeightMedium"
                    >
                      {course.courseCategory}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
