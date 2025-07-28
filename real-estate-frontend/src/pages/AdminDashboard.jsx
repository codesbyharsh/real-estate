import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline'; // ✅ Correct icons

const AdminDashboard = () => {
  const [sellerApplications, setSellerApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/seller-applications'
        );
        setSellerApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  const handleApplicationAction = async (userId, action) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/seller-application/${userId}`,
        { action } // 'approve' or 'reject'
      );
      
      setSellerApplications(prev => prev.filter(user => user._id !== userId));
      alert(`Application ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      alert(`Failed to ${action} application`);
    }
  };

  const openDocument = (url) => {
    window.open(url, '_blank');
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
          <p className="text-gray-500">No pending applications</p>
        ) : (
          <div className="space-y-4">
            {sellerApplications.map(user => (
              <div key={user._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied on: {new Date(user.sellerApplication?.submittedAt || user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApplicationAction(user._id, 'reject')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApplicationAction(user._id, 'approve')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {user.sellerApplication?.documents && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="font-medium mb-2">Submitted Documents:</h4>
                    <div className="flex flex-wrap gap-4">
                      {user.sellerApplication.documents.idProof && (
                        <div 
                          onClick={() => openDocument(user.sellerApplication.documents.idProof)}
                          className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          {user.sellerApplication.documents.idProof.endsWith('.pdf') ? (
                            <DocumentTextIcon className="h-5 w-5 mr-1" />
                          ) : (
                            <PhotoIcon className="h-5 w-5 mr-1" /> // ✅ Fixed
                          )}
                          <span className="text-sm">ID Proof</span>
                        </div>
                      )}
                      
                      {user.sellerApplication.documents.addressProof && (
                        <div 
                          onClick={() => openDocument(user.sellerApplication.documents.addressProof)}
                          className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          {user.sellerApplication.documents.addressProof.endsWith('.pdf') ? (
                            <DocumentTextIcon className="h-5 w-5 mr-1" />
                          ) : (
                            <PhotoIcon className="h-5 w-5 mr-1" /> // ✅ Fixed
                          )}
                          <span className="text-sm">Address Proof</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
