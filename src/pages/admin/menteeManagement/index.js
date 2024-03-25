import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardActionArea,
  Box,
  CardMedia
} from "@mui/material";
import Layout from "@/components/Layout";
import { fetchMenteesByMentor } from "@/services/mentorService";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";

const MentorMenteesList = () => {
  const [mentees, setMentees] = useState([]);
  const [error, setError] = useState("");
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const user = await fetchCurrentUser();
        if (user?._id) {
          const menteeDetails = await fetchMenteesByMentor(user._id);
          setMentees(menteeDetails);
        } else {
          setError("User not found");
        }
      } catch (error) {
        setError("Failed to fetch mentees");
      } finally {
        setLoading(false);
      }
    })();
  }, [setLoading]);

  return (
    <Layout>
      <Box sx={{ padding: "20px" }}>
        {/* Header outside the Grid container */}
        <Typography variant="h4" gutterBottom>
          Mentees List
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        {/* Grid container for the cards */}
        <Grid container spacing={3}>
          {mentees.map((mentee, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardActionArea sx={{ height: "100%" }}>
                  {mentee.image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={mentee.image}
                      alt={
                        mentee.fullName ||
                        `${mentee.firstName} ${mentee.lastName}`
                      }
                    />
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {mentee.fullName ||
                        `${mentee.firstName} ${mentee.lastName}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Occupation: {mentee.occupation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {mentee.city}, {mentee.district}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contact: {mentee.contactNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      SLMC Reg Number: {mentee.slmcRegNumber || "N/A"}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {mentees.length === 0 && !error && (
            <Grid item xs={12}>
              <Typography>No mentees found.</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Layout>
  );
};

export default MentorMenteesList;
