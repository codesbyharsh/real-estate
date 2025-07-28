import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [sellerApplications, setSellerApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
// Update API endpoints
useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/admin/seller-applications'
      );
      
      // Handle response
      if (Array.isArray(response.data)) {
        setSellerApplications(response.data);
      } else {
        setSellerApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchApplications();
}, []);

const handleApprove = async (userId) => {
  try {
    await axios.put(
      `http://localhost:5000/api/admin/approve-seller/${userId}`
    );
    
    // Update state
    setSellerApplications(prev => prev.filter(user => user._id !== userId));
    alert('Seller application approved!');
  } catch (error) {
    console.error('Error approving application:', error);
    alert('Failed to approve application');
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Seller Applications</h2>
        
        {sellerApplications.length === 0 ? (
          <p>No pending applications</p>
        ) : (
          <div className="space-y-4">
            {sellerApplications.map(user => (
              <div key={user._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Applied on: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleApprove(user._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;