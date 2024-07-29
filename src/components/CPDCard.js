// src/components/CPDCard.js
import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';
import CPDProgressBar from './CPDProgressBar';
import { userRoles } from '@/assets/constants/authConstants';

const CPDCard = ({ user, setting, monthlyCPD, yearlyCPD }) => {
  return (
    <Card
      style={{
        backgroundColor: '#2e2e2e',
        color: 'white',
        height: '100%',
        width: '100%',
        alignContent: 'center',
      }}
    >
      {user?.role && user.role === userRoles.STUDENT && (
        <CardContent>
          <CPDProgressBar
            label="Monthly CPD target"
            value={setting?.currentCPD}
            max={monthlyCPD}
          />
          <CPDProgressBar
            label="Yearly CPD target"
            value={setting?.currentCPD}
            max={yearlyCPD}
          />
        </CardContent>
      )}
      <CardContent style={{ display: 'flex', justifyContent: 'center' }}>
        {user?.role && user.role === userRoles.ADMIN && (
          <Typography variant="h6">CPD Chart</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CPDCard;
