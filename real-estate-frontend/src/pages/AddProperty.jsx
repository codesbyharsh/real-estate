import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/propertyForm';

// Add your Cloudinary credentials directly in the file
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'du6usa42l';
const CLOUDINARY_UPLOAD_PRESET = 'real_estate_uploads'; // Create this in Cloudinary dashboard

const AddProperty = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setError('');
    
    if (images.length + files.length > 4) {
      setError('You can upload a maximum of 4 images');
      return;
    }
    
    const validFiles = [];
    const validPreviews = [];
    
    files.forEach(file => {
      if (!file.type.match('image.*')) {
        setError('Only image files are allowed (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 1048576) {
        setError(`Image ${file.name} is too large (max 1MB)`);
        return;
      }
      
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });
    
    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...validPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (formData) => {
    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
     const imageUploadPromises = images.map(file => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'real_estate_uploads'); // Use this exact name
    return axios.post(
      `https://api.cloudinary.com/v1_1/du6usa42l/image/upload`,
      formData
    );
  });
      const imageResponses = await Promise.all(imageUploadPromises);
      const imageUrls = imageResponses.map(res => res.data.secure_url);

      const propertyData = {
        ...formData,
        images: imageUrls,
        location: {
          address: formData.address,
          coordinates: {
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng)
          }
        }
      };

      const response = await axios.post(
        'http://localhost:5000/api/properties', 
        propertyData
      );
      
      alert(`Property added successfully! ${response.data.isDuplicate ? '(Marked as possible duplicate)' : ''}`);
      navigate('/');
    } catch (error) {
      console.error('Error adding property:', error);
      setError(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <PropertyForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          onImageChange={handleImageChange}
          imagePreviews={imagePreviews}
          onRemoveImage={removeImage}
        />
      </div>
    </div>
  );
};

export default AddProperty;