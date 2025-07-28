import { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-300 from-primary to-secondary  text-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Find Your Dream Property</h1>
        <p className="text-xl">Browse thousands of properties across India</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Properties for Sale</h2>
          
          {properties.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p>No properties found. Be the first to add one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Property Map</h2>
          <PropertyMap properties={properties} />
        </div>
      </div>
    </div>
  );
};

export default Home;