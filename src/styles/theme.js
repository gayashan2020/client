import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Color for the LoginForm button and focus
    },
    secondary: {
      main: "#4a4a4a", // Color for the RegisterForm
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
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1976d2", // Border color for LoginForm
            },
            "&:hover fieldset": {
              borderColor: "#1976d2", // Border color on hover for LoginForm
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2", // Border color on focus for LoginForm
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginTop: "16px", // Space above the button
          backgroundColor: "#1976d2", // Background color for LoginForm button
          "&:hover": {
            backgroundColor: "#115293", // Hover color for LoginForm button
          },
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

export default theme;