// src/pages/admin/courses/index.js
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
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { Navbar } from "@/components/landingPageComponents/navbar";
import CourseCard from "@/components/CourseCard"; // Updated import
import { fetchCategories, addCategories } from "@/services/courseCategories";
import { fetchCoursesByCategoryIds } from "@/services/courses";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { userRoles } from "@/assets/constants/authConstants";
import { routes } from "@/assets/constants/routeConstants";

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
      console.log("coursesData", categoryNames);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
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
    <>
      <Navbar />
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
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
