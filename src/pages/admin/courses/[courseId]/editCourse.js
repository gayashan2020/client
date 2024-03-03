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
} from "@mui/material";
import { LoadingContext } from "@/contexts/LoadingContext";
import Layout from "@/components/Layout";
import { toast } from "react-toastify";
import {
  updateCourse,
  updateCourseImage,
  fetchCourseById,
  getEnrolledDataByCourse,
} from "@/services/courses";
import { styled } from "@mui/material/styles";
import { fetchCurrentUser } from "@/services/users";
import { useRouter } from "next/router";

export default function Index() {
  const { setLoading } = useContext(LoadingContext);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [cpdTotal, setCpdTotal] = useState(0);
  const [cpdMin, setCpdMin] = useState(0);
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [creator, setCreator] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [authors, setAuthors] = useState("");
  const [keywords, setKeywords] = useState("");

  const router = useRouter();
  const { courseId } = router.query;

  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCourseData();
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
  }, [setLoading]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const data = await fetchCourseById(courseId);
      setName(data.name);
      setImagePreview(data.image ? data.image : "");
      setCategory(data.category);
      setDuration(data.duration);
      setCpdTotal(data.cpdTotal);
      setCpdMin(data.cpdMin);
      setType(data.type);
      setLink(data.link);
      setCreator(data.creator);
      setDescription(data.description);
      setObjectives(data.objectives);
      setAuthors(data.authors);
      setKeywords(data.keywords);
      setLoading(false);
      setCourse(data);
      setImage(data.image ? data.image : "");
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  //   const getEnrolledData = async (currentUser) => {
  //     try {
  //       setLoading(true);
  //       const data = await getEnrolledDataByCourse(currentUser._id, courseId);

  //       setLoading(false);
  //       setEnroll(data[0].enrollStatus);
  //     } catch (error) {
  //       console.error("Failed to fetch courses:", error);
  //     }
  //   };

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
    // Send a PUT or POST request to the endpoint handling file uploads
    const response = await updateCourseImage(course, image);

    // Handle the response from the file upload endpoint
    if (response.ok) {
      // Handle successful upload
      toast.success("Image updated successfully!");
      // Optionally, fetch the updated user data to refresh the avatar preview
    } else {
      // Handle errors
      toast.error("Failed to update Image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataObject = {
      name,
      category,
      duration,
      cpdTotal,
      cpdMin,
      type,
      link,
      creator,
      description,
      objectives,
      authors,
      keywords,
      approved: false,
    };

    setLoading(true);
    const response = await updateCourse(courseId, dataObject);

    setLoading(false);
    if (response.message === "Course updated successfully") {
      setLoading(true);
      await handleImageSubmit(courseId);
      setLoading(false);

      toast.success("Update successful!");
      // Clear form
      setName("");
      setImage("");
      setImagePreview("");
      setCategory("");
      setDuration("");
      setCpdTotal("");
      setCpdMin("");
      setType("");
      setLink("");
      setCreator("");
      setDescription("");
      setObjectives("");
      setAuthors("");
      setKeywords("");

      router.push(`/admin/courses`);
    } else {
      alert("Error adding course");
    }
  };

  return (
    <Layout>
      <Container
        component="main"
        maxWidth="s"
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
                      {" "}
                      {/* Change the component of CardActionArea to label */}
                      <CardMedia
                        component="img"
                        height="400"
                        image={
                          imagePreview
                            ? imagePreview
                            : "/static/placeholderImage.webp"
                        }
                        alt="green iguana"
                      />
                      <VisuallyHiddenInput
                        accept="image/*" // Specify that only image files are accepted
                        id="file-input" // Add an ID to the input for better accessibility
                        type="file"
                        onChange={handleImageChange}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Course Name"
                    required
                    fullWidth
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    label="Image"
                    required
                    fullWidth
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Course Category"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    label="Course Duration"
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    value={cpdTotal}
                    onChange={(e) => setCpdTotal(e.target.value)}
                    label="CPD Total"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    value={cpdMin}
                    onChange={(e) => setCpdMin(e.target.value)}
                    label="CPD Minimum"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    label="Course type"
                    required
                    fullWidth
                  >
                    <option value="external">Externally Hosted</option>
                    <option value="internal">Internally Hosted</option>
                  </Select>
                </Grid>

                {type === "external" && (
                  <Grid item xs={12}>
                    <TextField
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      label="Course Link"
                      fullWidth
                    />
                  </Grid>
                )}

                {type === "internal" && (
                  <Grid item xs={12}>
                    <TextField
                      value={creator}
                      onChange={(e) => setCreator(e.target.value)}
                      label="Course Link"
                      fullWidth
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    label="Course Description"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    multiline
                    rows={4}
                    label="Course Objectives"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    label="Course Authors"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    label="Keywords"
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit">Add Course</Button>
          </Grid>
        </form>
      </Container>
    </Layout>
  );
}
