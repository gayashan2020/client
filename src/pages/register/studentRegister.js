import { useState, useContext } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Card,
  Container,
  Typography,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormHelperText,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import citiesAndPostalCodes from "../../assets/constants/cities-and-postalcode-by-district.json";
import { lightTheme as theme } from "@/styles/theme";
import {
  GENDER_OPTIONS,
  BATCH_OPTIONS,
  FACULTY_OPTIONS,
} from "@/assets/constants/studentConstants";
import { userRoles } from "@/assets/constants/authConstants";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { sendEmail } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { Email } from "../../../emails/basicTemplate";
import { render } from "@react-email/render";
import { createSetting } from "@/services/setting";
import { errorOutlineStyle } from "@/styles/theme";

export default function RegisterForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
  const [facultyRegNumber, setFacultyRegNumber] = useState("");
  const { setLoading } = useContext(LoadingContext);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!password) newErrors.password = true;
    if (!fullName) newErrors.fullName = true;
    // if (!lastName) newErrors.lastName = true;
    if (!gender) newErrors.gender = true;
    if (!email) newErrors.email = true;
    if (!occupation) newErrors.occupation = true;
    if (!district) newErrors.district = true;
    if (!city) newErrors.city = true;
    if (!currentStation) newErrors.currentStation = true;
    if (!nicOrPassport) newErrors.nicOrPassport = true;
    if (!contactNumber) newErrors.contactNumber = true;
    if (!batch) newErrors.batch = true;
    if (!faculty) newErrors.faculty = true;
    if (!facultyRegNumber) newErrors.facultyRegNumber = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setOpen(true);
      return;
    }

    // Send a POST request to the /api/register endpoint with the form data
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        fullName,
        // lastName,
        gender,
        email,
        occupation,
        city,
        district,
        currentStation,
        nicOrPassport,
        contactNumber,
        batch,
        faculty,
        facultyRegNumber,
        role: userRoles.STUDENT,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error registering: ${response.status}`);
    }

    if (response.ok) {
      const data = await response.json();
      // Show a toast message
      toast.success("Registration successful!");

      // Clear the form
      setPassword("");
      setFullName("");
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
      setFacultyRegNumber("");

      setLoading(true);
      const emailHtml = render(
        <Email
          email={email}
          password={password}
          fullName={fullName + " " + lastName}
        />
      );
      const options = {
        to: email,
        subject: "Email Confirmation",
        html: emailHtml,
      };

      await sendEmail(options);
      await createSetting(data.userId);
      setLoading(false);

      // Navigate to the login page
      toast.success("Registration successful!");
      router.push("/login");
    } else {
      console.log("Failed to register");
      toast.error("Registration failed.");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="s">
        <Card raised sx={{ marginTop: 8, padding: 2 }}>
          <Typography component="h1" variant="h4" align="center">
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  label="Name in Full"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  //required
                  fullWidth
                  error={!!errors.fullName}
                  helperText={errors.fullName ? "Name in Full is required" : ""}
                  sx={errors.fullName ? errorOutlineStyle : {}}
                />
              </Grid>
              {/*Column 1*/}
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email ? "Email is required" : ""}
                      sx={errors.email ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      error={!!errors.district}
                    >
                      <InputLabel>Home District</InputLabel>
                      <Select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        label="District"
                        sx={errors.district ? errorOutlineStyle : {}}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {Object.keys(citiesAndPostalCodes).map((district) => (
                          <MenuItem key={district} value={district}>
                            {district}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.district && (
                        <FormHelperText error>
                          district is required
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      error={!!errors.city}
                    >
                      <InputLabel>Home City</InputLabel>
                      <Select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        label="City"
                        sx={errors.city ? errorOutlineStyle : {}}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {district &&
                          citiesAndPostalCodes[district].map(
                            ({ city: cityName }) => (
                              <MenuItem key={cityName} value={cityName}>
                                {cityName}
                              </MenuItem>
                            )
                          )}
                      </Select>
                      {errors.city && (
                        <FormHelperText error>city is required</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="NIC/Passport Number"
                      value={nicOrPassport}
                      onChange={(e) => setNicOrPassport(e.target.value)}
                      error={!!errors.nicOrPassport}
                      helperText={
                        errors.nicOrPassport
                          ? "NIC or Passport is required"
                          : ""
                      }
                      sx={errors.nicOrPassport ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Contact Number"
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+94</InputAdornment>
                        ),
                      }}
                      error={!!errors.contactNumber}
                      helperText={
                        errors.contactNumber ? "Contact Number is required" : ""
                      }
                      sx={errors.contactNumber ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      error={!!errors.batch}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel>Batch by A/L Year</InputLabel>
                      <Select
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        sx={errors.batch ? errorOutlineStyle : {}}
                      >
                        {BATCH_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.batch && (
                        <FormHelperText error>batch is required</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Faculty registration number"
                      value={facultyRegNumber}
                      onChange={(e) => setFacultyRegNumber(e.target.value)}
                      error={!!errors.facultyRegNumber}
                      helperText={
                        errors.facultyRegNumber
                          ? "Faculty Registration Number is required"
                          : ""
                      }
                      sx={errors.facultyRegNumber ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/*Column 2*/}
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  {/* <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      error={!!errors.lastName}
                      helperText={
                        errors.lastName ? "Last Name is required" : ""
                      }
                      sx={errors.lastName ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid> */}
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!errors.password}
                      helperText={errors.password ? "Password is required" : ""}
                      sx={errors.password ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      error={!!errors.gender}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel>Gender</InputLabel>
                      <Select
                        sx={errors.gender ? errorOutlineStyle : {}}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        {GENDER_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.gender && (
                        <FormHelperText error>
                          Gender is required
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      error={!!errors.occupation}
                      helperText={
                        errors.occupation ? "Occupation is required" : ""
                      }
                      sx={errors.occupation ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Current Station"
                      value={currentStation}
                      onChange={(e) => setCurrentStation(e.target.value)}
                      error={!!errors.currentStation}
                      helperText={
                        errors.currentStation
                          ? "Current Station is required"
                          : ""
                      }
                      sx={errors.currentStation ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      error={!!errors.faculty}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel>Faculty</InputLabel>
                      <Select
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        sx={errors.faculty ? errorOutlineStyle : {}}
                      >
                        {FACULTY_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.faculty && (
                        <FormHelperText error>
                          Faculty is required
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Button type="submit" variant="contained" color="primary">
                  Register
                </Button>
              </Grid>
              <Grid item xs={6}>
                <ListItemButton component="a" href="/login">
                  Login
                </ListItemButton>
              </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                {"Can't leave required fields empty"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ textAlign: "center", mb: 2 }}>
                  Please fill in all the required fields.
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                  onClick={handleClose}
                  color="primary"
                  autoFocus
                  variant="contained"
                >
                  Okay
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
