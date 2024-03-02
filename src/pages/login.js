// components/LoginForm.js

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { routes } from "@/assets/constants/routeConstants";
import {
  TextField,
  Button,
  Grid,
  Card,
  Container,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";
import { lightTheme as theme } from "@/styles/theme";
import { toast } from 'react-toastify';
import { loginUser } from "@/services/auth";
import { LoadingContext } from "@/contexts/LoadingContext";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setLoading } = useContext(LoadingContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      setLoading(true);
      const response = await loginUser(email, password);
      setLoading(false);
      if (response.status === 200) {
        // If the login is successful, store the token in a cookie
        Cookies.set("token", response.data.token);

        toast.success("Login successful");
  
        // Then redirect to the dashboard
        await router.push(routes.ADMIN);
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
      setLoading(false);
      // Display the error message from the API
      toast.error("An error occurred while logging in");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <Card raised sx={{ marginTop: 8, padding: 4 }}>
          <Typography component="h1" variant="h5" align="center">
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ py: 1.5 }} // Increase the padding for the button
                >
                  Log in
                </Button>
              </Grid>
              <Grid item xs={6} style={{ color: "#fff" }}>
                <Button
                  component="a"
                  href="/register"
                  fullWidth
                  color="inherit"
                  variant="contained"
                  sx={{ py: 1.5 }} // Increase the padding for the button
                >
                  Register
                </Button>
              </Grid>
              <Grid item xs={6} style={{ color: "#fff" }}>
                <Button
                  component="a"
                  href="/"
                  fullWidth
                  color="inherit"
                  variant="contained"
                  sx={{ py: 1.5 }}
                >
                  Home
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
