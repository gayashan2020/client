import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  DialogActions,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  Autocomplete,
} from "@mui/material";
import { red } from "@mui/material/colors";
import Tiptap from "@/components/Tiptap";
import { OCCUPATION_OPTIONS } from "@/assets/constants/adminConstants";

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
  const [reConfirmOpen, setReConfirmOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [occupationFilter, setOccupationFilter] = useState("");

  // Apply filters to the mentors list
  const filteredMentors = mentors?.filter((mentor) => {
    return (
      (!genderFilter || mentor.gender === genderFilter) &&
      (!cityFilter || mentor.city === cityFilter) &&
      (!occupationFilter || mentor.occupation === occupationFilter)
    );
  });

  const handleContinueClick = () => {
    setReConfirmOpen(true);
  };

  const handleReConfirm = () => {
    setReConfirmOpen(false);
    setEditorOpen(true);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSendApplication = () => {
    setEditorOpen(false);
    handleEnroll(editorContent); // Pass editor content to the enroll handler
  };

  return (
    <>
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
        <DialogTitle style={{ textAlign: "center" }}>Select a Mentor</DialogTitle>
        <DialogContent>
          {/* Filters */}
          <FormControl fullWidth style={{ marginBottom: theme.spacing(2), paddingTop: "10px" }}>
            <Autocomplete
              disablePortal
              options={["male", "female"]}
              getOptionLabel={(option) => option}
              value={genderFilter}
              onChange={(event, newValue) => setGenderFilter(newValue || "")}
              renderInput={(params) => <TextField {...params} label="Gender" />}
            />
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: theme.spacing(2) }}>
            <Autocomplete
              disablePortal
              options={[...new Set(mentors?.map((mentor) => mentor?.city))]} // unique cities
              getOptionLabel={(option) => option}
              value={cityFilter}
              onChange={(event, newValue) => setCityFilter(newValue || "")}
              renderInput={(params) => <TextField {...params} label="City" />}
            />
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: theme.spacing(2) }}>
            <Autocomplete
              disablePortal
              options={[...new Set(mentors?.map((mentor) =>
                OCCUPATION_OPTIONS.find((opt) => opt.value === mentor.occupation) // map mentor occupation to OCCUPATION_OPTIONS
              ))].filter(Boolean)} // remove any undefined values
              getOptionLabel={(option) => option.label}
              value={OCCUPATION_OPTIONS.find((opt) => opt.value === occupationFilter) || null}
              onChange={(event, newValue) => setOccupationFilter(newValue ? newValue.value : "")}
              renderInput={(params) => <TextField {...params} label="Occupation" />}
            />
          </FormControl>

          {/* Mentor Selection */}
          <FormControl fullWidth style={{ marginTop: theme.spacing(2), minHeight: "200px" }}>
            <Autocomplete
              disablePortal
              options={filteredMentors}
              getOptionLabel={(option) => option.fullName || ""}
              value={
                filteredMentors?.length > 0
                  ? filteredMentors?.find((mentor) => mentor._id === selectedMentor) || null
                  : null
              }
              onChange={(event, newValue) => setSelectedMentor(newValue ? newValue._id : "")}
              renderInput={(params) => <TextField {...params} label="Search Mentor" />}
              ListboxProps={{ style: { maxHeight: 300, overflowY: "auto", width: "auto" } }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "center", padding: theme.spacing(3) }}
        >
          <Button
            onClick={() => setMentorDialogOpen(false)}
            variant="outlined"
            style={{ marginRight: theme.spacing(1), backgroundColor: red[500], color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinueClick}
            disabled={!selectedMentor}
            variant="contained"
            color="primary"
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reConfirmOpen}
        onClose={() => setReConfirmOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2),
            borderRadius: theme.shape.borderRadius,
          },
        }}
      >
        <DialogTitle style={{ textAlign: "center" }}>Confirm Enrollment</DialogTitle>
        <DialogContent>
          Are you sure you want to proceed with the selected mentor?
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", padding: theme.spacing(3) }}>
          <Button
            onClick={() => setReConfirmOpen(false)}
            variant="outlined"
            style={{ marginRight: theme.spacing(1) }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReConfirm}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        fullScreen={fullScreen}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2),
            borderRadius: theme.shape.borderRadius,
          },
        }}
      >
        <DialogTitle style={{ textAlign: "center" }}>Application for Mentorship</DialogTitle>
        <DialogContent>
          <Tiptap onContentChange={handleEditorChange} />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", padding: theme.spacing(3) }}>
          <Button
            onClick={() => setEditorOpen(false)}
            variant="outlined"
            style={{ marginRight: theme.spacing(1) }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendApplication}
            variant="contained"
            color="primary"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MentorSelectionDialog;
