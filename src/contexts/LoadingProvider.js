// contexts/LoadingProvider.js

import React, { useState } from 'react';
import { LoadingContext } from './LoadingContext';

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};