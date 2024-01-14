import { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  ListItemButton,
  Card,
  Container,
  Typography,
  Divider,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme as theme } from "@/styles/theme";
import { userRoles } from "@/assets/constants/authConstants";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { GENDER_OPTIONS } from "@/assets/constants/studentConstants";
import { OCCUPATION_OPTIONS } from "@/assets/constants/adminConstants";
import citiesAndPostalCodes from "../../../../assets/constants/cities-and-postalcode-by-district.json";
import { routes } from "@/assets/constants/routeConstants";
import Layout from "@/components/Layout";

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send a POST request to the /api/register endpoint with the form data
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
        role: userRoles.ADMIN,
      }),
    });

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

      toast.success("Registration successful!");
    } else {
      console.log("Failed to register");
      toast.error("Registration failed.");
    }
  };

  return (
    <Layout>
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
                    required
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
                    required
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
                        required
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
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          labelId="gender-label"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          required
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
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/*Column 2*/}

                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
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
                        label="Working Station"
                        value={workingStation}
                        onChange={(e) => setWorkingStation(e.target.value)}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
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
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Button type="submit" variant="contained" color="primary">
                    Register
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <ListItemButton
                    component="a"
                    href={routes.ADMIN_USERS_SITE_ADMIN}
                  >
                    Back
                  </ListItemButton>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Container>
      </ThemeProvider>
    </Layout>
  );
}
