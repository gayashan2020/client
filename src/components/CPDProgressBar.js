import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const CPDProgressBar = ({ label, value, max }) => {
  // Calculate progress and ensure it doesn't exceed 100%
  const progress = Math.min((value / max) * 100, 100);

  return (
    <Box>
      <Typography
        variant="body2"
        style={{ fontWeight: "bold", marginTop: "10px" }}
      >
        {label}
      </Typography>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress
            color="primary"
            variant="determinate"
            value={progress}
            style={{ height: "10px", borderRadius: "5px" }}
          />
        </Box>
        <Box minWidth={35}>
          <Typography
            variant="body2"
            color="white"
          >{`${value}/${max}`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CPDProgressBar;
