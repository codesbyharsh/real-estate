// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();


 // Update to properly track login state
export const AuthProvider = ({ children }) => {
   const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login function
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
      
      // Handle redirect here
      navigate(response.data.isAdmin ? '/admin/dashboard' : '/');
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Logout function
 const logout = async () => {
  try {
    if (currentUser) {
      await axios.post(`http://localhost:5000/api/users/logout/${currentUser._id}`);
    }
    
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    navigate('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  // Check localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsLoggedIn(true); // Set logged in state
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn, // Expose login status
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};