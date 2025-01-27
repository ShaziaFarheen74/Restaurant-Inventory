import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('jwt') ? true : false);
  const [inventory, setInventory] = useState([]);  // State to hold the inventory

  const login = (token, role) => {
    localStorage.setItem('jwt', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
  };

  // Update inventory in context (for all components)
  const updateInventory = (newItem) => {
    setInventory(prevInventory => [...prevInventory, newItem]);
  };

  // Set initial inventory when fetched
  const setFetchedInventory = (items) => {
    setInventory(items);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, inventory, updateInventory, setFetchedInventory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
