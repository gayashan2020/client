// src/components/ShortCuts.js
import React from 'react';
import { Box, Typography, CardContent } from '@mui/material';
import { AssignmentInd, School, Message } from '@mui/icons-material';
import styles from "../styles/Dashboard.module.css";
import { useRouter } from 'next/router';
import { routes } from '@/assets/constants/routeConstants';
import { userRoles } from '@/assets/constants/authConstants';

const ShortCuts = ({ user, navigateShortCuts }) => {
  const router = useRouter();
  
  return (
    <CardContent style={{ display: 'flex', justifyContent: 'center' }}>
      {user?.role && user.role === userRoles.ADMIN && (
        <Box
          className={styles.actionIcons}
          onClick={() => {
            router.push(
              routes.ADMIN_USERS
            );
          }}
        >
          <AssignmentInd
            className="icon"
            sx={{
              fontSize: 60,
              marginBottom: 1,
            }}
          />
          <Typography className="text" align="center">
            Manage Users
          </Typography>
        </Box>
      )}
      <Box
        className={styles.actionIcons}
        onClick={() => {
          navigateShortCuts("course");
        }}
      >
        <School
          className="icon"
          sx={{
            fontSize: 60,
            marginBottom: 1,
          }}
        />
        <Typography className="text" align="center">
          Courses
        </Typography>
      </Box>
      <Box
        className={styles.actionIcons}
        onClick={() => {
          router.push(routes.ADMIN_CHAT);
        }}
      >
        <Message
          className="icon"
          sx={{
            fontSize: 60,
            marginBottom: 1,
          }}
        />
        <Typography className="text" align="center">
          Messages
        </Typography>
      </Box>
    </CardContent>
  );
};

export default ShortCuts;
