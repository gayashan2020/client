import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Grid,
  Card,
  Container,
  Typography,
  ListItemButton,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme as theme } from "@/styles/theme";
import { userRoles } from "@/assets/constants/authConstants";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { routes } from "@/assets/constants/routeConstants";
import { registerUser } from "@/services/auth";
import { LoadingContext } from "@/contexts/LoadingContext";

export default function RegisterForm() {
  const router = useRouter();

  const { setLoading } = useContext(LoadingContext);

  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [officialAddress, setOfficialAddress] = useState("");
  const [username, setUsername] = useState("");
  const [cpdProviderRegNumber, setCpdProviderRegNumber] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      password,
      institution,
      email,
      contactNumber,
      officialAddress,
      username,
      cpdProviderRegNumber,
      role: userRoles.CPD_PROVIDER,
      approval: true,
    };
    setLoading(true);
    const response = await registerUser(userData);
    setLoading(false);

    if (response.status === 200) {
      // Show a toast message
      toast.success("Registration successful!");

      // Clear the form
      setPassword("");
      setInstitution("");
      setEmail("");
      setContactNumber("");
      setOfficialAddress("");
      setUsername("");
      setCpdProviderRegNumber("");

      toast.success("Registration successful!");
      router.push("/login");
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
                    label="CPD Provider Registration Number"
                    value={cpdProviderRegNumber}
                    onChange={(e) => setCpdProviderRegNumber(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    label="Institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    label="Official Email"
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
                    label="Official Phone Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    label="Official Address"
                    value={officialAddress}
                    onChange={(e) => setOfficialAddress(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <Grid item xs={6}>
                  <Button type="submit" variant="contained" color="primary">
                    Register
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <ListItemButton
                    component="a"
                    href={routes.ADMIN_USERS_CPD_PROVIDERS}
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
