import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, User } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate(); // <-- Added useNavigate here
  const currentPath = location.pathname;

  // --- THE FLARE GUN FUNCTION ---
  const triggerMobileSearch = (e) => {
    e.preventDefault();
    
    if (currentPath !== '/') {
      // If the user is NOT on the homepage, send them home first, then fire the flare
      navigate('/');
      setTimeout(() => window.dispatchEvent(new Event('openMobileSearch')), 100);
    } else {
      // If they are already home, scroll to the top and fire the flare instantly
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new Event('openMobileSearch'));
    }
  };

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/" className={`nav-icon-wrapper ${currentPath === '/' ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </Link>
      
      {/* --- SWAPPED LINK FOR OUR CUSTOM BUTTON --- */}
      <div 
        className="nav-icon-wrapper" 
        onClick={triggerMobileSearch}
        style={{ cursor: 'pointer' }} // Ensures it still feels like a button
      >
        <Search size={24} />
        <span>Search</span>
      </div>
      
      <Link to="/post-property" className={`nav-icon-wrapper post-btn ${currentPath === '/post-property' ? 'active' : ''}`}>
        <PlusCircle size={28} />
        <span>Sell</span>
      </Link>
      
      <Link to="/dashboard" className={`nav-icon-wrapper ${currentPath === '/dashboard' ? 'active' : ''}`}>
        <User size={24} />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;