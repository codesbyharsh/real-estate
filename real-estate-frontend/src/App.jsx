// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddProperty from './pages/AddProperty';
import Register from './pages/Register';
import Login from './pages/Login'; // create this if you haven't yet
import BecomeSeller from './pages/BecomeSeller';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

 // Update route protection
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/become-seller" element={<BecomeSeller />} />
              <Route path="/add-property" element={<AddProperty />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}