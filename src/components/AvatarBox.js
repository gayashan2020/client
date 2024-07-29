// src/components/AvatarBox.js
import React from 'react';
import { Box, Avatar, Button, Typography, List, ListItem, ListItemIcon, ListItemText, Tooltip, CardContent, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Phone, Email, LocationOn, AccountBox, CameraAlt } from '@mui/icons-material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const AvatarBox = ({ user, avatarPreview, handleAvatarChange }) => {
  const contactInfo = [
    { icon: Phone, text: user?.contactNumber, key: 'phone' },
    { icon: AccountBox, text: user?.nicOrPassport, key: 'nic' },
    { icon: Email, text: user?.email, key: 'email' },
    { icon: LocationOn, text: user?.officialAddress, key: 'location' },
  ];

  return (
    <div style={{   
        backgroundColor: "#1e1e1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flex: 1 }}>
    <Card
      style={{
        backgroundColor: "#121212",
        color: "white",
        borderRadius: "10px", // Rounded corners for the card
        overflow: "visible", // Ensure that children can render outside the card
        position: "relative", // Position relative for absolute positioning of children
      }}
    >
      {/* Avatar Box */}
      <Box
        style={{
          position: "absolute",
          top: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        <Avatar
          src={avatarPreview || user?.image}
          sx={{
            width: 150,
            height: 150,
            border: "3px solid #121212",
            boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
          }}
        />
        {/* Upload Button Box */}
        <Box
          style={{
            position: "absolute",
            top: 110, // adjust this value as needed
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2, // above the avatar
          }}
        >
          <Button
            component="label"
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "white",
              minWidth: 0,
              padding: "10px",
              borderRadius: "50%", // Makes the button circular
              position: "absolute", // Position the button absolutely
              top: "calc(100% - 10px)", // Position it 20px from the bottom of the avatar
              left: "calc(50% - 20px)", // Center it horizontally with respect to the avatar
              boxShadow: 3, // Apply some shadow for better visibility
              "& .MuiButton-startIcon": {
                margin: 0, // Remove the margin from the start icon
              },
              "& .MuiButton-label": {
                display: "none", // Hide the label
              },
            }}
          >
            <CameraAlt />
            <VisuallyHiddenInput
              type="file"
              onChange={handleAvatarChange}
            />
          </Button>
        </Box>
      </Box>
      <CardContent style={{ marginTop: "60px" }}>
        <Typography
          variant="h5"
          component="div"
          align="center"
          style={{ paddingTop: "18%" }}
        >
          {user?.fullName
            ? user.fullName
            : user?.firstName
            ? user.firstName + " " + user.lastName
            : user?.institution}
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ color: "#aaaaaa" }}
          align="center"
        >
          {user?.role.replace("_", " ")}
        </Typography>
        <List dense style={{ position: "relative", marginTop: "20px" }}>
          {/* Vertical line container */}
          <Box
            style={{
              position: "absolute",
              left: "50px", // Adjust as needed
              top: 0,
              bottom: 0,
              width: "1px", // Line thickness
              backgroundColor: "white",
            }}
          />
          {contactInfo.map((info, index) => (
            <ListItem key={info.key} style={{ padding: "8px 10px" }}>
              <ListItemIcon
                style={{
                  minWidth: "30px",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                <info.icon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Tooltip title={info.text} placement="top">
                    <Typography
                      type="body2"
                      sx={{
                        color: "white",
                        marginLeft: "45px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {info.text}
                    </Typography>
                  </Tooltip>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  </div>
  );
};

export default AvatarBox;
