import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Home } from 'lucide-react';
import axios from 'axios';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  
  // --- NEW: State to track if the heart is filled ---
  const [isSaved, setIsSaved] = useState(false);

  // --- NEW: Check if the property is already saved when the card loads ---
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.savedProperties) {
      setIsSaved(userInfo.savedProperties.includes(property._id));
    }
  }, [property._id]);

  // --- NEW: The toggle function ---
  const handleToggleSave = async (e) => {
    e.preventDefault(); // Prevents the <Link> wrapper from navigating to the details page!
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      alert("Please log in to save properties!");
      return navigate('/login');
    }

    try {
      // Optimistic UI Update: Flip the heart instantly so it feels fast
      setIsSaved(!isSaved); 

      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`/api/users/saved/${property._id}`, {}, config);
      
      // Update local storage so the new array persists if they refresh the page
      const updatedUser = { ...userInfo, savedProperties: data.savedProperties };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

    } catch (error) {
      console.error("Error toggling save:", error);
      setIsSaved(isSaved); // Revert the heart if the backend request failed
    }
  };

  // 1. Pro-level Indian Rupee Formatting
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.price);

  // 2. Image Fallback
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'; 

  // 3. Dynamic Badge Logic
  const isRent = property.type?.toLowerCase() === 'rent';
  // Check if it's still on the market
  const isAvailable = !property.status || property.status === 'Available';

  return (
    <Link to={`/property/${property._id}`} className="premium-card-link">
      <div className="premium-property-card">
        
        {/* --- TOP: IMAGE & OVERLAYS --- */}
        <div className="card-image-wrapper">
          <img src={imageUrl} alt={property.title} className="card-image" />
          
          {/* --- NEW: PREMIUM BADGES (Pinned to bottom-left) --- */}
          <div className="premium-badge-container">
            {property.isFeatured && (
              <span className="premium-badge badge-gold">★ Featured</span>
            )}
            {property.isCompanyOwned && (
              <span className="premium-badge badge-verified">✓ Harmony Owned</span>
            )}
          </div>

          {/* --- EXISTING DYNAMIC BADGE (For Rent/Sale) --- */}
          {isAvailable ? (
            <div className={`card-badge ${isRent ? 'badge-rent' : 'badge-sell'}`}>
              {isRent ? 'For Rent' : 'For Sale'}
            </div>
          ) : (
            <div className="card-badge badge-sold" style={{ backgroundColor: '#fafafa', color: '#000000', fontWeight: 'bold' }}>
              {property.status.toUpperCase()}
            </div>
          )}

          {/* --- EXISTING HEART BUTTON --- */}
          <button className="card-heart-btn" onClick={handleToggleSave}>
            <Heart 
              size={20} 
              fill={isSaved ? '#ef4444' : 'transparent'} 
              color={isSaved ? '#ef4444' : 'currentColor'} 
            />
          </button>

          <div className="view-details-overlay">
            <span className="view-details-text">View Details</span>
          </div>

        </div>

        {/* --- BOTTOM: DETAILS --- */}
        <div className="card-content">
          
          <div className="card-price-row">
            <span className="card-price">{formattedPrice}</span>
            {isRent && <span className="card-rent-period">/ month</span>}
          </div>

          <h3 className="card-title">{property.title}</h3>

          <div className="card-location">
            <MapPin size={15} />
            <span>{property.location}</span>
          </div>

          <div className="card-divider"></div>

          <div className="card-footer">
            <div className="card-footer-item">
              <Home size={16} color="#8a8a8a" />
              <span>{property.category}</span>
            </div>
            
            {property.amenities && property.amenities.length > 0 && (
              <div className="card-footer-item">
                <span className="amenities-text">
                  + {property.amenities.length} Amenities
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;