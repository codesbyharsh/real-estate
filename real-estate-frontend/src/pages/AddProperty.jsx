import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/propertyForm';


const AddProperty = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/properties', formData);
      alert(`Property added successfully! ${response.data.isDuplicate ? '(Marked as possible duplicate)' : ''}`);
      navigate('/');
    } catch (error) {
      console.error('Error adding property:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <PropertyForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default AddProperty;