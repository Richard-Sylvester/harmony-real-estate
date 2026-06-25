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

  // 2. Merged State (Old backend requirements + New Magicbricks UI fields)
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'Sell', category: 'Residential House',
    price: '', location: '', fullAddress: '', amenities: '', images: [],
    // New Feature Fields
    bedrooms: '', balconies: '', bathrooms: '', furnishedStatus: '',
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

      // Combine amenities string with the new feature data so your backend accepts it seamlessly
      // 1. Just format the custom amenities string cleanly
      const cleanAmenities = formData.amenities
        ? formData.amenities.split(',').map(item => item.trim()).filter(Boolean)
        : [];

      // 2. Send the entire formData directly, keeping all fields strictly separated!
      const propertyData = {
        ...formData, // This seamlessly unpacks bedrooms, bathrooms, superArea, etc.
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

  return (
    <div className="post-property-container fade-in">
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
            {/* Kept your exact dropdown logic */}
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

        {/* --- SECTION 3: PROPERTY FEATURES --- */}
        <div className="form-section">
          <h2>Property Features</h2>
          
          <div className="features-grid">
            {formData.category !== 'Plot' && (
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
            <input type="file" id="magic-upload" onChange={uploadFileHandler} style={{ display: 'none' }} />
            <label htmlFor="magic-upload" className="upload-btn" style={{ display: 'inline-block', textAlign: 'center' }}>
              {uploading ? 'Uploading...' : 'Add Photos Now'}
            </label>
          </div>

          {/* Show the uploaded gallery */}
          {formData.images.length > 0 && (
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
              {formData.images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={img} alt="Property preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <CheckCircle size={18} color="#10b981" style={{ position: 'absolute', top: '5px', right: '5px', background: 'white', borderRadius: '50%' }} />
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
  );
};

export default PostProperty;