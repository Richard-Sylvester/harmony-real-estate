import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, X } from 'lucide-react';
import './AccountSettings.css';

// 1. ADDED PROPS HERE so the component knows who the user is!
const AccountSettings = ({ userInfo, setUserInfo }) => {
  const navigate = useNavigate();

  // --- PROFILE UPDATE LOGIC ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault(); 
    
    const name = e.target.name.value;
    const phone = e.target.phone.value;
    const role = e.target.role.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password && password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.put('/api/users/profile', {
        name,
        phone,
        role,
        password
      }, config);

      const updatedSession = { ...data, token: userInfo.token };
      localStorage.setItem('userInfo', JSON.stringify(updatedSession));
      setUserInfo(updatedSession);
      
      e.target.password.value = '';
      e.target.confirmPassword.value = '';

      alert("Profile updated successfully!");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };
  
  // --- DELETION LOGIC ---
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = async () => {
    setIsDeleting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

      await axios.put('/api/users/delete-request', {}, config);
      
      alert("Your account has been scheduled for deletion. Your properties are now hidden. Logging you out.");
      localStorage.removeItem('userInfo');
      navigate('/login');
      
    } catch (error) {
      console.error("Delete request failed:", error);
      alert(error.response?.data?.message || "Something went wrong.");
      setIsDeleting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteConfirmText(''); 
  };

  // 2. REMOVED THE activeTab LOGIC. We just return the container directly!
  return (
    <div className="settings-container">
      
      {/* --- SETTINGS FORM --- */}
      <form className="settings-form" onSubmit={handleUpdateProfile}>
        <div className="settings-section-title">Personal Information</div>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" defaultValue={userInfo.name} className="premium-input" required/>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" defaultValue={userInfo.phone || ''} placeholder="+91 xxxxx xxxxx" className="premium-input" />
          </div>
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" defaultValue={userInfo.email} className="premium-input" disabled />
          <small className="input-hint">Email addresses cannot be changed once registered.</small>
        </div>

        <div className="settings-divider"></div>

        <div className="settings-section-title">Account Type</div>
        <div className="form-group">
          <label>Primary Role</label>
          <select name="role" defaultValue={userInfo.role || 'buyer'} className="premium-input">
            <option value="buyer">Buyer (Looking for properties)</option>
            <option value="seller">Seller / Owner (Listing properties)</option>
          </select>
          <small className="input-hint">Changing your role to Seller unlocks the ability to post properties.</small>
        </div>

        <div className="settings-divider"></div>

        <div className="settings-section-title">Security</div>
        <div className="form-row">
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="password" placeholder="Leave blank to keep current" className="premium-input" />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm new password" className="premium-input" />
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="primary-action-btn save-btn">Save All Changes</button>
        </div>
      </form>

      {/* --- DELETE ACCOUNT UI --- */}
      <div className="form-section" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>Delete Account</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Permanently remove your account and all associated properties.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ 
              backgroundColor: 'transparent', 
              color: '#ef4444', 
              border: '1px solid #ef4444', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#fef2f2'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
          >
            Delete Account
          </button>
        </div>

        {/* --- MODAL OVERLAY --- */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000 
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '12px', 
              width: '90%', /* Changed from 100% to 90% so it has borders on mobile */
              maxWidth: '450px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              
              <button 
                onClick={closeModal}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '15px' }}>
                <AlertTriangle size={28} />
                <h2 style={{ margin: 0, fontSize: '20px' }}>Delete Account?</h2>
              </div>
              
              <p style={{ color: '#475569', marginBottom: '20px', lineHeight: '1.5', fontSize: '15px' }}>
                This action will immediately hide all your active property listings. 
                Your data will be held for a <strong>30-day grace period</strong> before being permanently erased.
              </p>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                  To verify, type <span style={{letterSpacing: '1px', color: '#ef4444'}}>DELETE</span> below:
                </label>
                <input 
                  type="text" 
                  placeholder="DELETE" 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: `2px solid ${deleteConfirmText === 'DELETE' ? '#ef4444' : '#cbd5e1'}`,
                    outline: 'none',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={closeModal}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteRequest} 
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    backgroundColor: deleteConfirmText === 'DELETE' ? '#ef4444' : '#fca5a5', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {isDeleting ? "Processing..." : "Confirm Deletion"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;