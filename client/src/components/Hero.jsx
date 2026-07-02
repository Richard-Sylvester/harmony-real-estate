import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, MapPin, Home, IndianRupee, X } from 'lucide-react';
import { bengaluruLocations } from '../data/locations';
import './Hero.css';

// --- THE DYNAMIC DATA DICTIONARY (NOW WITH PG!) ---
const dynamicOptions = {
  'Buy': {
    types: ["Flat / Apartment", "Villa", "Independent House"],
    budgets: [
      { label: "No Limit", value: "" },
      { label: "Up to ₹25 Lakhs", value: "2500000" },
      { label: "Up to ₹50 Lakhs", value: "5000000" },
      { label: "Up to ₹1 Crore", value: "10000000" },
      { label: "Up to ₹2 Crores", value: "20000000" },
      { label: "Up to ₹5 Crores", value: "50000000" }
    ]
  },
  'Rent': {
    types: ["Flat / Apartment", "Villa", "Independent House"],
    budgets: [
      { label: "No Limit", value: "" },
      { label: "Up to ₹10,000/mo", value: "10000" },
      { label: "Up to ₹25,000/mo", value: "25000" },
      { label: "Up to ₹50,000/mo", value: "50000" },
      { label: "Up to ₹1 Lakh/mo", value: "100000" },
      { label: "Up to ₹2 Lakhs/mo", value: "200000" }
    ]
  },
  'PG': { // --- NEW PG SECTION ---
    types: ["Boys", "Girls",],
    budgets: [
      { label: "No Limit", value: "" },
      { label: "Up to ₹5,000/mo", value: "5000" },
      { label: "Up to ₹10,000/mo", value: "10000" },
      { label: "Up to ₹15,000/mo", value: "15000" },
      { label: "Up to ₹25,000/mo", value: "25000" }
    ]
  },
  'Commercial': {
    types: ["Office Space", "Shop / Showroom", "Warehouse / Godown", "Co-working"],
    budgets: [
      { label: "No Limit", value: "" },
      { label: "Up to ₹50,000", value: "50000" },
      { label: "Up to ₹2 Lakhs", value: "200000" },
      { label: "Up to ₹1 Crore", value: "10000000" },
      { label: "Up to ₹5 Crores", value: "50000000" }
    ]
  },
  'Plots/Land': {
    types: ["Residential Plot", "Commercial Plot", "Agricultural Land"],
    budgets: [
      { label: "No Limit", value: "" },
      { label: "Up to ₹25 Lakhs", value: "2500000" },
      { label: "Up to ₹50 Lakhs", value: "5000000" },
      { label: "Up to ₹1 Crore", value: "10000000" },
      { label: "Up to ₹5 Crores", value: "50000000" }
    ]
  }
};

const Hero = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialAction = searchParams.get('activeAction') || 'Buy';
  
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('Any Type');
  const [budgetLabel, setBudgetLabel] = useState('No Limit');
  const [budgetValue, setBudgetValue] = useState('');
  const [activeAction, setActiveAction] = useState(initialAction);
  
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLocMenu, setShowLocMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showBudgetMenu, setShowBudgetMenu] = useState(false);

  // --- NEW STATE: Controls the mobile full-screen search ---
  const [isMobileSearchModalOpen, setIsMobileSearchModalOpen] = useState(false);
  
  const locRef = useRef(null);
  const typeRef = useRef(null);
  const budgetRef = useRef(null);
  
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000", 
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locRef.current && !locRef.current.contains(event.target)) setShowLocMenu(false);
      if (typeRef.current && !typeRef.current.contains(event.target)) setShowTypeMenu(false);
      if (budgetRef.current && !budgetRef.current.contains(event.target)) setShowBudgetMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Also lock background scrolling when the mobile search modal is open
  useEffect(() => {
    if (isMobileSearchModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileSearchModalOpen]);

  const handleLocationTyping = (e) => {
    const userInput = e.target.value;
    setLocation(userInput);
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

 const handleActionClick = (action) => {
    setActiveAction(action);
    
    // 1. INSTANT RESET: Clear out ALL local input states
    setLocation(''); // 🚨 Added this to wipe the visual search bar
    setPropertyType('Any Type');
    setBudgetLabel('No Limit');
    setBudgetValue('');
    
    // 2. THE URL NUKE: Create a completely fresh URL with ONLY the new tab action
    const params = new URLSearchParams();
    params.set('activeAction', action);
    
    // 3. Push the clean URL to the browser and scroll down
    navigate(`/?${params.toString()}`);
    document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (propertyType !== 'Any Type') params.append('type', propertyType);
    if (budgetValue) params.append('budget', budgetValue);
    if (activeAction) params.append('activeAction', activeAction); 

    navigate(`/?${params.toString()}`);
    document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth' });

    // --- 🚨 THE FIX: AUTO-CLEAR SEARCH BAR ---
    // Wipes the inputs clean immediately after the search fires
    setLocation('');
    setPropertyType('Any Type');
    setBudgetLabel('No Limit');
    setBudgetValue('');
  };

  const currentTypes = dynamicOptions[activeAction].types;
  const currentBudgets = dynamicOptions[activeAction].budgets;

 // --- REUSABLE COMPONENT FOR THE DROPDOWNS ---
  // To avoid writing this twice (once for desktop, once for modal), we store it in a variable.
  const searchFormContent = (
    <>
      <div className="search-segment-refined" ref={locRef}>
        <label>Location</label>
        <div className="custom-input-wrapper">
          <input 
            type="text" 
            placeholder="Search 'Bengaluru'..." 
            value={location}
            onChange={handleLocationTyping}
            onFocus={() => { if(location) setShowLocMenu(true) }}
          />
          {showLocMenu && filteredLocations.length > 0 && (
            <div className="custom-dropdown-menu">
              {filteredLocations.map((loc, index) => (
                <div key={index} className="custom-dropdown-item" onClick={() => { setLocation(loc); setShowLocMenu(false); }}>
                  <MapPin size={16} color="#C5A059" /> {loc}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="search-divider-refined"></div>

      <div className="search-segment-refined" ref={typeRef} onClick={() => setShowTypeMenu(!showTypeMenu)}>
        <label>Property Type</label>
        <div className="custom-input-wrapper">
          <div className="custom-selected-text">{propertyType}</div>
          <ChevronDown size={18} className="custom-select-icon" />
          {showTypeMenu && (
            <div className="custom-dropdown-menu">
              <div className="custom-dropdown-item" onClick={() => setPropertyType("Any Type")}>Any Type</div>
              {currentTypes.map((type, index) => (
                <div key={index} className="custom-dropdown-item" onClick={() => setPropertyType(type)}>
                  <Home size={16} color="#415A77" /> {type}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="search-divider-refined"></div>

      <div className="search-segment-refined" ref={budgetRef} onClick={() => setShowBudgetMenu(!showBudgetMenu)}>
        <label>Max Budget</label>
        <div className="custom-input-wrapper">
          <div className="custom-selected-text">{budgetLabel}</div>
          <ChevronDown size={18} className="custom-select-icon" />
          {showBudgetMenu && (
            <div className="custom-dropdown-menu">
              {currentBudgets.map((opt, index) => (
                <div key={index} className="custom-dropdown-item" onClick={() => { setBudgetLabel(opt.label); setBudgetValue(opt.value); }}>
                  <IndianRupee size={16} color="#415A77" /> {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  // --- NEW: Listen for the Bottom Nav Search Click ---
  useEffect(() => {
    const handleOpenSearch = () => setIsMobileSearchModalOpen(true);
    
    // Listen for the custom event
    window.addEventListener('openMobileSearch', handleOpenSearch);
    
    // Cleanup the listener when the component unmounts
    return () => window.removeEventListener('openMobileSearch', handleOpenSearch);
  }, []);

  return (
    <div className="premium-hero-section">
      <div className="hero-bg-wrapper">
        {backgroundImages.map((imgUrl, index) => (
          <div key={index} className={`hero-slider-bg ${index === currentImageIndex ? 'active' : ''}`} style={{ backgroundImage: `url(${imgUrl})` }} />
        ))}
        <div className="hero-dark-overlay"></div>
      </div> 

      <div className="hero-content-wrapper">
        <h1>Find Your Space in <span className="accent-text">Harmony</span></h1>
        <p>Expert Construction, Premium Sales, and Seamless Rentals in Bengaluru.</p>

        <div className="hero-tabs-container">
          <div className="hero-tabs-group">
            {['Buy', 'Rent', 'PG', 'Commercial', 'Plots/Land'].map(action => (
              <button key={action} className={`hero-tab-btn ${activeAction === action ? 'active' : ''}`} onClick={() => handleActionClick(action)}>
                {action}
              </button>
            ))}
          </div>
          <div className="hero-tabs-divider"></div>
          <Link to="/post-property" className="hero-tab-btn post-property-tab">
            Post Property <span className="free-badge-elegant">FREE</span>
          </Link>
        </div>

        {/* --- DESKTOP SEARCH PILL (Hidden on Mobile) --- */}
        <div className="premium-search-pill-refined desktop-only-search">
          {searchFormContent}
          <div className="search-btn-container-refined">
            <button className="premium-search-btn-refined" onClick={handleSearch}>
              <Search size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* --- FAKE MOBILE SEARCH PILL (Hidden on Desktop) --- */}
        <button className="fake-mobile-search-pill" onClick={() => setIsMobileSearchModalOpen(true)}>
          <Search size={20} color="#64748b" />
          <span>Search for Location, Property Type...</span>
        </button>

      </div>

      {/* --- FULL SCREEN MOBILE SEARCH MODAL --- */}
      {isMobileSearchModalOpen && (
        <div className="mobile-search-modal-overlay">
          <div className="mobile-search-modal-header">
            <h3>Search Properties</h3>
            <button className="close-modal-btn" onClick={() => setIsMobileSearchModalOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="mobile-search-modal-body">
            {searchFormContent}
          </div>
          <div className="mobile-search-modal-footer">
            <button className="mobile-modal-search-btn" onClick={handleSearch}>
              Search Properties
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Hero;