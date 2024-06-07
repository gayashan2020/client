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
  Divider,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormHelperText,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme as theme } from "@/styles/theme";
import { userRoles } from "@/assets/constants/authConstants";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { GENDER_OPTIONS } from "@/assets/constants/studentConstants";
import { OCCUPATION_OPTIONS } from "@/assets/constants/adminConstants";
import citiesAndPostalCodes from "../../assets/constants/cities-and-postalcode-by-district.json";
import { sendEmail } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { Email } from "../../../emails/basicTemplate";
import { render } from "@react-email/render";
import { errorOutlineStyle } from "@/styles/theme";

export default function RegisterForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [initialsName, setInitialsName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [workingStation, setWorkingStation] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [nicOrPassport, setNicOrPassport] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [slmcRegNumber, setSlmcRegNumber] = useState("");
  const [username, setUsername] = useState("");
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
    if (!workingStation) newErrors.workingStation = true;
    if (!nicOrPassport) newErrors.nicOrPassport = true;
    if (!contactNumber) newErrors.contactNumber = true;
    // if (!batch) newErrors.batch = true;
    // if (!faculty) newErrors.faculty = true;
    if (!slmcRegNumber) newErrors.slmcRegNumber = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setOpen(true);
      return;
    }
    // Send a POST request to the /api/register endpoint with the form data
    setLoading(true);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        fullName,
        initialsName,
        gender,
        email,
        occupation,
        workingStation,
        city,
        district,
        nicOrPassport,
        contactNumber,
        slmcRegNumber,
        username,
        role: userRoles.MENTOR,
      }),
    });

    setLoading(false);
    if (response.ok) {
      // Show a toast message
      toast.success("Registration successful!");

      // Clear the form
      setPassword("");
      setFullName("");
      setInitialsName("");
      setGender("");
      setEmail("");
      setOccupation("");
      setWorkingStation("");
      setDistrict("");
      setCity("");
      setNicOrPassport("");
      setContactNumber("");
      setSlmcRegNumber("");
      setUsername("");

      setLoading(true);
      const emailHtml = render(
        <Email email={email} password={password} fullName={fullName} />
      );
      const options = {
        to: email,
        subject: "Email Confirmation",
        html: emailHtml,
      };

      await sendEmail(options);
      setLoading(false);
      
      toast.success("Registration successful!");
      // Navigate to the login page
      await router.push("/login");
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
                  error={!!errors.fullName}
                  helperText={
                    errors.fullName ? "Name in Full is required" : ""
                  }
                  sx={errors.fullName ? errorOutlineStyle : {}}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  label="Name with Initials"
                  value={initialsName}
                  onChange={(e) => setInitialsName(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              {/*Column 1*/}
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="SLMC Registration Number"
                      value={slmcRegNumber}
                      onChange={(e) => setSlmcRegNumber(e.target.value)}
                      error={!!errors.slmcRegNumber}
                      helperText={
                        errors.slmcRegNumber
                          ? "SLMC Registration Number is required"
                          : ""
                      }
                      sx={errors.slmcRegNumber ? errorOutlineStyle : {}}
                      fullWidth
                    />
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
                        <FormHelperText error>Gender is required</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
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
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Phone Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      error={!!errors.contactNumber}
                      helperText={
                        errors.contactNumber ? "Contact Number is required" : ""
                      }
                      sx={errors.contactNumber ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/*Column 2*/}
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      error={!!errors.district}
                    >
                      <InputLabel>District</InputLabel>
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
                        <FormHelperText error>district is required</FormHelperText>
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
                      <InputLabel>City</InputLabel>
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
                      label="Working Station"
                      value={workingStation}
                      onChange={(e) => setWorkingStation(e.target.value)}
                      error={!!errors.workingStation}
                      helperText={
                        errors.workingStation ? "Working Station is required" : ""
                      }
                      sx={errors.workingStation ? errorOutlineStyle : {}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.occupation}>
                      <InputLabel id="occupation-label">Occupation</InputLabel>
                      <Select
                        labelId="occupation-label"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        sx={errors.occupation ? errorOutlineStyle : {}}
                      >
                        {OCCUPATION_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.occupation && (
                        <FormHelperText error>Occupation is required</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
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
