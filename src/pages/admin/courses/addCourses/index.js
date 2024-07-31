import { useState, useContext, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  Typography,
  Grid,
  Container,
  Card,
  CardMedia,
  CardActionArea,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { LoadingContext } from "@/contexts/LoadingContext";
import Layout from "@/components/Layout";
import { toast } from "react-toastify";
import { addCourse, updateCourseImage } from "@/services/courses";
import { styled } from "@mui/material/styles";
import { fetchCategories } from "@/services/courseCategories";

export default function Index() {
  const { setLoading } = useContext(LoadingContext);

  const [event, setEvent] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setSelectedCategory] = useState("");
  const [competencyAssessed, setCompetencyAssessed] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [totalCpdPoints, setTotalCpdPoints] = useState(0);
  const [organizingBody, setOrganizingBody] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const categories = await fetchCategories();
      setLoading(false);
      setCategories(categories);
    };
    fetchData();
  }, [setLoading]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmit = async (course) => {
    const response = await updateCourseImage(course, image);
    if (response.ok) {
      toast.success("Image updated successfully!");
    } else {
      toast.error("Failed to update Image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataObject = {
      event,
      image,
      category,
      competency_assessed: competencyAssessed,
      dates: startDate === endDate ? startDate.split('-').join('.') : `${startDate.split('-').join('.')} – ${endDate.split('-').join('.')}`,
      contact: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
      },
      total_cpd_points: Number(totalCpdPoints),
      organizing_body: organizingBody,
    };

    setLoading(true);
    const response = await addCourse(dataObject);
    setLoading(false);
    if (response.message && response.body.insertedId) {
      setLoading(true);
      await handleImageSubmit(response.body.insertedId);
      setLoading(false);
      toast.success("Course added successfully!");
      setEvent("");
      setImage("");
      setImagePreview(null);
      setSelectedCategory("");
      setCompetencyAssessed([]);
      setStartDate("");
      setEndDate("");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setTotalCpdPoints(0);
      setOrganizingBody("");
    } else {
      toast.error("Error adding course");
    }
  };

  const competencies = [
    "Knowledge Skill Development",
    "Change in performance",
    "Change in patient outcomes",
  ];

  return (
    <Layout>
      <Container
        component="main"
        maxWidth="md"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Add Course
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    <CardActionArea component="label">
                      <CardMedia
                        component="img"
                        height="400"
                        image={
                          imagePreview
                            ? imagePreview
                            : "/static/placeholderImage.webp"
                        }
                        alt="Course Image"
                      />
                      <VisuallyHiddenInput
                        accept="image/*"
                        id="file-input"
                        type="file"
                        onChange={handleImageChange}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    label="Course Name"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      value={category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      input={<OutlinedInput label="Category" />}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat.category}>
                          {cat.category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={organizingBody}
                    onChange={(e) => setOrganizingBody(e.target.value)}
                    label="Organizing Body"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="competency-label">Competency Assessed</InputLabel>
                    <Select
                      labelId="competency-label"
                      multiple
                      value={competencyAssessed}
                      onChange={(e) => setCompetencyAssessed(e.target.value)}
                      input={<OutlinedInput label="Competency Assessed" />}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {competencies.map((competency) => (
                        <MenuItem key={competency} value={competency}>
                          <Checkbox checked={competencyAssessed.includes(competency)} />
                          <ListItemText primary={competency} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    label="Start Date"
                    required
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    label="End Date"
                    required
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    value={totalCpdPoints}
                    onChange={(e) => setTotalCpdPoints(e.target.value)}
                    label="Total CPD Points"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    label="Contact Name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    label="Contact Email"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    label="Contact Phone"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Button type="submit" variant="contained" color="primary">
              Add Course
            </Button>
          </Grid>
        </form>
      </Container>
    </Layout>
  );
}
