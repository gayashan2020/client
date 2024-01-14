import { useState } from "react";
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
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import citiesAndPostalCodes from "../../assets/constants/cities-and-postalcode-by-district.json";
import { lightTheme as theme } from "@/styles/theme";
import {
  GENDER_OPTIONS,
  BATCH_OPTIONS,
  FACULTY_OPTIONS,
} from "@/assets/constants/studentConstants";
import {userRoles} from "@/assets/constants/authConstants";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function RegisterForm() {

  const router = useRouter();

  const [password, setPassword] = useState("");
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
  const [facultyRegNumber, setFacultyRegNumber] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a POST request to the /api/register endpoint with the form data
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        firstName,
        lastName,
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

    if (response.ok) { 
      // Show a toast message
      toast.success('Registration successful!');
    
      // Clear the form
      setPassword("");
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
      setFacultyRegNumber("");
    
      // Navigate to the login page
      toast.success("Registration successful!");
      router.push('/login');
    } else {
      console.log("Failed to register");
      toast.error('Registration failed.');
    }
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
              {/*Column 1*/}
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>District</InputLabel>
                      <Select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        label="District"
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
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>City</InputLabel>
                      <Select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        label="City"
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="NIC/Passport Number"
                      value={nicOrPassport}
                      onChange={(e) => setNicOrPassport(e.target.value)}
                      required
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
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      required
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel>Batch by A/L Year</InputLabel>
                      <Select
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                      >
                        {BATCH_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Faculty registration number"
                      value={facultyRegNumber}
                      onChange={(e) => setFacultyRegNumber(e.target.value)}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/*Column 2*/}
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      required
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        {GENDER_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      label="Occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      required
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
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      required
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel>Faculty</InputLabel>
                      <Select
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                      >
                        {FACULTY_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
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
          </form>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
