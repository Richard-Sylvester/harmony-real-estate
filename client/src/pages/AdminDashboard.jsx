import { useState } from 'react';
import axios from 'axios';
import { Building2, MapPin, IndianRupee, Plus } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'Sell', category: 'Flat',
    price: '', location: '', amenities: '', images: []
  });

  const [uploading, setUploading] = useState(false); // To show a loading message

  // The function that sends the file to your backend
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const imageFormData = new FormData();
    imageFormData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      // Send to your new Node route
      const { data } = await axios.post('/api/upload', imageFormData, config);
      
      // Add the returned Cloudinary URL to your property form data
      setFormData({ ...formData, images: [...formData.images, data] });
      setUploading(false);
    } catch (error) {
      console.error(error);
      alert('Image upload failed!');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };

      // Convert amenities string to array
      const propertyData = {
        ...formData,
        amenities: formData.amenities.split(',').map(item => item.trim())
      };

      await axios.post('/api/properties', propertyData, config);
      alert('Property Listed Successfully in Harmony!');
      setFormData({ title: '', description: '', type: 'Sell', category: 'Flat', price: '', location: '', amenities: '', images: [] });
    } catch (error) {
      alert('Failed to add property. Check if you are logged in.');
    }
  };

  return (
    <div className="admin-container">
      <div className="form-card">
        <h2><Plus size={24} color="#C5A059" /> List New <span className="accent-text">Property</span></h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Property Title (e.g. Harmony Heights)" 
            onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          
          <textarea placeholder="Description" 
            onChange={(e) => setFormData({...formData, description: e.target.value})} required />

          <div className="form-row">
            <select onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option value="Sell">Sell</option>
              <option value="Rent">Rent</option>
              <option value="Construction">Construction</option>
            </select>
            <select onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="Flat">Flat</option>
              <option value="House">House</option>
              <option value="Road Development">Road Development</option>
            </select>
          </div>

          <div className="input-with-icon">
            <IndianRupee size={18} />
            <input type="number" placeholder="Price" 
              onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          </div>

          <div className="input-with-icon">
            <MapPin size={18} />
            <input type="text" placeholder="Location (e.g. Sarjapur Road)" 
              onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>

          {/* THE NEW IMAGE UPLOADER */}
          <div className="input-with-icon" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '15px' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '10px' }}>Upload Property Photo</label>
            <input type="file" onChange={uploadFileHandler} />
            {uploading && <p style={{ color: '#C5A059' }}>Uploading to cloud...</p>}
            
            {/* Show a little preview text if an image is added */}
            {formData.images.length > 0 && (
                <p style={{ color: 'green', fontSize: '0.8rem' }}>✓ Image Attached Ready to Post</p>
            )}
          </div>

          <input type="text" placeholder="Amenities (comma separated: Gym, Pool, Park)" 
            onChange={(e) => setFormData({...formData, amenities: e.target.value})} />

          <button type="submit" className="admin-submit-btn">Publish Listing</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;