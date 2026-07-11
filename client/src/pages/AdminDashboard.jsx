import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Building, Clock, CheckCircle, Trash2, Star, Search, PlusCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  
  const [activeTab, setActiveTab] = useState('users');
  
  // 🚨 NEW: Search State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, pendingApprovals: 0 });
  const [allUsers, setAllUsers] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async (token) => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
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
        setAllUsers(prev => prev.filter(u => u._id !== id));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 })); 
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  // 🚨 NEW: The Filtering Logic for the Search Bar
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProperties = allProperties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    property.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to clear search when swapping tabs
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  if (!userInfo) return null;

  return (
    <div className="admin-container fade-in">
      
      {/* 1. HEADER */}
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Harmony Admin Control Panel</h1>
          <p>Welcome to the control room, {userInfo.name}.</p>
        </div>
        <Link to="/post-property?type=company" className="primary-action-btn" style={{ backgroundColor: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '8px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          <PlusCircle size={18} /> Add Company Property
        </Link>
      </div>

      {/* 2. TOP SUMMARY CARDS */}
      {loading ? <p>Loading dashboard data...</p> : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Users size={28} color="#C5A059" />
            </div>
            <div className="stat-details">
              <h3>{stats.totalUsers}</h3>
              <p>Registered Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Building size={28} color="#C5A059" />
            </div>
            <div className="stat-details">
              <h3>{stats.totalProperties}</h3>
              <p>Total Properties</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Clock size={28} color="#C5A059" />
            </div>
            <div className="stat-details">
              <h3 style={{ color: stats.pendingApprovals > 0 ? '#ef4444' : '#1b263b' }}>
                {stats.pendingApprovals}
              </h3>
              <p>Pending Approvals</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. LIST CONTROLS & SEARCH BAR */}
      <div className="table-controls">
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('users')}
          >
            User Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('properties')}
          >
            Property Moderation
          </button>
        </div>
        
        {/* 🚨 WIRED SEARCH BAR */}
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 10px 10px 35px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none', width: '250px' }} 
          />
        </div>
      </div>

      {/* 4. THE DATA TABLES */}
      <div className="table-container">
        
        {/* --- USERS TABLE --- */}
        {activeTab === 'users' && !loading && (
          <table className="harmony-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* 🚨 Now maps over filteredUsers instead of allUsers */}
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: user.isAdmin ? '#C5A059' : '#e2e8f0', color: user.isAdmin ? 'white' : '#64748b' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="cell-primary">{user.name}</span>
                        <span className="cell-secondary">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {/* 🚨 THE NEW ROLE BADGE LOGIC */}
                    <span className={`badge ${
                      user.isAdmin ? 'admin' : 
                      (user.role?.toLowerCase() === 'seller' ? 'seller' : 'buyer')
                    }`}>
                      {user.isAdmin ? 'Admin' : (user.role || 'Buyer')}
                    </span>
                  </td>
                  <td><span className="badge active">Active</span></td>
                  <td>
                    {!user.isAdmin && (
                      <div className="action-btns">
                        <button className="btn-icon delete" onClick={() => handleDeleteUser(user._id)} title="Delete User">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>No users found matching "{searchTerm}"</td></tr>
              )}
            </tbody>
          </table>
        )}

        {/* --- PROPERTIES TABLE --- */}
        {activeTab === 'properties' && !loading && (
          <table className="harmony-table">
            <thead>
              <tr>
                <th>Property Details</th>
                <th>Type</th>
                <th>Price & Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* 🚨 Now maps over filteredProperties */}
              {filteredProperties.map((property) => (
                <tr key={property._id}>
                  <td>
                    <Link to={`/property/${property._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span className="cell-primary">{property.title}</span>
                      <span className="cell-secondary">{property.location || 'Bengaluru'}</span>
                    </Link>
                  </td>
                  <td><span className="cell-primary">{property.type}</span></td>
                  <td>
                    <span className="cell-primary">₹ {property.price?.toLocaleString('en-IN')}</span>
                    <span className="cell-secondary">{property.category}</span>
                  </td>
                  <td>
                    {property.isApproved ? (
                       <span className="badge active">Live</span>
                    ) : (
                       <span className="badge pending">Pending</span>
                    )}
                  </td>
                  <td>
                    <div className="action-btns">
                      {!property.isApproved && (
                        <button className="btn-icon approve" onClick={() => handleApproveProperty(property._id)} title="Approve">
                          <CheckCircle size={18} />
                        </button>
                      )}

                      {property.isApproved && (
                        <button 
                          className="btn-icon edit" 
                          onClick={() => handleToggleFeature(property._id)} 
                          title={property.isFeatured ? "Unfeature" : "Feature"}
                          style={{ color: property.isFeatured ? '#C5A059' : '#64748b' }}
                        >
                          <Star size={18} fill={property.isFeatured ? '#C5A059' : 'transparent'} />
                        </button>
                      )}

                      <button className="btn-icon delete" onClick={() => handleDeleteProperty(property._id)} title="Delete Property">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProperties.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No properties found matching "{searchTerm}"</td></tr>
              )}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;