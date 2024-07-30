// src/components/UserStatsTabs.js
import React, { useState } from 'react';
import { Tabs, Tab, Box, Card, Typography } from '@mui/material';
import PieChartComponent from '@/components/PieChartComponent';

const UserStatsTabs = ({ occupationData, userData }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Card className="chartCard">
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="User Distribution by Occupation" />
        <Tab label="User Count by Role" />
      </Tabs>
      {tabIndex === 0 && (
        <Box p={3}>
          {/* <Typography variant="h6" align="center">User Distribution by Occupation</Typography> */}
          <PieChartComponent data={occupationData} />
        </Box>
      )}
      {tabIndex === 1 && (
        <Box p={3}>
          {/* <Typography variant="h6" align="center">User Count by Role</Typography> */}
          <PieChartComponent
            data={Object.keys(userData).map(role => ({ occupation: role, count: userData[role] }))}
          />
        </Box>
      )}
    </Card>
  );
};

export default UserStatsTabs;
