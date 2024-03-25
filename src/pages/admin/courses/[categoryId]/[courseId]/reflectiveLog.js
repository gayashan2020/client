import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Paper,
} from "@mui/material";
import { LoadingContext } from "@/contexts/LoadingContext";
import {
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";
import { addReflectiveLog } from "@/services/reflectiveLog";
import { toast } from "react-toastify";
import { fetchCurrentUser } from "@/services/users";
import { uploadReflectiveFile } from "@/services/reflectiveLog";

export default function ReflectiveLog() {
  const [form, setForm] = useState({
    learning_experience: "",
    what_did_I_learn: "",
    more_to_learn: "",
    how_to_learn: "",
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  const { courseId } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    fetchCurrentUser()
      .then((currentUser) => {
        // getEnrolledData(currentUser);
        setUser(currentUser);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router.isReady, setLoading]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.includes("image")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === "application/pdf") {
        setFilePreview(null);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    // handle validation here if needed
  };

  // Example of handling checkbox changes
  const handleCheckboxChange = (event) => {
    setAgreement(event.target.checked);
  };

  // Replace with your image upload logic
  const handleImageChange = (imageUrl) => {
    setCourseImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!router.isReady) return;

    setLoading(true);
    let dataObj = {
      ...form,
      courseId: courseId,
      userId: user._id,
      approval:"pending",
    };

    try {
      // First, try to add the reflective log
      const response = await addReflectiveLog(dataObj);

      if (
        response &&
        response.message === "Reflective Log added successfully"
      ) {
        // Assuming that the ID of the new reflective log is returned in the response
        const reflectiveLogId = response.body.insertedId;

        if (file) {
          // If there's a file selected, upload it
          const fileUploadResponse = await uploadReflectiveFile(
            reflectiveLogId,
            file
          );

          if (fileUploadResponse.ok) {
            // File upload was successful
            toast.success("Reflective log and file uploaded successfully!");
          } else {
            // Handle file upload error
            toast.error("File upload failed.");
          }
        } else {
          // No file to upload, but reflective log was created successfully
          toast.success("Reflective log added successfully without file.");
        }

        // Clear form
        setForm({
          learning_experience: "",
          what_did_I_learn: "",
          more_to_learn: "",
          how_to_learn: "",
        });
        setFile(null);
        setFilePreview("")
        router.back()
      } else {
        // Handle error adding reflective log
        toast.error("Error adding reflective log.");
      }
    } catch (error) {
      console.error("Submission error", error);
      toast.error("An error occurred during the submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Reflective Log
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Learning Experience"
                name="learning_experience"
                value={form.learning_experience}
                onChange={handleChange}
                error={!!errors.learning_experience}
                helperText={errors.learning_experience}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="What did I Learn"
                name="what_did_I_learn"
                value={form.what_did_I_learn}
                onChange={handleChange}
                error={!!errors.what_did_I_learn}
                helperText={errors.what_did_I_learn}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="More to Learn"
                name="more_to_learn"
                value={form.more_to_learn}
                onChange={handleChange}
                error={!!errors.more_to_learn}
                helperText={errors.more_to_learn}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="How to Learn"
                name="how_to_learn"
                value={form.how_to_learn}
                onChange={handleChange}
                error={!!errors.how_to_learn}
                helperText={errors.how_to_learn}
                multiline
                rows={4}
              />
            </Grid>

            {/* Custom ImageUpload component */}
            <Grid item xs={12}>
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  cursor: "pointer",
                  backgroundColor: (theme) => theme.palette.background.default,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="preview"
                    style={{ maxWidth: "100%", maxHeight: "100px" }}
                  />
                ) : file && file.type === "application/pdf" ? (
                  <Box textAlign="center">
                    <PictureAsPdfIcon sx={{ fontSize: 60 }} color="action" />
                    <Typography variant="body1">{file.name}</Typography>
                  </Box>
                ) : (
                  <CloudUploadIcon sx={{ fontSize: 60 }} color="action" />
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Paper>
            </Grid>
            {/* ... other parts of the form ... */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                  />
                }
                label="I hereby declare that the information provided here is true and correct."
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
