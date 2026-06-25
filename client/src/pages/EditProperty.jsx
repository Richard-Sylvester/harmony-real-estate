import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';
import './PostProperty.css'; // Reusing your existing form styles!

const EditProperty = () => {
  const { id } = useParams(); // Grabs the ID from the URL
  const navigate = useNavigate();

  // State for our editable fields
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // FIXED: Restored the images state array
  const [uploadingImage, setUploadingImage] = useState(false); 

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. FETCH EXISTING DATA ON LOAD
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`/api/properties/${id}`);
        // Pre-fill the form with the database data
        setPrice(data.price);
        setDescription(data.description);
        setImages(data.images || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching property:", error);
        alert("Could not load property details.");
        navigate('/dashboard'); // Kick them back to safety if it fails
      }
    };

    fetchProperty();
  }, [id, navigate]);

  // Image Handlers
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    const formData = new FormData();
    // This perfectly matches your backend's upload.single('image')
    formData.append('image', file); 

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}` 
        }
      };

      // Hit your existing route
      const res = await axios.post('/api/upload', formData, config);
      
      // Grab the string directly from res.data
      const uploadedUrl = res.data; 
      
      setImages([...images, uploadedUrl]);
      setUploadingImage(false);
      
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Check your console.");
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // 2. SAVE THE UPDATES
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      };

      // Send the updated 3 fields to the backend
      await axios.put(`/api/properties/${id}`, {
        price: Number(price),
        description,
        images
      }, config);

      alert("Property updated successfully!");
      navigate('/dashboard'); // Send them back to the dashboard
      
    } catch (error) {
      console.error("Error updating property:", error);
      alert(error.response?.data?.message || "Failed to update property.");
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading property details...</div>;

  return (
    <div className="post-property-container">
      <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Edit Property Details</h2>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ background: 'none', border: 'none', color: '#415A77', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>

      <form className="property-form" onSubmit={handleSave}>
        
        {/* --- PRICE EDIT --- */}
        <div className="form-section">
          <div className="input-wrapper">
            <label className="input-label">Updated Price (₹)</label>
            <input 
              type="number" 
              className="material-input" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
            />
          </div>
        </div>

        {/* --- DESCRIPTION EDIT --- */}
        <div className="form-section">
          <div className="input-wrapper">
            <label className="input-label">Description (Add renovations, availability times, etc.)</label>
            <textarea 
              className="material-input" 
              rows="5" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
        </div>

        {/* --- IMAGES EDIT --- */}
        <div className="form-section">
          <label className="input-label">Manage Images</label>
          
          {/* Display Current Images */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
            {images.map((img, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img src={img} alt={`Property ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage(index)}
                  style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* FIXED: The Clean File Upload Button */}
          <div className="file-upload-wrapper">
            <label 
              htmlFor="image-upload" 
              style={{
                display: 'inline-block',
                backgroundColor: '#1b263b',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: uploadingImage ? 'not-allowed' : 'pointer',
                opacity: uploadingImage ? 0.7 : 1,
                fontSize: '14px'
              }}
            >
              {uploadingImage ? "Uploading..." : "+ Upload New Image"}
            </label>
            <input 
              type="file" 
              id="image-upload" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={uploadingImage}
              style={{ display: 'none' }} // Hides the ugly default browser button
            />
          </div>
        </div>

        {/* --- SUBMIT --- */}
        <div className="form-actions" style={{ marginTop: '30px' }}>
          <button type="submit" className="submit-btn" disabled={saving} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Save size={20} /> {saving ? "Saving Updates..." : "Save Updates"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProperty;