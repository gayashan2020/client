//styles/theme.js

import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "dark" ? "#fff" : "#1976d2",
      },
      secondary: {
        main: "#4a4a4a",
      },
      background: {
        default: mode === "dark" ? "#424242" : "#e7e7e7",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#424242" : "#fff",
            borderRadius: "4px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#1976d2",
              },
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            marginTop: "16px",
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#115293",
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: mode === "dark" ? "#fff" : "#000",
            textDecoration: "none",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#424242" : "#fff",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#1976d2",
              },
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
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

export const lightTheme = getTheme("light");
export const darkTheme = getTheme("dark");
