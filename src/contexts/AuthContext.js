import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchCurrentUser } from '@/services/users';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchCurrentUser()
        .then((currentUser) => {
          setUser(currentUser);
          setIsAuthenticated(true);
        })
        .catch(() => {
          Cookies.remove('token');
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
