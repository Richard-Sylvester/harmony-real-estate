import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Plus, Minus, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png'; 
import './MobileHeader.css';

const MobileHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDrawerOpen) {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      } else {
        setUserInfo(null); 
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen]); 

  const closeMenu = () => {
    setIsDrawerOpen(false);
    setActiveMenu(null); 
  };

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    closeMenu();
    navigate('/'); 
  };

  return (
    <>
      <header className="mobile-header-container">
        <div className="header-left-group">
          <button className="hamburger-btn" onClick={() => setIsDrawerOpen(true)}>
            <Menu size={28} />
          </button>
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Harmony Logo" className="mobile-logo-img" />
          </Link>
        </div>

        <Link to="/post-property" className="mobile-post-btn" onClick={closeMenu}>
          Post Property <span className="free-badge">FREE</span>
        </Link>
      </header>

      <div className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}>
        
        <div className="drawer-auth-header">
          {userInfo ? (
            <>
              <div>
                <h3 className="greeting-subtext">Hello,</h3>
                <h3 className="greeting-name">
                  {userInfo.name.split(' ')[0]}!
                </h3>
              </div>
              <button 
                className="drawer-logout-btn" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div>
                <h3 className="auth-prompt-text">Sign in to get a</h3>
                <h3 className="auth-prompt-text">personalised feed!</h3>
              </div>
              <Link to="/login" className="drawer-login-btn" onClick={closeMenu}>Login</Link>
            </>
          )}
        </div>

        <div className="drawer-content">
          
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleMenu('buy')}>
              <span>Buy</span>
              {activeMenu === 'buy' ? <Minus size={20} /> : <Plus size={20} />}
            </button>
            
            <div className={`accordion-body ${activeMenu === 'buy' ? 'expanded' : ''}`}>
              <div className="submenu-group">
                <p className="submenu-title">Popular Choices</p>
                <Link to="/search?type=Sell&status=Ready to Move" onClick={closeMenu}>Ready to move</Link>
                <Link to="/search?type=Sell&postedBy=owner" onClick={closeMenu}>Owner Properties</Link>
                <Link to="/search?type=Sell&tag=budget" onClick={closeMenu}>Budget Homes</Link>
              </div>
              <div className="submenu-group">
                <p className="submenu-title">Property Types</p>
                <Link to="/search?type=Sell&category=Apartment/Flat" onClick={closeMenu}>Flats in Bengaluru</Link>
                <Link to="/search?type=Sell&category=Residential House" onClick={closeMenu}>House for sale</Link>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleMenu('rent')}>
              <span>Rent</span>
              {activeMenu === 'rent' ? <Minus size={20} /> : <Plus size={20} />}
            </button>
            
            <div className={`accordion-body ${activeMenu === 'rent' ? 'expanded' : ''}`}>
              <div className="submenu-group">
                <p className="submenu-title">Popular Choices</p>
                <Link to="/search?type=Rent&postedBy=owner" onClick={closeMenu}>Owner Properties</Link>
                <Link to="/search?type=Rent&furnishedStatus=Furnished" onClick={closeMenu}>Furnished Homes</Link>
              </div>
            </div>
          </div>

          <Link to="/post-property" className="standard-drawer-link" onClick={closeMenu}>
            Sell Property <ChevronRight size={20} color="#94a3b8" />
          </Link>
          <Link to="/dashboard" className="standard-drawer-link" onClick={closeMenu}>
            My Dashboard <ChevronRight size={20} color="#94a3b8" />
          </Link>

        </div>
      </div>
      
      {isDrawerOpen && <div className="drawer-overlay" onClick={closeMenu}></div>}
    </>
  );
};

export default MobileHeader;