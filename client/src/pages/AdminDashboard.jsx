import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Users, Building, ShieldCheck, CheckCircle, Trash2, Shield, Star } from 'lucide-react';
import './Dashboard.css'; // Reusing your beautiful, mobile-responsive dashboard styles!

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, pendingApprovals: 0 });
  const [allUsers, setAllUsers] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Authenticate & Fetch Data
  useEffect(() => {
    const fetchAdminData = async (token) => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // We will build these backend routes next!
        const [statsRes, usersRes, propsRes] = await Promise.all([
          axios.get('/api/admin/stats', config),
          axios.get('/api/admin/users', config),
          axios.get('/api/admin/properties', config)
        ]);

        setStats(statsRes.data);
        setAllUsers(usersRes.data);
        setAllProperties(propsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Admin fetch failed:", error);
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      // The Bouncer: Kick non-admins out!
      if (!parsedUser.isAdmin) {
        navigate('/'); 
      } else {
        setUserInfo(parsedUser);
        fetchAdminData(parsedUser.token);
      }
    }
  }, [navigate]);

  // --- MODERATION HANDLERS ---
  const handleApproveProperty = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/admin/properties/${id}/approve`, {}, config);
      
      // Update UI instantly
      setAllProperties(prev => prev.map(p => p._id === id ? { ...p, isApproved: true } : p));
      setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
    } catch (error) {
      console.error(error);
      alert("Failed to approve property.");
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/admin/properties/${id}/feature`, {}, config);
      
      // INSTANT UI UPDATE: Flip the star on the screen without refreshing
      setAllProperties(prev => prev.map(p => 
        p._id === id ? { ...p, isFeatured: !p.isFeatured } : p
      ));
    } catch (error) {
      console.error(error);
      alert("Failed to toggle feature status.");
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("WARNING: Permanently delete this property?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/admin/properties/${id}`, config);
        setAllProperties(prev => prev.filter(p => p._id !== id));
      } catch (error) {
        console.error(error);
        alert("Failed to delete property.");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("WARNING: Are you sure you want to permanently delete this user?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/admin/users/${id}`, config);
        
        // Remove the user from the UI instantly
        setAllUsers(prev => prev.filter(u => u._id !== id));
        // Update the stats counter so everything stays perfectly in sync
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 })); 
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  if (!userInfo) return null;

  return (
    <div className="premium-dashboard">
      
      {/* --- ADMIN SIDEBAR --- */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile" style={{ borderBottom: '4px solid #ef4444' }}>
          <div className="profile-avatar" style={{ backgroundColor: '#ef4444' }}>
            <Shield size={24} color="white" />
          </div>
          <div className="profile-info">
            <h3>Admin Portal</h3>
            <span className="role-badge" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>Supervisor</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={18} /> Analytics
          </button>
          <button className={`nav-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
            <Building size={18} /> Property Moderation
          </button>
          <button className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} /> User Management
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="dashboard-content">
        
        {/* 1. ANALYTICS TAB */}
        {activeTab === 'overview' && (
          <div className="tab-section fade-in">
            <div className="content-header">
              <div>
                <h1>Platform Analytics</h1>
                <p>Welcome to the control room, {userInfo.name}.</p>
              </div>
              {/* The Company-Owned Property Button */}
              <Link to="/post-property?type=company" className="primary-action-btn" style={{ backgroundColor: '#ef4444', border: 'none' }}>
                + Add Company Property
              </Link>
            </div>

            {loading ? <p>Loading stats...</p> : (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon wrap-blue"><Users size={24} /></div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers}</h3>
                    <p>Registered Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon wrap-green"><Building size={24} /></div>
                  <div className="stat-info">
                    <h3>{stats.totalProperties}</h3>
                    <p>Total Properties</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon wrap-gold"><ShieldCheck size={24} /></div>
                  <div className="stat-info">
                    <h3 style={{ color: stats.pendingApprovals > 0 ? '#ef4444' : 'inherit' }}>
                      {stats.pendingApprovals}
                    </h3>
                    <p>Pending Approvals</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

       {/* 2. PROPERTY MODERATION TAB */}
        {activeTab === 'properties' && (
          <div className="tab-section fade-in">
            <div className="content-header">
              <div>
                <h1>Property Moderation</h1>
                <p>Approve new listings or remove policy violations.</p>
              </div>
            </div>
            
            {loading ? <p>Loading properties...</p> : (
              <div className="dashboard-property-grid">
                {allProperties.map((property) => (
                  <div key={property._id} className="dashboard-card" style={{ border: property.isApproved ? '1px solid #e2e8f0' : '2px solid #eab308' }}>
                    
                    {/* 🚨 THE FIX: Wrap the details in a Link to view the full post! */}
                    <Link 
                      to={`/property/${property._id}`} 
                      className="card-details" 
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <div className="card-tag">{property.type}</div>
                      <h3 className="card-title">{property.title}</h3>
                      <p className="card-price">₹{property.price?.toLocaleString('en-IN')}</p>
                      {!property.isApproved && <span style={{ color: '#eab308', fontWeight: 'bold', fontSize: '0.8rem', display: 'block', marginTop: '10px' }}>⚠️ PENDING APPROVAL</span>}
                    </Link>

                    {/* The Actions sit safely outside the Link */}
                    <div className="card-actions">
                      {/* Show Approve if it's pending */}
                      {!property.isApproved && (
                        <button className="action-btn" style={{ color: '#10b981' }} onClick={() => handleApproveProperty(property._id)}>
                          <CheckCircle size={16} /> Approve
                        </button>
                      )}

                      {/* Show Feature Star ONLY if it's already approved */}
                      {property.isApproved && (
                        <button 
                          className="action-btn" 
                          style={{ color: property.isFeatured ? '#C5A059' : '#64748b' }} 
                          onClick={() => handleToggleFeature(property._id)}
                        >
                          <Star size={16} fill={property.isFeatured ? '#C5A059' : 'transparent'} /> 
                          {property.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                      )}

                      {/* Delete is always available */}
                      <button className="action-btn delete" onClick={() => handleDeleteProperty(property._id)}>
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="tab-section fade-in">
            <div className="content-header">
              <div>
                <h1>User Management</h1>
                <p>View and manage all registered accounts.</p>
              </div>
            </div>
            
           {loading ? <p>Loading users...</p> : (
              <div className="dashboard-property-grid">
                {allUsers.map((user) => (
                  <div key={user._id} className="dashboard-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    {/* User Info */}
                    <div>
                      <h3 style={{ margin: '0 0 5px 0' }}>{user.name}</h3>
                      <p style={{ margin: '0 0 10px 0', color: '#64748b' }}>{user.email}</p>
                      <span className="role-badge">{user.isAdmin ? 'ADMIN' : user.role}</span>
                    </div>

                    {/* Delete Button (Hidden for Admins so you can't delete yourself!) */}
                    {!user.isAdmin && (
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;