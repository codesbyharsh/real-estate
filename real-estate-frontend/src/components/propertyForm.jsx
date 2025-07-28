import { useState } from 'react';

const PropertyForm = ({ 
  onSubmit, 
  isSubmitting, 
  onImageChange, 
  imagePreviews,
  onRemoveImage
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    lat: '',
    lng: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Property Images (Max 4, 1MB each)
        </label>
        <div className="flex flex-wrap gap-4 mb-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview} 
                alt={`Preview ${index}`} 
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                style={{ transform: 'translate(50%, -50%)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          {imagePreviews.length < 4 && (
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm text-gray-500">Add Image</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={onImageChange}
                multiple
              />
            </label>
          )}
        </div>
      </div>

      {/* Existing form fields */}
      <input
        type="text"
        name="title"
        placeholder="Property Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary"
        required
      />
      
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary"
        rows="3"
      ></textarea>
      
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary"
        required
      />
      
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="lat"
          placeholder="Latitude"
          value={formData.lat}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:ring-2 focus:ring-primary"
          step="0.000001"
          required
        />
        
        <input
          type="number"
          name="lng"
          placeholder="Longitude"
          value={formData.lng}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:ring-2 focus:ring-primary"
          step="0.000001"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-blue-400 text-white font-medium py-3 rounded hover:bg-primary-dark transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Property'}
      </button>
    </form>
  );
};

export default PropertyForm;