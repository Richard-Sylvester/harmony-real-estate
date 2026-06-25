import { FaWhatsapp } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPortal } from 'react-dom'; // Add this right near your other React imports!
import axios from 'axios';
import { 
  MapPin, BedDouble, Bath, Maximize, Sofa, CalendarCheck, 
  Building, Heart, Share2, Phone, User, CheckCircle2,
  X, ChevronLeft, ChevronRight // Imported Lightbox icons
} from 'lucide-react';
import './PropertyPage.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`/api/properties/${id}`);
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching property:", error);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Lightbox Navigation Logic
  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!property) return <div className="error-screen"><h2>Property not found.</h2><Link to="/">Go Back</Link></div>;

  // Formatting
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(property.price);

  const mainImage = property.images?.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
  const subImages = property.images?.slice(1, 4) || []; 

  return (
    <div className="property-details-page fade-in">
      
      {/* --- 1. HERO IMAGE GALLERY --- */}
      <div className={`gallery-container ${subImages.length > 0 ? 'has-grid' : 'single-image'}`}>
        <div className="main-image-wrap" onClick={() => setLightboxIndex(0)} style={{ cursor: 'pointer' }}>
          <img src={mainImage} alt={property.title} className="gallery-img main-img" />
          <div className="gallery-badges">
            <span className={`status-badge ${property.type?.toLowerCase() === 'rent' ? 'rent' : 'sell'}`}>
              {/* FIXED BADGE TEXT WRAPPING AND LOGIC */}
              FOR {property.type?.toLowerCase() === 'sell' ? 'SALE' : 'RENT'}
            </span>
          </div>
        </div>
        
        {subImages.length > 0 && (
          <div className="sub-images-grid">
            {subImages.map((img, i) => (
              <div 
                key={i} 
                className="sub-image-wrap" 
                onClick={() => setLightboxIndex(i + 1)} // i + 1 because main image is 0
                style={{ cursor: 'pointer' }}
              >
                <img src={img} alt={`View ${i+2}`} className="gallery-img sub-img" />
                {i === 2 && property.images.length > 4 && (
                  <div className="more-images-overlay">
                    <span>+{property.images.length - 4} Photos</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="details-layout">
        {/* --- 2. LEFT COLUMN: MAIN CONTENT --- */}
        <div className="main-content-column">
          
          <div className="property-header-section">
            <div className="header-top-row">
              <h1 className="property-main-title">{property.title}</h1>
              <div className="header-actions">
                <button className="icon-action-btn"><Share2 size={20} /></button>
                <button className="icon-action-btn"><Heart size={20} /></button>
              </div>
            </div>
            <p className="property-full-address"><MapPin size={18} /> {property.fullAddress || property.location}</p>
            <div className="property-price-display">
              {formattedPrice} {property.type?.toLowerCase() === 'rent' && <span className="rent-month">/ month</span>}
            </div>
          </div>

          {/* HIGHLIGHTS GRID */}
          <div className="content-card highlights-card">
            <h2>Property Overview</h2>
            <div className="highlights-grid">
              
              {property.bedrooms && (
                <div className="highlight-item">
                  <div className="hl-icon"><BedDouble size={24} /></div>
                  <div className="hl-data">
                    <span className="hl-label">Bedrooms</span>
                    <span className="hl-value">{property.bedrooms} Beds</span>
                  </div>
                </div>
              )}

              {property.bathrooms && (
                <div className="highlight-item">
                  <div className="hl-icon"><Bath size={24} /></div>
                  <div className="hl-data">
                    <span className="hl-label">Bathrooms</span>
                    <span className="hl-value">{property.bathrooms} Baths</span>
                  </div>
                </div>
              )}

              {property.superArea && (
                <div className="highlight-item">
                  <div className="hl-icon"><Maximize size={24} /></div>
                  <div className="hl-data">
                    <span className="hl-label">Super Area</span>
                    <span className="hl-value">{property.superArea} {property.superAreaUnit}</span>
                  </div>
                </div>
              )}

              {property.furnishedStatus && (
                <div className="highlight-item">
                  <div className="hl-icon"><Sofa size={24} /></div>
                  <div className="hl-data">
                    <span className="hl-label">Furnishing</span>
                    <span className="hl-value">{property.furnishedStatus}</span>
                  </div>
                </div>
              )}

              {property.possessionStatus && (
                <div className="highlight-item">
                  <div className="hl-icon"><CalendarCheck size={24} /></div>
                  <div className="hl-data">
                    <span className="hl-label">Status</span>
                    <span className="hl-value">{property.possessionStatus}</span>
                  </div>
                </div>
              )}

              <div className="highlight-item">
                <div className="hl-icon"><Building size={24} /></div>
                <div className="hl-data">
                  <span className="hl-label">Property Type</span>
                  <span className="hl-value">{property.category}</span>
                </div>
              </div>

            </div>
          </div>

          <div className="content-card description-card">
            <h2>Description</h2>
            <p className="property-description">{property.description}</p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="content-card amenities-card">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="amenity-pill">
                    <CheckCircle2 size={16} color="#10b981" /> {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- 3. RIGHT COLUMN: STICKY SIDEBAR (BROKER MODEL) --- */}
        <div className="sidebar-column">
          <div className="sticky-contact-card">
            <h3>Contact Agent</h3>
            
            <div className="owner-profile">
              <div className="owner-avatar" style={{ backgroundColor: '#1b263b' }}>
                <User size={30} color="white" />
              </div>
              <div className="owner-info">
                <h4>Harmony Real Estate</h4> 
                <p>Official Property Advisor</p>
              </div>
            </div>

            <div className="contact-actions">
              <a 
                href={`https://wa.me/919110621925?text=${encodeURIComponent(
                  `Hi Harmony Real Estate! I am interested in this property: ${property.title}. \n\nCan you share more details? \nLink: ${window.location.href}`
                )}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-contact-btn"
              >
                <FaWhatsapp size={22} /> Chat on WhatsApp
              </a>

              <a href="tel:+919110621925" className="call-contact-btn">
                <Phone size={18} /> +91 91106 21925
              </a>
            </div>

            <div className="trust-banner">
              <CheckCircle2 size={16} color="#C5A059" /> 
              <span>Schedule a verified site visit through our official advisors.</span>
            </div>
          </div>
        </div>
      </div>

     {/* --- 4. FULLSCREEN LIGHTBOX MODAL (TELEPORTED VIA PORTAL) --- */}
      {lightboxIndex !== null && createPortal(
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          
          <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>
            <X size={35} />
          </button>

          {property.images.length > 1 && (
            <>
              <button className="lightbox-nav left" onClick={prevImage}>
                <ChevronLeft size={40} />
              </button>
              <button className="lightbox-nav right" onClick={nextImage}>
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <img 
            src={property.images[lightboxIndex]} 
            alt="Enlarged property view" 
            className="lightbox-active-img"
            onClick={(e) => e.stopPropagation()} 
          />
          
          <div className="lightbox-counter">
            {lightboxIndex + 1} / {property.images.length}
          </div>
        </div>,
        document.body // <--- THIS TELLS REACT TO TELEPORT IT TO THE ROOT BODY
      )}

    </div> // End of .property-details-page
  );
};

export default PropertyDetails;