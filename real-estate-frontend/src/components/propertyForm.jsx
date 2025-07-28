import { useState } from 'react';

const PropertyForm = ({ onSubmit, isSubmitting }) => {
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
    onSubmit({
      ...formData,
      location: {
        address: formData.address,
        coordinates: { 
          lat: parseFloat(formData.lat), 
          lng: parseFloat(formData.lng) 
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
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
        className={`w-full bg-primary text-white font-medium py-3 rounded hover:bg-primary-dark transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Property'}
      </button>
    </form>
  );
};

export default PropertyForm;