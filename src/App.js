import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import OwnerDashboard from './components/OwnerDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import Login from './components/Login';
import InventoryManagement from './components/InventoryManagement';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/inventory" element={<InventoryManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
