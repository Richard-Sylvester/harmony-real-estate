import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ImagePlus, MapPin, IndianRupee, CheckCircle } from 'lucide-react';
import { bengaluruLocations } from '../data/locations';
import './PostProperty.css';

const PostProperty = () => {
  const navigate = useNavigate();

  // 1. Auth Check
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) navigate('/login');
  }, [navigate]);

  // 2. Merged State (Old backend requirements + ALL New Enterprise UI fields)
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'Sell', category: 'Flat / Apartment',
    price: '', location: '', fullAddress: '', amenities: '', images: [],
    
    // Residential Fields
    bedrooms: '', balconies: '', bathrooms: '', furnishedStatus: '',
    // Commercial Fields
    washrooms: '', parkingSpaces: '',
    // Plot Fields
    boundaryWall: '', openSides: '',
    // PG Fields
    roomType: '', foodIncluded: '',
    
    // General
    superArea: '', superAreaUnit: 'Sq-ft', possessionStatus: 'Ready to Move'
  });

  // 3. Auto-Complete State
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLocMenu, setShowLocMenu] = useState(false);
  const locRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locRef.current && !locRef.current.contains(event.target)) setShowLocMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS ---

  // Handle standard text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle segmented button clicks (Bedrooms, Bathrooms, etc.)
  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Keep your exact autocomplete logic!
  const handleLocationTyping = (e) => {
    const userInput = e.target.value;
    setFormData({ ...formData, location: userInput });
    
    if (userInput.length > 0) {
      const matches = bengaluruLocations.filter(loc => 
        loc.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredLocations(matches);
      setShowLocMenu(true);
    } else {
      setShowLocMenu(false);
    }
  };

  // Keep your exact upload logic!
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const imageFormData = new FormData();
    imageFormData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', imageFormData, config);
      setFormData({ ...formData, images: [...formData.images, data] });
      setUploading(false);
    } catch (error) {
      console.error(error);
      alert('Image upload failed!');
      setUploading(false);
    }
  };

  // Remove an image from the preview array before submitting
  const handleRemoveImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
  };

  // Keep your exact geocoding logic!
  const geocodeAddress = async (address) => {
    try {
      const query = `${address}, Bengaluru, Karnataka, India`;
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  };

  // Merged Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        alert("Please login to post a property!");
        return navigate('/login');
      }

      setUploading(true); 

      let mapCoordinates = { lat: 12.9716, lng: 77.5946 }; 
      const fetchedCoords = await geocodeAddress(formData.location);
      
      if (fetchedCoords) {
        mapCoordinates = fetchedCoords;
      } else {
        alert("Note: Could not pinpoint exact locality, using general Bengaluru area.");
      }

      const cleanAmenities = formData.amenities
        ? formData.amenities.split(',').map(item => item.trim()).filter(Boolean)
        : [];

      const propertyData = {
        ...formData, 
        locationData: mapCoordinates, 
        amenities: cleanAmenities
      };

      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/properties', propertyData, config);
      
      setUploading(false);
      alert('Congratulations! Your property is now live.');
      navigate('/');
    } catch (error) {
      setUploading(false);
      console.error(error);
      alert('Failed to post property. Please try again.');
    }
  };

  // --- WHATSAPP REDIRECT LOGIC ---
  const handleWhatsAppRedirect = () => {
    const phoneNumber = "919110621925"; // Your support number
    const message = "Hi Harmony Support, I need some help posting a property on the platform.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Opens WhatsApp in a new tab securely
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // --- DYNAMIC FEATURE SENSORS ---
  const cat = formData.category?.toLowerCase() || '';
  const propType = formData.type?.toLowerCase() || '';

  const isPlot = cat.includes('plot') || cat.includes('land');
  const isCommercial = cat.includes('commercial') || cat.includes('office') || cat.includes('shop') || cat.includes('warehouse') || cat.includes('co-working');
  const isPG = propType === 'pg' || cat.includes('pg');
  
  // If it's none of the above, it defaults to standard Residential!
  const isResidential = !isPlot && !isCommercial && !isPG;

return (
    <div className="post-property-container fade-in">
      
      {/* --- TWO-COLUMN LAYOUT WRAPPER --- */}
      <div className="post-property-layout">
        
        {/* LEFT COLUMN: THE PREMIUM FORM CARD */}
        <div className="form-column">
          
          {/* 🚨 MOVED HEADER INSIDE THE LEFT COLUMN 🚨 */}
          <div className="post-property-header">
            <h1>Sell or Rent your Property</h1>
            <p>Listing Package <span className="highlight-tag">1 Standard Listing - Free</span></p>
          </div>

          <form className="post-property-form" onSubmit={handleSubmit}>
        
            {/* --- SECTION 1: PROPERTY DETAILS --- */}
            <div className="form-section">
              <h2>Property Details</h2>
              
              <div className="radio-group">
                <span className="input-label">For</span>
                <label className="radio-label">
                  <input type="radio" name="type" value="Sell" checked={formData.type === 'Sell'} onChange={handleChange} />
                  <span className="radio-custom"></span> Sale
                </label>
                <label className="radio-label">
                  <input type="radio" name="type" value="Rent" checked={formData.type === 'Rent'} onChange={handleChange} />
                  <span className="radio-custom"></span> Rent/Lease
                </label>
                {/* Added PG radio button to easily trigger the PG state! */}
                <label className="radio-label">
                  <input type="radio" name="type" value="PG" checked={formData.type === 'PG'} onChange={handleChange} />
                  <span className="radio-custom"></span> PG/Hostel
                </label>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Property Type</label>
                <select name="category" value={formData.category} onChange={handleChange} className="material-input" required>
                  <option value="" disabled>Select Property Type</option>
                  
                  <optgroup label="Residential (Buy/Rent)">
                    <option value="Flat / Apartment">Flat / Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Independent House">Independent House</option>
                  </optgroup>

                  <optgroup label="PG / Co-living">
                    <option value="PG / Co-living">PG / Co-living</option>
                  </optgroup>
                  
                  <optgroup label="Commercial">
                    <option value="Office Space">Office Space</option>
                    <option value="Shop / Showroom">Shop / Showroom</option>
                    <option value="Warehouse / Godown">Warehouse / Godown</option>
                    <option value="Co-working">Co-working</option>
                  </optgroup>
                  
                  <optgroup label="Plots & Land">
                    <option value="Residential Plot">Residential Plot</option>
                    <option value="Commercial Plot">Commercial Plot</option>
                    <option value="Agricultural Land">Agricultural Land</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* --- SECTION 2: PROPERTY LOCATION (WITH AUTOCOMPLETE) --- */}
            <div className="form-section">
              <h2>Property Location</h2>
              
              <div className="input-wrapper" ref={locRef} style={{ position: 'relative' }}>
                <label className="input-label">City / Locality (Powers Map Pin)</label>
                <input 
                  type="text" 
                  name="location" 
                  placeholder="e.g. Indiranagar, Whitefield..." 
                  value={formData.location} 
                  onChange={handleLocationTyping} 
                  onFocus={() => { if(formData.location) setShowLocMenu(true) }}
                  className="material-input" 
                  required
                />
                {showLocMenu && filteredLocations.length > 0 && (
                  <div className="custom-dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredLocations.map((loc, index) => (
                      <div key={index} style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }} onClick={() => { setFormData({...formData, location: loc}); setShowLocMenu(false); }}>
                        <MapPin size={14} color="#C5A059" style={{ display: 'inline', marginRight: '8px' }} /> {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="input-wrapper" style={{ maxWidth: '100%' }}>
                <label className="input-label">Name of Project/Society & Full Address</label>
                <input type="text" name="fullAddress" placeholder="e.g. Prestige Shantiniketan, Tower B..." value={formData.fullAddress} onChange={handleChange} className="material-input" />
              </div>
            </div>

            {/* --- SECTION 3: DYNAMIC PROPERTY FEATURES --- */}
            <div className="form-section">
              <h2>Property Features</h2>
              
              <div className="features-grid">
                
                {/* 1. RESIDENTIAL FEATURES (Houses, Villas, Flats) */}
                {isResidential && (
                  <>
                    <div className="feature-block">
                      <label className="input-label">Bedrooms</label>
                      <div className="segmented-control">
                        {['1', '2', '3', '4', '5+'].map((num) => (
                          <button type="button" key={`bed-${num}`} className={`segment-btn ${formData.bedrooms === num ? 'active' : ''}`} onClick={() => handleSelect('bedrooms', num)}>
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="feature-block">
                      <label className="input-label">Bathrooms</label>
                      <div className="segmented-control">
                        {['1', '2', '3', '4+'].map((num) => (
                          <button type="button" key={`bath-${num}`} className={`segment-btn ${formData.bathrooms === num ? 'active' : ''}`} onClick={() => handleSelect('bathrooms', num)}>
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="feature-block">
                      <label className="input-label">Balconies</label>
                      <div className="segmented-control">
                        {['0', '1', '2', '3+'].map((num) => (
                          <button type="button" key={`balc-${num}`} className={`segment-btn ${formData.balconies === num ? 'active' : ''}`} onClick={() => handleSelect('balconies', num)}>
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="feature-block full-width">
                      <label className="input-label">Furnished Status</label>
                      <div className="segmented-control">
                        {['Furnished', 'Unfurnished', 'Semi-Furnished'].map((status) => (
                          <button type="button" key={status} className={`segment-btn ${formData.furnishedStatus === status ? 'active' : ''}`} onClick={() => handleSelect('furnishedStatus', status)}>
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* 2. COMMERCIAL FEATURES (Offices, Shops) */}
                {isCommercial && (
                  <>
                    <div className="feature-block">
                      <label className="input-label">Washrooms</label>
                      <div className="segmented-control">
                        {['Private', 'Shared', 'None'].map(type => (
                          <button type="button" key={type} className={`segment-btn ${formData.washrooms === type ? 'active' : ''}`} onClick={() => handleSelect('washrooms', type)}>
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="feature-block">
                      <label className="input-label">Parking Spaces</label>
                      <div className="segmented-control">
                        {['1', '2', '3', '4+'].map(num => (
                          <button type="button" key={num} className={`segment-btn ${formData.parkingSpaces === num ? 'active' : ''}`} onClick={() => handleSelect('parkingSpaces', num)}>
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="feature-block full-width">
                      <label className="input-label">Furnished Status</label>
                      <div className="segmented-control">
                        {['Bare Shell', 'Warm Shell', 'Fully Furnished'].map(status => (
                          <button type="button" key={status} className={`segment-btn ${formData.furnishedStatus === status ? 'active' : ''}`} onClick={() => handleSelect('furnishedStatus', status)}>
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* 3. PLOT / LAND FEATURES */}
                {isPlot && (
                  <>
                    <div className="feature-block">
                      <label className="input-label">Boundary Wall Made?</label>
                      <div className="segmented-control">
                        {['Yes', 'No'].map(ans => (
                          <button type="button" key={ans} className={`segment-btn ${formData.boundaryWall === ans ? 'active' : ''}`} onClick={() => handleSelect('boundaryWall', ans)}>
                            {ans}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="feature-block">
                      <label className="input-label">Number of Open Sides</label>
                      <div className="segmented-control">
                        {['1', '2', '3', '4'].map(num => (
                          <button type="button" key={num} className={`segment-btn ${formData.openSides === num ? 'active' : ''}`} onClick={() => handleSelect('openSides', num)}>
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* 4. PG / CO-LIVING FEATURES */}
                {isPG && (
                  <>
                    <div className="feature-block">
                      <label className="input-label">Room Type</label>
                      <div className="segmented-control">
                        {['Single', 'Double', 'Triple', 'Dormitory'].map(type => (
                          <button type="button" key={type} className={`segment-btn ${formData.roomType === type ? 'active' : ''}`} onClick={() => handleSelect('roomType', type)}>
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="feature-block">
                      <label className="input-label">Food Included?</label>
                      <div className="segmented-control">
                        {['Yes', 'No'].map(ans => (
                          <button type="button" key={ans} className={`segment-btn ${formData.foodIncluded === ans ? 'active' : ''}`} onClick={() => handleSelect('foodIncluded', ans)}>
                            {ans}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* --- SECTION 4: AREA, PRICE & DETAILS --- */}
            <div className="form-section">
              <h2>Area, Price & Description</h2>
              
              <div className="area-input-group" style={{ marginBottom: '30px' }}>
                <div className="input-wrapper" style={{flex: 2, marginBottom: 0}}>
                  <label className="input-label">Super Area</label>
                  <input type="number" name="superArea" placeholder="Enter Area" value={formData.superArea} onChange={handleChange} className="material-input" />
                </div>
                <div className="input-wrapper" style={{flex: 1, marginBottom: 0}}>
                  <label className="input-label">&nbsp;</label>
                  <select name="superAreaUnit" value={formData.superAreaUnit} onChange={handleChange} className="material-input">
                    <option value="Sq-ft">Sq-ft</option>
                    <option value="Sq-yrd">Sq-yrd</option>
                    <option value="Sq-m">Sq-m</option>
                  </select>
                </div>
              </div>

              <div className="input-wrapper" style={{ position: 'relative' }}>
                <label className="input-label">Expected Price (₹)</label>
                <IndianRupee size={16} color="#64748b" style={{ position: 'absolute', bottom: '12px', left: 0 }} />
                <input type="number" name="price" placeholder="e.g. 8500000" value={formData.price} onChange={handleChange} className="material-input" style={{ paddingLeft: '25px' }} required />
              </div>

              <div className="input-wrapper" style={{ maxWidth: '100%' }}>
                <label className="input-label">Listing Title</label>
                <input type="text" name="title" placeholder="e.g. Stunning 3BHK with Pool View..." value={formData.title} onChange={handleChange} className="material-input" required />
              </div>

              <div className="input-wrapper" style={{ maxWidth: '100%' }}>
                <label className="input-label">Detailed Description</label>
                <textarea name="description" placeholder="Describe the best features, neighborhood vibe..." value={formData.description} onChange={handleChange} className="material-input" rows="3" required style={{ resize: 'vertical' }}></textarea>
              </div>

              <div className="input-wrapper" style={{ maxWidth: '100%' }}>
                <label className="input-label">Additional Amenities (Comma separated)</label>
                <input type="text" name="amenities" placeholder="e.g. Gym, Swimming Pool, Park..." value={formData.amenities} onChange={handleChange} className="material-input" />
              </div>
            </div>

            {/* --- SECTION 5: PHOTOS (WIRED TO UPLOAD FUNCTION) --- */}
            <div className="form-section">
              <h2>Photos</h2>
              
              <div className="photo-upload-banner">
                <div className="banner-icon"><ImagePlus size={32} color="#C5A059" /></div>
                <div className="banner-text">
                  <h3><strong>85% of Buyers</strong> enquire on Properties with Photos</h3>
                  <p>Upload Photos & Get upto <strong>10X more Enquiries</strong></p>
                </div>
                {/* The hidden input is wired to the styling button */}
                <input type="file" id="magic-upload" onChange={uploadFileHandler} style={{ opacity: 0, position: 'absolute', zIndex: -1 }} />
                <label htmlFor="magic-upload" className="upload-btn" style={{ display: 'inline-block', textAlign: 'center' }}>
                  {uploading ? 'Uploading...' : 'Add Photos Now'}
                </label>
              </div>

              {/* Show the uploaded gallery */}
              {formData.images.length > 0 && (
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                  {formData.images.map((img, index) => (
                    <div key={index} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={img} alt="Property preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      {/* --- NEW: THE REMOVE BUTTON --- */}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(index)} 
                        style={{ 
                          position: 'absolute', 
                          top: '4px', 
                          right: '4px', 
                          background: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: '24px', 
                          height: '24px', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

              {/* SUBMIT */}
          <div className="form-actions">
            <button type="submit" className="primary-action-btn" disabled={uploading} style={{width: '100%', padding: '16px', fontSize: '1.1rem'}}>
              {uploading ? 'Processing...' : 'Post Property Now'}
            </button>
          </div>
          </form>
     </div>

         {/* RIGHT COLUMN: THE STICKY HELP CARD */}
          <div className="help-column">
            <div className="help-card sticky-sidebar">
              
              <div className="help-card-header">
                <h3>Stuck in the form?</h3>
                <p>Contact our Agent!</p>
              </div>

            <div className="help-card-body">
                
                {/* 1. DIRECT CALL BUTTON */}
                <a href="tel:+919110621925" className="help-btn-call">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  +91 91106 21925
                </a>

                <div className="divider-text"><span>OR</span></div>

                <div className="whatsapp-promo">
                  <p style={{ margin: '0 0 5px 0', color: '#64748b' }}>Here's a simpler way</p>
                  <p style={{ margin: '0 0 10px 0', color: '#1b263b' }}>
                    <strong>Now post via <span style={{ color: '#25D366' }}>Whatsapp</span>.</strong>
                  </p>
                    
                    {/* 2. WHATSAPP BUTTON */}
                    <button 
                      type="button" 
                      className="help-btn-whatsapp"
                      onClick={handleWhatsAppRedirect} 
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      Click here
                    </button>
                </div>
              </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PostProperty;