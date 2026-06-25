import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Building, Heart, Settings, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import axios from 'axios';
import AccountSettings from '../components/AccountSettings';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');

  const [myProperties, setMyProperties] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async (token) => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch BOTH My Properties and Saved Properties at the same time
        const [myPropsRes, savedPropsRes] = await Promise.all([
          axios.get('/api/properties/myproperties', config),
          axios.get('/api/users/saved', config)
        ]);

        setMyProperties(myPropsRes.data);
        setSavedProperties(savedPropsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo(parsedUser);
      fetchDashboardData(parsedUser.token); 
    }
  }, [navigate]);

  const handleRemoveSavedProperty = async (propertyId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      
      const { data } = await axios.post(`/api/users/saved/${propertyId}`, {}, config);

      setSavedProperties((prev) => prev.filter((p) => p._id !== propertyId));
      
      const updatedSession = { ...userInfo, savedProperties: data.savedProperties };
      localStorage.setItem('userInfo', JSON.stringify(updatedSession));
      setUserInfo(updatedSession);
      
    } catch (error) {
      console.error("Error removing saved property:", error);
      alert("Failed to remove property.");
    }
  };

  const handleDelete = async (propertyId) => {
    console.log("TRYING TO DELETE ID:", propertyId);
    const isConfirmed = window.confirm("Are you sure you want to delete this property? This cannot be undone.");
    
    if (isConfirmed) {
      try {
        const currentUserInfo = JSON.parse(localStorage.getItem('userInfo')); 
        const config = { headers: { Authorization: `Bearer ${currentUserInfo?.token}` } };

        await axios.delete(`/api/properties/${propertyId}`, config);
        
        setMyProperties((prevProperties) => prevProperties.filter((p) => p._id !== propertyId));
        alert("Property deleted successfully.");
        
      } catch (error) {
        console.error("Error deleting property:", error);
        alert(error.response?.data?.message || "Failed to delete property.");
      }
    }
  };

  const handleStatusChange = async (propertyId, propertyType, action) => { 
    let newStatus = 'Available'; 

    if (action === 'mark-sold') {
      newStatus = propertyType?.toLowerCase().includes('rent') ? 'Rented' : 'Sold';
    }

    const isConfirmed = window.confirm(`Are you sure you want to mark this property as ${newStatus}? It will be hidden from public searches.`);

    if (isConfirmed) {
      try {
        const currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${currentUserInfo?.token}` } };

        await axios.put(`/api/properties/${propertyId}/status`, { status: newStatus }, config);

        setMyProperties((prevProperties) => 
          prevProperties.map((p) => 
            p._id === propertyId ? { ...p, status: newStatus } : p
          )
        );

        alert(`Property successfully marked as ${newStatus}!`);
      } catch (error) {
        console.error("Error updating status:", error);
        alert(error.response?.data?.message || "Failed to update status.");
      }
    }
  };

  if (!userInfo) return null;

  return (
    <div className="premium-dashboard">
      
      {/* --- SIDEBAR --- */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h3>{userInfo.name}</h3>
            <span className="role-badge">{userInfo.role || 'Owner'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <button className={`nav-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
            <Building size={18} /> My Properties
          </button>
          <button className={`nav-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
            <Heart size={18} /> Saved Homes
          </button>
          <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="dashboard-content">
        
        {/* --- 1. OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <div className="tab-section fade-in">
            <div className="content-header">
              <div>
                <h1>Welcome back, {userInfo.name.split(' ')[0]}!</h1>
                <p>Here is a quick summary of your account and activity.</p>
              </div>
            </div>

            <div className="overview-grid">
              <div className="overview-main">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon wrap-blue"><Building size={24} /></div>
                    <div className="stat-info">
                      <h3>{myProperties.length}</h3>
                      <p>Active Listings</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon wrap-gold"><Heart size={24} /></div>
                    <div className="stat-info">
                      <h3>{savedProperties.length}</h3>
                      <p>Saved Homes</p>
                    </div>
                  </div>
                </div>

                <div className="recent-activity-box">
                  <h3>Recent Activity</h3>
                  <p className="text-muted">No recent activity to display yet.</p>
                </div>
              </div>

              <div className="overview-sidebar">
                <div className="profile-details-card">
                  <h3>Profile Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{userInfo.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{userInfo.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{userInfo.phone || 'Not provided'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Account Role</span>
                    <span className="detail-value role-tag">{userInfo.role || 'Buyer'}</span>
                  </div>
                  <button className="secondary-action-btn edit-profile-btn" onClick={() => setActiveTab('settings')}>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. MY PROPERTIES TAB --- */}
        {activeTab === 'properties' && (
          <div className="tab-section fade-in">
            <div className="content-header">
              <div>
                <h1>My Properties</h1>
                <p>Manage your active listings and track inquiries.</p>
              </div>
              <Link to="/post-property" className="primary-action-btn">
                <Plus size={18} /> Add New Property
              </Link>
            </div>

            <div className="content-body">
              {loading ? (
                <div className="loading-spinner">Loading your properties...</div>
              ) : myProperties.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrap"><Building size={40} color="#C5A059" /></div>
                  <h2>No properties listed yet</h2>
                  <p>Your portfolio is currently empty. List your first property to start reaching verified buyers and tenants.</p>
                  <Link to="/post-property" className="secondary-action-btn">Post Your First Property</Link>
                </div>
              ) : (
                <div className="dashboard-property-grid">
                  {myProperties.map((property) => (
                    <div key={property._id} className="dashboard-card">
                      <div className="card-image-wrap">
                        <img 
                          src={property.images && property.images.length > 0 
                                ? property.images[0] 
                                : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} 
                          alt={property.title} 
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        {(!property.status || property.status === 'Available') ? (
                          <span className="status-badge live">Available</span>
                        ) : (
                          <span className="status-badge sold" style={{ backgroundColor: '#1b263b', color: 'white' }}>
                            {property.status.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="card-details">
                        <div className="card-tag">{property.type}</div>
                        <h3 className="card-title">{property.title}</h3>
                        <p className="card-location"><MapPin size={14}/> {property.location}</p>
                        <p className="card-price">₹{property.price.toLocaleString('en-IN')}</p>
                      </div>

                      <div className="card-actions">
                        <button className="action-btn edit" onClick={() => navigate(`/edit-property/${property._id}`)}>
                          <Edit size={16} /> Edit
                        </button>

                        {(!property.status || property.status === 'Available') ? (
                          <>
                            <button 
                              className="action-btn status-btn" 
                              onClick={() => handleStatusChange(property._id, property.type, 'mark-sold')}
                              style={{ backgroundColor: '#C5A059', color: 'white', border: 'none' }}
                            >
                              Mark {property.type?.toLowerCase().includes('rent') ? 'Rented' : 'Sold'}
                            </button>
                            
                            <button className="action-btn delete" onClick={() => handleDelete(property._id)}>
                              <Trash2 size={16} /> Delete
                            </button>
                          </>
                        ) : (
                          <button 
                            className="action-btn undo-btn" 
                            onClick={() => handleStatusChange(property._id, property.type, 'revert')}
                            style={{ backgroundColor: '#1b263b', color: 'white', border: 'none', width: '100%' }}
                          >
                            Revert to Available
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 3. SAVED HOMES TAB --- */}
        {activeTab === 'saved' && (
          <div className="tab-section fade-in">
            <div className="content-header">
              <div>
                <h1>Saved Homes</h1>
                <p>Properties you've favorited for later.</p>
              </div>
            </div>

            <div className="content-body">
              {loading ? (
                <div className="loading-spinner">Loading your saved homes...</div>
              ) : savedProperties.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrap"><Heart size={40} color="#e2e8f0" /></div>
                  <h2>No saved homes yet</h2>
                  <p>Click the heart icon on any property listing to save it here for easy access later.</p>
                  <Link to="/" className="secondary-action-btn">Explore Properties</Link>
                </div>
              ) : (
                <div className="dashboard-property-grid">
                  {savedProperties.map((property) => (
                    <div key={property._id} className="dashboard-card">
                      <div className="card-image-wrap">
                        <img 
                          src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} 
                          alt={property.title} 
                        />
                        <span className="status-badge live" style={{backgroundColor: '#C5A059'}}>Saved</span>
                      </div>
                      <div className="card-details">
                        <div className="card-tag">{property.type}</div>
                        <h3 className="card-title">{property.title}</h3>
                        <p className="card-location"><MapPin size={14}/> {property.location}</p>
                        <p className="card-price">₹{property.price.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="card-actions">
                        <Link to={`/property/${property._id}`} className="action-btn edit" style={{flex: 2}}>
                          View Listing
                        </Link>
                        <button 
                          className="action-btn delete" 
                          style={{flex: 1}}
                          onClick={() => handleRemoveSavedProperty(property._id)}
                        >
                          <Trash2 size={16} /> 
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 4. SETTINGS TAB --- */}
        {activeTab === 'settings' && (
          <div className="tab-section fade-in">
            <div className="content-header">
              <div>
                <h1>Account Settings</h1>
                <p>Manage your personal information, security, and account type.</p>
              </div>
            </div>

            <div className="settings-container">
              {/* The form and delete UI are now perfectly encapsulated! */}
              <AccountSettings userInfo={userInfo} setUserInfo={setUserInfo} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;