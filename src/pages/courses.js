// src/pages/admin/courses/index.js
import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useRouter } from "next/router";
import { Navbar } from "@/components/landingPageComponents/navbar";
import CourseCard from "@/components/CourseCard";
import { fetchCategories, addCategories } from "@/services/courseCategories";
import { fetchCoursesByCategoryIds } from "@/services/courses";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { userRoles } from "@/assets/constants/authConstants";
import { routes } from "@/assets/constants/routeConstants";

export default function Index() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  useEffect(() => {
    // Extract unique organizers from courses
    const allOrganizers = [
      ...new Set(courses.map((course) => course.organizing_body)),
    ];
    setOrganizers(allOrganizers);
  }, []);

  useEffect(() => {
  const timeoutId = setTimeout(() => {
    fetchCourses(selectedCategories, selectedOrganizers);
  }, 300);

  return () => clearTimeout(timeoutId);
}, [searchTerm]);

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

  const fetchCourses = async (selectedCategories, selectedOrganizersParam) => {
    try {
      setLoading(true);

      const categoryNames = selectedCategories.map(
        (category) => category.category
      );
      const organizersToUse =
        selectedOrganizersParam !== undefined
          ? selectedOrganizersParam
          : selectedOrganizers;

      const coursesData = await fetchCoursesByCategoryIds(
        categoryNames,
        user?._id,
        searchTerm,
        organizersToUse
      );

      setCourses(coursesData?.otherCourses || []);
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
      fetchCourses(updatedCategories);
      return updatedCategories;
    });
  };

  const handleOrganizerChange = (organizer) => {
    setSelectedOrganizers((prev) => {
      const updatedOrganizers = prev.includes(organizer)
        ? prev.filter((o) => o !== organizer)
        : [...prev, organizer];

      // Immediately fetch courses with updated organizers
      fetchCourses(selectedCategories, updatedOrganizers);

      return updatedOrganizers;
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchCourses(selectedCategories);
  };

  const FilterSection = ({ title, children }) => (
    <Card
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          color: "text.primary",
        }}
      >
        <FilterListIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ maxHeight: 300, overflowY: "auto" }}>{children}</Box>
    </Card>
  );

  return (
    <>
      <Navbar />
      <Grid container spacing={3} sx={{ p: 3, minHeight: "100vh" }}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3} lg={2.5}>
          <Box sx={{ position: "sticky", top: 80 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <FilterSection title="Categories">
              {categories.map((category, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedCategories.some(
                        (c) => c._id === category._id
                      )}
                      onChange={() => handleCategoryChange(category._id)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {category.category}
                    </Typography>
                  }
                  sx={{ display: "flex", mb: 0.5 }}
                />
              ))}
            </FilterSection>

            <FilterSection title="Organizers">
              {organizers.map((organizer, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedOrganizers.includes(organizer)}
                      onChange={() => handleOrganizerChange(organizer)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 150,
                      }}
                    >
                      {organizer}
                    </Typography>
                  }
                  sx={{ display: "flex", mb: 0.5 }}
                />
              ))}
            </FilterSection>
          </Box>
        </Grid>

        {/* Course Grid */}
        <Grid item xs={12} md={9} lg={9.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {courses.length} Courses Found
            </Typography>
            <Box>
              {selectedOrganizers.map((organizer) => (
                <Chip
                  key={organizer}
                  label={organizer}
                  onDelete={() => handleOrganizerChange(organizer)}
                  sx={{ mr: 1, borderRadius: 1 }}
                />
              ))}
            </Box>
          </Box>

          <Grid container spacing={3}>
            {courses.map((course, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
