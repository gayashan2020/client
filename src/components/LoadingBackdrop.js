// components/LoadingBackdrop.js

import React, { useContext } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { LoadingContext } from '@/contexts/LoadingContext';

export const LoadingBackdrop = () => {
  const { loading } = useContext(LoadingContext);

  return (
    <Backdrop open={loading} style={{ color: '#fff', zIndex: 1500 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};