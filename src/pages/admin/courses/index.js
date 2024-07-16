import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Box,
  Modal,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CardMedia,
} from "@mui/material";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { fetchCategories, addCategories } from "@/services/courseCategories";
import { fetchCoursesByCategoryIds } from "@/services/courses";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { userRoles } from "@/assets/constants/authConstants";

export default function Index() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); // For modal visibility
  const [newCategory, setNewCategory] = useState(""); // For new category name
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  useEffect(() => {
    
    async function fetchData() {
      setLoading(true);
      let categoriesData = await fetchCategoriesAndUser();
      setSelectedCategories(categoriesData);
      await fetchCourses(categoriesData);
      setLoading(false);
    }
    fetchData();
  }, [setLoading]);

  const fetchCategoriesAndUser = async () => {
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch current user", error);
    } 
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
      return categoriesData;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (selectedCategories) => {
    try {
      setLoading(true);
      // console.log('selectedCategories',selectedCategories);
      const categoryIds = selectedCategories.map((category) => category._id);
      const coursesData = await fetchCoursesByCategoryIds(categoryIds);
      // console.log('coursesData',coursesData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await addCategories({ category: newCategory });
      fetchCategoriesAndUser(); // Refresh the list of categories
      setNewCategory(""); // Clear the input field
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      const updatedCategories = prevSelected.find((category) => category._id === categoryId)
        ? prevSelected.filter((category) => category._id !== categoryId)
        : [...prevSelected, categories.find((category) => category._id === categoryId)];
      fetchCourses(updatedCategories); // Call fetchCourses with updated categories
      return updatedCategories;
    });
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const cardStyle = {
    width: 250, // You can set this to the size you desire
    height: 400, // Making the height the same as width to create a square
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // This centers the content horizontally
    textAlign: "center", // Ensures text is centered within the content area
  };

  const navigateToCourse = (course) => {
    router.push(`/admin/courses/${course.category}/${course._id}`);
  };

  return (
    <Layout>
      <Grid container spacing={1} style={{ minHeight: "100vh" }}>
        <Grid item xs={12} md={3} lg={2}>
          <Box style={{ padding: "10px" }}>
            <Typography variant="h6">Categories</Typography>
            {categories.map((category, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedCategories.some((selected) => selected._id === category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                }
                label={category.category}
              />
            ))}
            {user &&
              [
                userRoles.SUPER_ADMIN,
                userRoles.ADMIN,
                userRoles.CPD_PROVIDER,
              ].includes(user.role) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                  style={{ marginTop: "20px" }}
                >
                  Add Category
                </Button>
              )}
          </Box>
        </Grid>
        <Grid item xs={12} md={9} lg={10}>
          <Grid
            container
            spacing={2}
            alignItems="start"
            justifyContent="flex-start"
            style={{ padding: "5px" }}
          >
            {courses.map((course, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Card sx={cardStyle} onClick={() => navigateToCourse(course)}>
                  <CardActionArea
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      justifyContent: "flex-start",
                    }}
                  >
                    {course.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={course.image}
                        alt={course.name}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h5" component="div" gutterBottom>
                        {course.name}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                      >
                        <Typography variant="body2" color="text.secondary" mr={1}>
                          Duration:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          fontWeight="fontWeightMedium"
                        >
                          {course.duration} hours
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={1}
                      >
                        <Typography variant="body2" color="text.secondary" mr={1}>
                          CPD Total:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          fontWeight="fontWeightMedium"
                        >
                          {course.cpdTotal} points
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={1}
                      >
                        <Typography variant="body2" color="text.secondary" mr={1}>
                          CPD Minimum:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          fontWeight="fontWeightMedium"
                        >
                          {course.cpdMin} points
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={1}
                      >
                        <Typography variant="body2" color="text.secondary" mr={1}>
                          Type:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          fontWeight="fontWeightMedium"
                        >
                          {course.type}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Add Category Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            marginBottom={2}
          >
            Add New Category
          </Typography>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            margin="normal"
          />
          <Box textAlign="right">
            <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
}
