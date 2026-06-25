import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Maximize, Minimize } from 'lucide-react';
import L from 'leaflet';
import './PropertyMap.css';

// --- THE REACT-LEAFLET ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ----------------------------------

// Helper component: Handles both container size updates AND dynamic zoom toggling
const MapResizer = ({ isFullscreen }) => {
  const map = useMap();
  
  useEffect(() => {
    // 1. Force Leaflet to recalculate tile layout when size changes
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // 2. THE FIX: Dynamically enable or disable scroll wheel zoom
    if (isFullscreen) {
      map.scrollWheelZoom.enable();  // Let them scroll naturally in full screen
    } else {
      map.scrollWheelZoom.disable(); // Prevent the scroll trap in standard view
    }
    
  }, [isFullscreen, map]);

  return null;
};

const PropertyMap = ({ properties }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const bengaluruCenter = [12.9716, 77.5946]; 

  const mappableProperties = properties.filter(
    (p) => p.locationData && p.locationData.lat && p.locationData.lng
  );

  return (
    // We append the 'is-fullscreen' class when the state is true
    <div className={`map-section-wrapper ${isFullscreen ? 'is-fullscreen' : ''}`}>
      
      {/* Hide the standard header when in full screen mode */}
      {!isFullscreen && (
        <div className="map-section-header">
          <h2>Explore on Map</h2>
          <div className="map-header-line"></div>
        </div>
      )}
      
      <div className="premium-map-frame">
        
        {/* Our Custom Fullscreen Toggle Button */}
        <button 
          className="fullscreen-toggle-btn" 
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}</span>
        </button>

        <MapContainer center={bengaluruCenter} zoom={11} scrollWheelZoom={false} zoomControl={false}>
          {/* Inject our resizer hook */}
          <MapResizer isFullscreen={isFullscreen} />

          {/* INJECT THE NEW ZOOM CONTROLS HERE */}
          <ZoomControl position="topright" />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mappableProperties.map((property) => (
            <Marker 
              key={property._id} 
              position={[property.locationData.lat, property.locationData.lng]}
            >
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <img 
                      src={property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400'} 
                      alt={property.title} 
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
                  />
                  <h4 style={{ margin: '0 0 5px 0', color: '#1B263B' }}>{property.title}</h4>
                  <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#C5A059' }}>
                      ₹{property.price.toLocaleString('en-IN')}
                  </p>
                  <Link to={`/property/${property._id}`} style={{ display: 'block', background: '#1B263B', color: 'white', textDecoration: 'none', padding: '5px', borderRadius: '5px' }}>
                      View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PropertyMap;