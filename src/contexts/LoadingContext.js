// contexts/LoadingContext.js

import React from 'react';

export const LoadingContext = React.createContext({
  loading: false,
  setLoading: () => {},
});