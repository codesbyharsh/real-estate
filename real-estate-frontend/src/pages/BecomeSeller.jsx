import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BecomeSeller = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState({
    idProof: null,
    addressProof: null
  });

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024) {
      setError(`${fieldName} file exceeds 1MB limit`);
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, PNG, or PDF files are allowed');
      return;
    }

    setFiles(prev => ({ ...prev, [fieldName]: file }));
    setError('');
  };

  const handleBecomeSeller = async () => {
    setLoading(true);
    setError('');

    try {
      if (!files.idProof || !files.addressProof) {
        throw new Error('Please upload all required documents');
      }

      const formData = new FormData();
      formData.append('idProof', files.idProof);
      formData.append('addressProof', files.addressProof);

      await axios.put(
        `http://localhost:5000/api/users/${currentUser._id}/become-seller`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Application submitted! Admin will review your request.');
      navigate('/');
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Become a Seller</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <p className="mb-4">By becoming a seller, you'll be able to:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>List properties for sale</li>
          <li>Manage your listings</li>
          <li>Connect with potential buyers</li>
        </ul>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Required Documents:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Government-issued ID proof (Max 1MB)</li>
            <li>Address proof (Max 1MB)</li>
          </ul>
        </div>

        {/* ID Proof Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ID Proof*</label>
          <input 
            type="file" 
            onChange={(e) => handleFileChange(e, 'idProof')}
            accept="image/*,.pdf"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {files.idProof && (
            <p className="mt-2 text-sm">
              Selected: {files.idProof.name} ({Math.round(files.idProof.size/1024)}KB)
            </p>
          )}
        </div>

        {/* Address Proof Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Address Proof*</label>
          <input 
            type="file" 
            onChange={(e) => handleFileChange(e, 'addressProof')}
            accept="image/*,.pdf"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {files.addressProof && (
            <p className="mt-2 text-sm">
              Selected: {files.addressProof.name} ({Math.round(files.addressProof.size/1024)}KB)
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Note: Your application will be reviewed by our admin team before approval.
          This usually takes 1-2 business days.
        </p>
      </div>
      
      <button
        onClick={handleBecomeSeller}
        disabled={loading || !files.idProof || !files.addressProof}
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Submitting...' : 'Apply to Become Seller'}
      </button>
    </div>
  );
};

export default BecomeSeller;