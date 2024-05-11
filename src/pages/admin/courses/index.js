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
} from "@mui/material";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { fetchCategories, addCategories } from "@/services/courseCategories";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import { userRoles } from "@/assets/constants/authConstants";

export default function Index() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); // For modal visibility
  const [newCategory, setNewCategory] = useState(""); // For new category name
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchCategoriesAndUser();
  }, [setLoading]);

  const fetchCategoriesAndUser = async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch current user", error);
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
    height: 250, // Making the height the same as width to create a square
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // This centers the content horizontally
    textAlign: "center", // Ensures text is centered within the content area
  };

  const navigateToCategory = (category) => {
    // Navigate to the dynamic route for Category details
    router.push(`/admin/courses/${category._id}`);
  };

  return (
    <Layout>
      <Grid
        container
        spacing={2}
        alignItems="start"
        justifyContent="flex-start"
        style={{ padding: "20px", minHeight: "100vh" }}
      >
        {categories.map((category, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Grid item>
              <Card sx={cardStyle} onClick={() => navigateToCategory(category)}>
                <CardActionArea sx={{ height: "100%", minHeight: "100px" }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {category.category}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        ))}
        {user &&
          [
            userRoles.SUPER_ADMIN,
            userRoles.ADMIN,
            userRoles.CPD_PROVIDER,
          ].includes(user.role) && (
            <Grid item key={"addCategory"} xs={12} sm={6} md={4} lg={3}>
              <Grid item>
                <Card sx={cardStyle} onClick={handleOpen}>
                  <CardActionArea sx={{ height: "100%", minHeight: "100px" }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        Add a New Category
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          )}
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
