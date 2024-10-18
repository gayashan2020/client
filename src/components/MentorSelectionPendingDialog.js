import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  Select,
  MenuItem,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const MentorSelectionDialog = ({
  mentorSelectedPendingModel,
  setMentorSelectedPendingModel,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm")); // Responsive full-screen dialog on smaller screens

  return (
    <Dialog
    fullScreen={fullScreen}
    open={mentorSelectedPendingModel}
    onClose={() => setMentorSelectedPendingModel(false)}
    PaperProps={{
      style: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2), // Adds padding inside the dialog
        borderRadius: theme.shape.borderRadius, // Applies theme border radius
      },
    }}
  >
    <DialogTitle style={{ textAlign: "center" }}>
      Please wait till your mentors approval
    </DialogTitle>
    <DialogActions
      style={{ justifyContent: "center", padding: theme.spacing(3) }}
    >
      <Button
        onClick={() => setMentorSelectedPendingModel(false)}
        variant="outlined"
        style={{ marginRight: theme.spacing(1), backgroundColor: "red" }}
      >
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
  );
};

export default MentorSelectionDialog;
