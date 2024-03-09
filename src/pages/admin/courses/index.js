import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { routes } from "@/assets/constants/routeConstants";
import { fetchCategories } from "@/services/courseCategories";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";

export default function Index() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(true);
    fetchData();
    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading]);

  const router = useRouter();

  const cardStyle = {
    width: 250, // You can set this to the size you desire
    height: 250, // Making the height the same as width to create a square
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // This centers the content horizontally
    textAlign: "center", // Ensures text is centered within the content area
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories("");
      setLoading(false);
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
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
        {categories.map((category) => (
          <Grid item key={category._id["$oid"]} xs={12} sm={6} md={4} lg={3}>
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
      </Grid>
    </Layout>
  );
}
