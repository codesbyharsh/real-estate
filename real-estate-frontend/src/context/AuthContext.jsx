import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (identifier, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        identifier,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setCurrentUser(response.data);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        await axios.post(`http://localhost:5000/api/users/logout/${currentUser._id}`);
      }
      setCurrentUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};