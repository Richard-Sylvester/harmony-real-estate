import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import './SearchPage.css';

const SearchPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // useLocation hooks into the URL to grab our query parameters
  const location = useLocation();

  useEffect(() => {
    const fetchFilteredProperties = async () => {
      try {
        setLoading(true);
        // We pass location.search directly to the backend! 
        // Example: /api/properties?type=Sell&category=Villa
        const { data } = await axios.get(`/api/properties${location.search}`);
        setProperties(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [location.search]); // Re-run this anytime the URL changes!

  // Format the title based on the URL
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'Properties';
  const category = searchParams.get('category') || '';
  let pageTitle = `${category} for ${type}`;
  if (!category) pageTitle = `${type} Properties`;

  return (
    <div className="search-page-container fade-in">
      
      {/* Search Header */}
      <div className="search-header">
        <div>
          <h1>{pageTitle}</h1>
          <p>Found {properties.length} matching {properties.length === 1 ? 'result' : 'results'} in Bengaluru</p>
        </div>
        <button className="filter-btn">
          <SlidersHorizontal size={18} /> Filters
        </button>
      </div>

      {/* Main Content Area */}
      <div className="search-content">
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Finding perfect matches...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-search-state">
            <Search size={48} color="#cbd5e1" />
            <h2>No exact matches found</h2>
            <p>Try adjusting your budget or changing the property type.</p>
          </div>
        ) : (
          <div className="search-results-grid">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;