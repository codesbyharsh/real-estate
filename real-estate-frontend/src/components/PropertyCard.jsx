import { Link } from 'react-router-dom';
import { MapPinIcon, CurrencyRupeeIcon, HomeIcon } from '@heroicons/react/24/outline';
import ExclamationTriangleIcon from './ExclamationTriangleIcon';

const PropertyCard = ({ property }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
      {property.isDuplicate && (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-sm flex items-center">
          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
          Possible duplicate
        </div>
      )}
      
      <div className="p-4">
        <div className="h-48 bg-gray-200 rounded mb-4 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <HomeIcon className="h-12 w-12" />
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-1">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{property.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{property.location?.address || 'Address not specified'}</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center font-bold">
            <CurrencyRupeeIcon className="h-5 w-5" />
            <span>{property.price?.toLocaleString() || '0'}</span>
          </div>
          
          <Link 
            to={`/property/${property._id}`}
            className="text-primary hover:underline text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;