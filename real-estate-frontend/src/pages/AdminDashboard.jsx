import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [sellerApplications, setSellerApplications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'applications') {
          const response = await axios.get('http://localhost:5000/api/admin/seller-applications');
          setSellerApplications(response.data);
        } else {
          const response = await axios.get('http://localhost:5000/api/admin/users');
          setAllUsers(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  const handleApplicationAction = async (userId, action) => {
    try {
      // Direct API call without authentication
      await axios.put(`http://localhost:5000/api/admin/seller-application/${userId}`, { action });
      
      // Update UI
      setSellerApplications(prev => prev.filter(user => user._id !== userId));
      
      alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      alert(`Failed to ${action} application: ${error.response?.data?.message || error.message}`);
    }
  };

  const openDocument = (url) => {
    if (!url) {
      alert('Document not available');
      return;
    }
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'applications'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('applications')}
        >
          Seller Applications
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'users'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
      </div>

      {activeTab === 'applications' ? (
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
                          <button
                            onClick={() => openDocument(user.sellerApplication.documents.idProof)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <DocumentTextIcon className="h-5 w-5 mr-1" />
                            <span className="text-sm">ID Proof</span>
                          </button>
                        )}
                        
                        {user.sellerApplication.documents.addressProof && (
                          <button
                            onClick={() => openDocument(user.sellerApplication.documents.addressProof)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <DocumentTextIcon className="h-5 w-5 mr-1" />
                            <span className="text-sm">Address Proof</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  allUsers.map(user => (
                    <React.Fragment key={user._id}>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button 
                              onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                              className="mr-2"
                            >
                              {expandedUser === user._id ? (
                                <ChevronUpIcon className="h-4 w-4" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4" />
                              )}
                            </button>
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.sellerApplication?.status === 'pending' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending Approval
                            </span>
                          ) : user.isSellerApproved ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {user.role}
                            </span>
                          )}
                        </td>
                      </tr>
                      {expandedUser === user._id && (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">User Details</h4>
                                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                {user.sellerApplication && (
                                  <>
                                    <p>Business Name: {user.sellerApplication.businessName || 'N/A'}</p>
                                    <p>Phone: {user.sellerApplication.phone || 'N/A'}</p>
                                  </>
                                )}
                              </div>
                              {user.sellerApplication?.documents && (
                                <div>
                                  <h4 className="font-medium mb-2">Submitted Documents</h4>
                                  <div className="flex flex-wrap gap-4">
                                    {user.sellerApplication.documents.idProof && (
                                      <button
                                        onClick={() => openDocument(user.sellerApplication.documents.idProof)}
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                      >
                                        <DocumentTextIcon className="h-5 w-5 mr-1" />
                                        <span className="text-sm">ID Proof</span>
                                      </button>
                                    )}
                                    {user.sellerApplication.documents.addressProof && (
                                      <button
                                        onClick={() => openDocument(user.sellerApplication.documents.addressProof)}
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                      >
                                        <DocumentTextIcon className="h-5 w-5 mr-1" />
                                        <span className="text-sm">Address Proof</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;