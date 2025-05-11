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
  Box,
  keyframes,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";
import { lightTheme as theme } from "@/styles/theme";
import { toast } from "react-toastify";
import { loginUser } from "@/services/auth";
import { LoadingContext } from "@/contexts/LoadingContext";
import { AuthContext } from "@/contexts/AuthContext";

// Animation keyframes from landing page
const scaleUp = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setLoading } = useContext(LoadingContext);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await loginUser(email, password);
      if (response.status === 200) {
        // If the login is successful, store the token in a cookie
        Cookies.set("token", response.data.token, {
          expires: 7, // Cookie will expire in 7 days
          path: "/", // Cookie will be accessible for the whole site
          secure: true, // Cookie will only be transmitted over secure protocol as HTTPS
          sameSite: "Strict", // Strict SameSite policy to mitigate CSRF attacks
        });
        console.log(response.data.user, "response.data.user");
        // Update the auth context with user data
        login(response.data.user);

        toast.success("Login successful");

        if (response.data.approval === true) {
          // Then redirect to the dashboard
          await router.push(routes.ADMIN);
        } else {
          // Then redirect to the profile
          await router.push(routes.PROFILE);
        }

        setLoading(false);
      } else {
        // Display the error message from the API response
        toast.error(
          response.data.message || "An error occurred while logging in"
        );
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
      setLoading(false);

      // Display a general error message if there's no specific message from the API
      toast.error(
        error.response?.data?.message || "An error occurred while logging in"
      );
    }
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
        <Container component="main" maxWidth="sm">
          <Card
            sx={{
              padding: 4,
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(44, 102, 110, 0.1)",
              animation: `${scaleUp} 0.6s ease-out`,
              "&:hover": {
                boxShadow: "0 12px 40px rgba(44, 102, 110, 0.2)",
              },
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
              Member Login
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&.Mui-focused fieldset": {
                          borderColor: "#2C666E",
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&.Mui-focused fieldset": {
                          borderColor: "#2C666E",
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#2C666E",
                      "&:hover": {
                        backgroundColor: "#1a4a52",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Log In
                  </Button>
                </Grid>
                
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    href="/register"
                    variant="contained"
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#ff7f50",
                      "&:hover": {
                        backgroundColor: "#ff6b3a",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Register
                  </Button>
                </Grid>
                
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    href="/"
                    variant="outlined"
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: "#2C666E",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#27548A",
                        color: "white",
                        borderColor: "#1a4a52",
                        // transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Home
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}