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
import { red } from "@mui/material/colors";

const MentorSelectionDialog = ({
  mentorDialogOpen,
  setMentorDialogOpen,
  mentors,
  selectedMentor,
  setSelectedMentor,
  handleEnroll,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm")); // Responsive full-screen dialog on smaller screens

  return (
    <Dialog
      fullScreen={fullScreen}
      open={mentorDialogOpen}
      onClose={() => setMentorDialogOpen(false)}
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
        Select a Mentor
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth style={{ marginTop: theme.spacing(2) }}>
          <Select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            style={{
              marginTop: theme.spacing(1), // Adds margin above the Select component
            }}
          >
            <MenuItem value="" disabled>
              Choose a mentor
            </MenuItem>
            {mentors &&
              mentors.map((mentor) => (
                <MenuItem key={mentor._id} value={mentor._id}>
                  {mentor.fullName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions
        style={{ justifyContent: "center", padding: theme.spacing(3) }}
      >
        <Button
          onClick={() => setMentorDialogOpen(false)}
          variant="outlined"
          style={{ marginRight: theme.spacing(1), backgroundColor: "red" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleEnroll}
          disabled={!selectedMentor}
          variant="contained"
          color="primary"
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MentorSelectionDialog;
