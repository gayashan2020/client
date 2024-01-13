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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import citiesAndPostalCodes from "../assets/constants/cities-and-postalcode-by-district.json";

// Updated theme for styling
const theme = createTheme({
  palette: {
    primary: {
      main: "#4a4a4a", // Example color, adjust as needed
    },
    background: {
      default: "#e7e7e7", // Light gray background
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff", // White background for textfields
          borderRadius: "4px", // Rounded corners for textfields
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginTop: "16px", // Space above the button
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
});

export default function RegisterForm() {
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
      }),
    });

    if (response.ok) {
      const { userId } = await response.json();
      console.log("Registered:", userId);
    } else {
      console.log("Failed to register");
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
                </Grid>
              </Grid>
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
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
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
