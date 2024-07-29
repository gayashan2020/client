import React from 'react';
import { Box, Typography, Card, Avatar } from '@mui/material';


const MentorCard = ({ mentor, user }) => (
    <Card
    style={{
      padding: "35px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      color: "#333",
      marginBottom: "20px",
      position: "relative", // Needed for positioning the tag
    }}
  >
    <Box display="flex" alignItems="center" mb={2}>
      <Avatar src={mentor.image} sx={{ width: 80, height: 80 }} />
      <Box ml={2}>
        <Typography variant="h6">{mentor.fullName}</Typography>
        <Typography variant="body2" color="black">
          {mentor.email}
        </Typography>
        <Typography variant="body2" color="black">
          {mentor?.occupation?.replace(/_/g, " ")}
        </Typography>
      </Box>
    </Box>
    {!user?.mentorApprovalStatus && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "orange",
          color: "#fff",
          padding: "5px 10px",
          borderRadius: "0 0 0 10px",
        }}
      >
        Pending Approval
      </Box>
    )}
    {user?.mentorApprovalStatus && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "green",
          color: "#fff",
          padding: "5px 10px",
          borderRadius: "0 0 0 10px",
        }}
      >
        Approved
      </Box>
    )}
  </Card>
  );

  export default MentorCard;