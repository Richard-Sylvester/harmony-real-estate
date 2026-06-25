import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setShowUserMenu(false);
    window.location.href = '/'; 
  };

  return (
    <nav className="premium-navbar">
      <div className="navbar-container">
        
        {/* 1. LEFT SIDE: Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Harmony Logo" className="brand-logo-img" />
        </Link>

        {/* 2. CENTER: Your Mega Menus */}
        <div className="navbar-links">
          
          {/* BUY MENU */}
          <div className="nav-item mega-dropdown">
            <span className="nav-link-text">Buy <ChevronDown size={16} /></span>
            <div className="mega-menu-content">
              <div className="mega-column">
                <h4>Popular Choices</h4>
                <Link to="/search?type=Sell&status=Ready to Move">Ready to Move</Link>
                <Link to="/search?type=Sell&postedBy=owner">Owner Properties</Link>
                <Link to="/search?type=Sell&tag=budget">Budget Homes</Link>
                <Link to="/search?type=Sell&tag=premium">Premium Homes</Link>
                <Link to="/search?type=Sell&status=Under Construction">New Projects <span className="badge">New</span></Link>
              </div>
              <div className="mega-column">
                <h4>Property Types</h4>
                <Link to="/search?type=Sell&category=Apartment/Flat">Flats in Bengaluru</Link>
                {/* Notice the specific styling inline or add your class for the gold highlight! */}
                <Link to="/search?type=Sell&category=Residential House">House for sale</Link>
                <Link to="/search?type=Sell&category=Villa">Villa in Bengaluru</Link>
                <Link to="/search?type=Sell&category=Plot">Plot in Bengaluru</Link>
              </div>
              <div className="mega-column">
                <h4>Budget</h4>
                <Link to="/search?type=Sell&maxPrice=5000000">Under ₹ 50 Lac</Link>
                <Link to="/search?type=Sell&minPrice=5000000&maxPrice=10000000">₹ 50 Lac - ₹ 1 Cr</Link>
                <Link to="/search?type=Sell&minPrice=10000000&maxPrice=15000000">₹ 1 Cr - ₹ 1.5 Cr</Link>
                <Link to="/search?type=Sell&minPrice=15000000">Above ₹ 1.5 Cr</Link>
              </div>
            </div>
          </div>

          {/* RENT MENU */}
          <div className="nav-item mega-dropdown">
            <span className="nav-link-text">Rent <ChevronDown size={16} /></span>
            <div className="mega-menu-content">
              <div className="mega-column">
                <h4>Popular Choices</h4>
                <Link to="/search?type=Rent&postedBy=owner">Owner Properties</Link>
                <Link to="/search?type=Rent&furnishedStatus=Furnished">Furnished Homes</Link>
                <Link to="/search?type=Rent&tag=bachelor">Bachelor Homes</Link>
              </div>
              <div className="mega-column">
                <h4>Property Types</h4>
                <Link to="/search?type=Rent&category=Apartment/Flat">Flats for Rent</Link>
                <Link to="/search?type=Rent&category=Residential House">House for Rent</Link>
                <Link to="/search?type=Rent&category=Commercial Space">Commercial Space</Link>
              </div>
              <div className="mega-column">
                <h4>Budget</h4>
                <Link to="/search?type=Rent&maxPrice=20000">Under ₹ 20,000</Link>
                <Link to="/search?type=Rent&minPrice=20000&maxPrice=35000">₹ 20,000 - ₹ 35,000</Link>
                <Link to="/search?type=Rent&minPrice=35000">Above ₹ 35,000</Link>
              </div>
            </div>
          </div>

          {/* SELL MENU */}
          <div className="nav-item mega-dropdown">
            <span className="nav-link-text">Sell <ChevronDown size={16} /></span>
            <div className="mega-menu-content">
              <div className="mega-column">
                <Link to="/post-property">Post a Property</Link>
                <Link to="/contact">Sales Enquiry</Link>
              </div>
            </div>
          </div>

        </div>

        {/* 3. RIGHT SIDE: Auth & Action Buttons */}
        <div className="navbar-auth">
          
          <Link to="/post-property" className="nav-post-btn">
            Post Property <span className="free-tag">FREE</span>
          </Link>

          <div className="nav-divider"></div>

          {userInfo ? (
            /* --- LOGGED IN STATE --- */
            <div className="user-menu-container" ref={dropdownRef}>
              <button 
                className="user-pill-btn" 
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar-circle">
                  {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>
                <span className="user-first-name">
                  {userInfo.name ? userInfo.name.split(' ')[0] : 'User'}
                </span>
                <ChevronDown size={16} className={`dropdown-arrow ${showUserMenu ? 'rotate' : ''}`} />
              </button>

              {/* The Dropdown Menu */}
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{userInfo.name}</p>
                    <p className="dropdown-email">{userInfo.email}</p>
                  </div>
                  
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <LayoutDashboard size={16} /> My Dashboard
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* --- LOGGED OUT STATE --- */
            <div className="auth-buttons">
              <Link to="/login" className="nav-login-link">Log In</Link>
              <Link to="/login" className="nav-signup-btn">Sign Up</Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;