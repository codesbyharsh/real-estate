import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
const BecomeSeller = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
const handleBecomeSeller = async () => {
  try {
    await axios.put(
      `http://localhost:5000/api/users/${currentUser._id}/become-seller`
    );
    alert('Application submitted! Admin will review your request.');
    navigate('/');
  } catch (error) {
    alert('Failed to submit application. Please try again.');
  }
};

 return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Become a Seller</h2>
      
      <div className="mb-6">
        <p className="mb-4">By becoming a seller, you'll be able to:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>List properties for sale</li>
          <li>Manage your listings</li>
          <li>Connect with potential buyers</li>
        </ul>
        <p className="text-sm text-gray-600">
          Note: Your application will be reviewed by our admin team before approval.
        </p>
      </div>
      
      <button
        onClick={handleBecomeSeller}
        className="w-full bg-blue-400 text-white py-2 px-4 rounded hover:bg-primary-dark transition"
      >
        Apply to Become Seller
      </button>
    </div>
  );
};

export default BecomeSeller;