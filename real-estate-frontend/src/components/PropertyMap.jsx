import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const PropertyMap = ({ properties }) => {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer 
        center={[20.5937, 78.9629]} // Center on India
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {properties.map(property => (
          <Marker 
            key={property._id} 
            position={[
              property.location.coordinates.lat, 
              property.location.coordinates.lng
            ]}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-lg">{property.title}</h3>
                <p className="text-primary font-semibold my-1">
                  ₹{property.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{property.location.address}</p>
                
                {property.isDuplicate && (
                  <div className="mt-2 p-2 bg-yellow-100 text-yellow-700 rounded text-sm">
                    ⚠️ Possible duplicate listing
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;