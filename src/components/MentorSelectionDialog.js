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
          <FormControl fullWidth style={{ marginTop: theme.spacing(2), minHeight: '200px' }}>
            <Autocomplete
              disablePortal
              options={mentors ? mentors : []}
              getOptionLabel={(option) => option.fullName || ""}
              value={mentors && mentors.length > 0 ? mentors.find((mentor) => mentor._id === selectedMentor) || null : null}
              onChange={(event, newValue) => setSelectedMentor(newValue ? newValue._id : "")}
              renderInput={(params) => <TextField {...params} label="Search Mentor" />}
              ListboxProps={{ style: { maxHeight: 300, overflowY: 'auto', width: 'auto' } }}
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
