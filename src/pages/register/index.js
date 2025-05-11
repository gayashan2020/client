import { useState, useContext } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  Container,
  Typography,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormHelperText,
  Box,
  keyframes,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme as theme } from "@/styles/theme";
import { userRoles } from "@/assets/constants/authConstants";
import citiesAndPostalCodes from "../../assets/constants/cities-and-postalcode-by-district.json";
import {
  GENDER_OPTIONS,
  BATCH_OPTIONS,
  FACULTY_OPTIONS,
} from "@/assets/constants/studentConstants";
import {
  OCCUPATION_OPTIONS,
  OCCUPATION_OPTIONS_STUDENT,
} from "@/assets/constants/adminConstants";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { LoadingContext } from "@/contexts/LoadingContext";
import { errorOutlineStyle } from "@/styles/theme";
import { Email } from "../../../emails/basicTemplate";
import { sendEmail } from "@/services/users";
import { createSetting } from "@/services/setting";
import { render } from "@react-email/render";

// Reused animations
const scaleUp = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export default function UnifiedRegisterForm() {
  const router = useRouter();
  const [userType, setUserType] = useState(userRoles.STUDENT);
  const { setLoading } = useContext(LoadingContext);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  // Common state
  const [formData, setFormData] = useState({
    password: "",
    fullName: "",
    initialsName: "",
    gender: "",
    email: "",
    occupation: "",
    district: "",
    city: "",
    nicOrPassport: "",
    contactNumber: "",
    // Student specific
    batch: "",
    faculty: "",
    facultyRegNumber: "",
    currentStation: "",
    // Mentor specific
    slmcRegNumber: "",
    workingStation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    // Required fields validation
    if (!formData.password) newErrors.password = true;
    if (!formData.fullName) newErrors.fullName = true;
    // if (!formData.initialsName) newErrors.initialsName = true;
    if (!formData.gender) newErrors.gender = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.occupation) newErrors.occupation = true;
    if (!formData.district) newErrors.district = true;
    if (!formData.city) newErrors.city = true;
    if (!formData.nicOrPassport) newErrors.nicOrPassport = true;
    if (!formData.contactNumber) newErrors.contactNumber = true;

    // Conditional fields based on user type
    if (userType === userRoles.STUDENT) {
      if (!formData.batch) newErrors.batch = true;
      if (!formData.faculty) newErrors.faculty = true;
      if (!formData.facultyRegNumber) newErrors.facultyRegNumber = true;
      if (!formData.currentStation) newErrors.currentStation = true;
    } else {
      if (!formData.slmcRegNumber) newErrors.slmcRegNumber = true;
      if (!formData.workingStation) newErrors.workingStation = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setOpen(true);
      return;
    }

    try {
      // Send a POST request to the /api/register endpoint with the form data
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: userType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error registering: ${response.status}`);
      }

      const data = await response.json();

      // Reset form
      setFormData({
        password: "",
        fullName: "",
        initialsName: "",
        gender: "",
        email: "",
        occupation: "",
        district: "",
        city: "",
        nicOrPassport: "",
        contactNumber: "",
        batch: "",
        faculty: "",
        facultyRegNumber: "",
        currentStation: "",
        slmcRegNumber: "",
        workingStation: "",
      });

      setLoading(true);

      // Send confirmation email
      try {
        const emailHtml = render(
          <Email
            email={formData.email}
            password={formData.password}
            fullName={formData.fullName}
          />
        );

        const options = {
          to: formData.email,
          subject: "Email Confirmation",
          html: emailHtml,
        };

        await sendEmail(options);
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("Failed to send confirmation email.");
      }
      await createSetting(data.userId);
      setLoading(false);

      // Show success message and redirect
      toast.success("Registration successful!");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Get cities based on selected district with safety check
  const getCities = () => {
    if (!formData.district) return [];
    return (
      citiesAndPostalCodes[formData.district]?.map((item) => item.city) || []
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: `linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)`,
          py: 8,
        }}
      >
        <Container component="main" maxWidth="md">
          <Card
            sx={{
              padding: 4,
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(44, 102, 110, 0.1)",
              animation: `${scaleUp} 0.6s ease-out`,
              borderBottom: "4px solid #ff7f50",
            }}
          >
            <Typography
              component="h1"
              variant="h3"
              align="center"
              sx={{
                color: "#2C666E",
                fontWeight: 700,
                mb: 4,
                position: "relative",
                "&:after": {
                  content: '""',
                  display: "block",
                  width: "60px",
                  height: "4px",
                  backgroundColor: "#ff7f50",
                  margin: "16px auto 0",
                },
              }}
            >
              {userType === userRoles.STUDENT ? "Student" : "Mentor"}{" "}
              Registration
            </Typography>

            {/* User Type Toggle */}
            <ToggleButtonGroup
              color="primary"
              value={userType}
              exclusive
              onChange={(e, newType) => setUserType(newType)}
              fullWidth
              sx={{ mb: 4 }}
            >
              <ToggleButton
                value={userRoles.STUDENT}
                sx={{
                  backgroundColor:
                    userType === userRoles.STUDENT ? "#2C666E" : "inherit",
                  color: userType === userRoles.STUDENT ? "white" : "#2C666E",
                  "&:hover": {
                    backgroundColor:
                      userType === userRoles.STUDENT ? "#1a4a52" : "#f0f0f0",
                  },
                }}
              >
                Student
              </ToggleButton>
              <ToggleButton
                value={userRoles.MENTOR}
                sx={{
                  backgroundColor:
                    userType === userRoles.MENTOR ? "#2C666E" : "inherit",
                  color: userType === userRoles.MENTOR ? "white" : "#2C666E",
                  "&:hover": {
                    backgroundColor:
                      userType === userRoles.MENTOR ? "#1a4a52" : "#f0f0f0",
                  },
                }}
              >
                Mentor
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Common Fields */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    sx={errors.fullName ? errorOutlineStyle : {}}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name with Initials"
                    name="initialsName"
                    value={formData.initialsName}
                    onChange={handleChange}
                    sx={errors.initialsName ? errorOutlineStyle : {}}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={errors.email ? errorOutlineStyle : {}}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={errors.password ? errorOutlineStyle : {}}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    sx={errors.contactNumber ? errorOutlineStyle : {}}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="NIC or Passport Number"
                    name="nicOrPassport"
                    value={formData.nicOrPassport}
                    onChange={handleChange}
                    sx={errors.nicOrPassport ? errorOutlineStyle : {}}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      sx={errors.gender ? errorOutlineStyle : {}}
                    >
                      {GENDER_OPTIONS.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Occupation</InputLabel>
                    <Select
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      sx={errors.occupation ? errorOutlineStyle : {}}
                    >
                      {userType === userRoles.STUDENT
                        ? OCCUPATION_OPTIONS_STUDENT.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))
                        : OCCUPATION_OPTIONS.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Conditional Fields */}
                {userType === userRoles.STUDENT ? (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Faculty Registration Number"
                        name="facultyRegNumber"
                        value={formData.facultyRegNumber}
                        onChange={handleChange}
                        sx={errors.facultyRegNumber ? errorOutlineStyle : {}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Current Station"
                        name="currentStation"
                        value={formData.currentStation}
                        onChange={handleChange}
                        sx={errors.currentStation ? errorOutlineStyle : {}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Batch</InputLabel>
                        <Select
                          name="batch"
                          value={formData.batch}
                          onChange={handleChange}
                          sx={errors.batch ? errorOutlineStyle : {}}
                        >
                          {BATCH_OPTIONS.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Faculty</InputLabel>
                        <Select
                          name="faculty"
                          value={formData.faculty}
                          onChange={handleChange}
                          sx={errors.faculty ? errorOutlineStyle : {}}
                        >
                          {FACULTY_OPTIONS.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="SLMC Registration Number"
                        name="slmcRegNumber"
                        value={formData.slmcRegNumber}
                        onChange={handleChange}
                        sx={errors.slmcRegNumber ? errorOutlineStyle : {}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Working Station"
                        name="workingStation"
                        value={formData.workingStation}
                        onChange={handleChange}
                        sx={errors.workingStation ? errorOutlineStyle : {}}
                      />
                    </Grid>
                  </>
                )}

                {/* Common Fields Continued */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>District</InputLabel>
                    <Select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      sx={errors.district ? errorOutlineStyle : {}}
                    >
                      {Object.keys(citiesAndPostalCodes).map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>City</InputLabel>
                    <Select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      sx={errors.city ? errorOutlineStyle : {}}
                      disabled={!formData.district}
                    >
                      {getCities().map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      backgroundColor: "#2C666E",
                      "&:hover": {
                        backgroundColor: "#1a4a52",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Register
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    href="/login"
                    variant="outlined"
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      borderColor: "#2C666E",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#27548A",
                        color: "white",
                      },
                    }}
                  >
                    Already have an account? Login
                  </Button>
                </Grid>
              </Grid>
            </form>

            {/* Error Dialog */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                Missing Information
              </DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ textAlign: "center", mb: 2 }}>
                  Please fill in all required fields
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                  onClick={handleClose}
                  sx={{
                    backgroundColor: "#ff7f50",
                    "&:hover": { backgroundColor: "#ff6b3a" },
                  }}
                  variant="contained"
                >
                  Okay
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
