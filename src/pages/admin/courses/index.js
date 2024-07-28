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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import CourseCard from "@/components/CourseCard";
import { fetchCategories, addCategories } from "@/services/courseCategories";
import { fetchCoursesByCategoryIds, updateCourseCategory } from "@/services/courses";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { userRoles } from "@/assets/constants/authConstants";
import { routes } from "@/assets/constants/routeConstants";

export default function Index() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editedCategories, setEditedCategories] = useState({});
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
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (selectedCategories) => {
    try {
      setLoading(true);
      const categoryNames = selectedCategories.map(
        (category) => category.category
      );
      const coursesData = await fetchCoursesByCategoryIds(categoryNames);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategoryModalOpen = () => setOpenAddCategoryModal(true);
  const handleAddCategoryModalClose = () => setOpenAddCategoryModal(false);

  const handleAddCategorySubmit = async () => {
    try {
      setLoading(true);
      await addCategories({ category: newCategory });
      fetchCategoriesAndUser(); // Refresh the list of categories
      setNewCategory(""); // Clear the input field
      handleAddCategoryModalClose(); // Close the modal
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      const updatedCategories = prevSelected.find(
        (category) => category._id === categoryId
      )
        ? prevSelected.filter((category) => category._id !== categoryId)
        : [
            ...prevSelected,
            categories.find((category) => category._id === categoryId),
          ];
      fetchCourses(updatedCategories); // Call fetchCourses with updated categories
      return updatedCategories;
    });
  };

  const handleCategoryEditChange = (courseId, categoryName) => {
    setEditedCategories((prevEdited) => ({
      ...prevEdited,
      [courseId]: categoryName,
    }));
  };

  const handleCategoryUpdateSubmit = async () => {
    try {
      setLoading(true);
      await Promise.all(
        Object.keys(editedCategories).map((courseId) =>
          updateCourseCategory(courseId, editedCategories[courseId])
        )
      );
      fetchCourses(selectedCategories); // Refresh the courses list
      setEditMode(false); // Exit edit mode
      setEditedCategories({}); // Clear the edited categories
    } catch (error) {
      console.error("Failed to update course categories:", error);
    } finally {
      setLoading(false);
    }
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

  return (
    <Layout>
      <Grid
        container
        spacing={2}
        style={{
          minHeight: "100vh",
        }}
      >
        <Grid item xs={12} md={3} lg={2}>
          <Box
            sx={{
              padding: "20px",
              backgroundColor: "#333",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              color: "#fff",
              marginTop: "20px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            {categories.map((category, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedCategories.some(
                      (selected) => selected._id === category._id
                    )}
                    onChange={() => handleCategoryChange(category._id)}
                    sx={{
                      color: "#fff",
                      "&.Mui-checked": {
                        color: "#fff",
                      },
                    }}
                  />
                }
                label={category.category}
                sx={{
                  "& .MuiTypography-root": {
                    color: "#fff",
                  },
                }}
              />
            ))}
            {user &&
              [
                userRoles.SUPER_ADMIN,
                userRoles.ADMIN,
                userRoles.CPD_PROVIDER,
              ].includes(user.role) && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddCategoryModalOpen}
                    sx={{
                      marginTop: "20px",
                      width: "100%",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#0056b3",
                      },
                    }}
                  >
                    Add Category
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(routes.ADMIN_COURSES_ADD_COURSE)}
                    sx={{
                      marginTop: "20px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      width: "100%",
                      "&:hover": {
                        backgroundColor: "#0056b3",
                      },
                    }}
                  >
                    Add Courses
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setEditMode(!editMode)}
                    sx={{
                      marginTop: "20px",
                      width: "100%",
                      backgroundColor: "#ffc107",
                      color: "#000",
                      "&:hover": {
                        backgroundColor: "#e0a800",
                      },
                    }}
                  >
                    {editMode ? "Finish Editing" : "Edit Category"}
                  </Button>
                  {editMode && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleCategoryUpdateSubmit}
                      sx={{
                        marginTop: "20px",
                        width: "100%",
                      }}
                    >
                      Update Categories
                    </Button>
                  )}
                </>
              )}
          </Box>
        </Grid>
        <Grid item xs={12} md={9} lg={10}>
          <Grid
            container
            spacing={3}
            alignItems="flex-start"
            justifyContent="flex-start"
            sx={{ padding: "20px" }}
          >
            {courses.map((course, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Box position="relative">
                  {editMode && (
                    <FormControl
                      fullWidth
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        zIndex: 10,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "4px",
                      }}
                    >
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={editedCategories[course._id] || course.category}
                        onChange={(e) =>
                          handleCategoryEditChange(course._id, e.target.value)
                        }
                      >
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category.category}>
                            {category.category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <CourseCard course={course} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Add Category Modal */}
      <Modal
        open={openAddCategoryModal}
        onClose={handleAddCategoryModalClose}
        aria-labelledby="modal-add-category-title"
        aria-describedby="modal-add-category-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-add-category-title"
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
            <Button onClick={handleAddCategorySubmit} variant="contained" sx={{ mt: 2 }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
}
