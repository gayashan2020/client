import { useState, useContext, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
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
import {
  updateCourse,
  updateCourseImage,
  fetchCourseById,
} from "@/services/courses";
import { styled } from "@mui/material/styles";
import { fetchCurrentUser } from "@/services/users";
import { fetchCategories } from "@/services/courseCategories";
import { useRouter } from "next/router";

export default function EditCourse() {
  const { setLoading } = useContext(LoadingContext);

  const [event, setEvent] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("");
  const [competencyAssessed, setCompetencyAssessed] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [totalCpdPoints, setTotalCpdPoints] = useState(0);
  const [organizingBody, setOrganizingBody] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const router = useRouter();
  const { categoryId, courseId } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    fetchCourseData();
    fetchCategoryData();
    fetchCurrentUser().then((currentUser) => {
      setUser(currentUser);
    }).catch((error) => {
      console.error("Failed to fetch current user", error);
    }).finally(() => {
      setLoading(false);
    });
  }, [router.isReady, setLoading]);

  const handleSelectChange = (event) => {
    const selectedIndex = event.target.value;
    const selectedCategory = categories.find((category) => category.category === selectedIndex);
    setCategory(selectedCategory ? selectedCategory.category : "");
    setSelectedCategory(selectedCategory ? selectedCategory.category : "");
  };

  const fetchCategoryData = async () => {
    setLoading(true);
    const categories = await fetchCategories();
    setLoading(false);
    setCategories(categories);
  };

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const data = await fetchCourseById(categoryId, courseId);
      setEvent(data.event);
      setImagePreview(data.image ? data.image : "");
      setCategory(data.category);
      setSelectedCategory(data.category);
      setCompetencyAssessed(data.competency_assessed || []);
      const datesArray = data.dates.split(" – ");
      setStartDate(datesArray[0].split('.').join('-'));
      setEndDate(datesArray[1] ? datesArray[1].split('.').join('-') : datesArray[0].split('.').join('-'));
      setContactName(data.contact.name);
      setContactEmail(data.contact.email);
      setContactPhone(data.contact.phone);
      setTotalCpdPoints(data.total_cpd_points);
      setOrganizingBody(data.organizing_body);
      setImage(data.image ? data.image : "");
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

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
    if (response.status === 200) {
      toast.success("Image updated successfully!");
    } else {
      toast.error("Failed to update Image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataObject = {
      event,
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
    const response = await updateCourse(courseId, dataObject);
    setLoading(false);
    if (response.message === "Course updated successfully") {
      if (image && image.type.startsWith("image/")) {
        await handleImageSubmit(courseId);
      }
      toast.success("Update successful!");
      router.push(`/admin/courses`);
    } else {
      toast.error("Error updating course");
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
          Edit Course
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
                      value={selectedCategory || ""}
                      onChange={handleSelectChange}
                      input={<OutlinedInput label="Category" />}
                      renderValue={(selected) => {
                        const category = categories.find((cat) => cat.category === selected);
                        return category ? category.category : <em>Choose a category</em>;
                      }}
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
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Button type="submit" variant="contained" color="primary">
              Update Course
            </Button>
          </Grid>
        </form>
      </Container>
    </Layout>
  );
}
