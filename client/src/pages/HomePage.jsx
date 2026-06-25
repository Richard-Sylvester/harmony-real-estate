import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import './HomePage.css';

const HomePage = ({ properties }) => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  
  const searchLocation = queryParams.get('location')?.toLowerCase() || '';
  const searchType = queryParams.get('type')?.toLowerCase() || '';
  const searchBudget = queryParams.get('budget');
  const searchAction = queryParams.get('activeAction') || 'Buy'; 

  const filteredProperties = properties.filter((property) => {
    const locLower = property.location ? property.location.toLowerCase() : '';
    const catLower = property.category ? property.category.toLowerCase() : '';
    const typeLower = property.type ? property.type.toLowerCase() : '';

    const matchLocation = locLower.includes(searchLocation);
    const matchType = searchType === '' || catLower.includes(searchType) || typeLower.includes(searchType);
    const matchBudget = searchBudget ? property.price <= Number(searchBudget) : true;
    
    // --- NEW: MUTUALLY EXCLUSIVE TAB LOGIC ---
    let matchAction = true;
    
    // Helper: Is this property Residential? (Not Commercial, Not Plot)
    const isResidential = !catLower.includes('commercial') && !catLower.includes('plot') && !catLower.includes('land');

    if (searchAction === 'Buy') {
      // Must be Residential AND for Sale
      matchAction = isResidential && (typeLower.includes('sell') || typeLower.includes('buy') || typeLower.includes('sale')); 
    } else if (searchAction === 'Rent') {
      // Must be Residential AND for Rent
      matchAction = isResidential && typeLower.includes('rent');
    } else if (searchAction === 'Commercial') {
      // Traps ALL Commercial spaces
      matchAction = catLower.includes('commercial');
    } else if (searchAction === 'Plots/Land') {
      // Traps ALL Plots/Land
      matchAction = catLower.includes('plot') || catLower.includes('land');
    }

    return matchLocation && matchType && matchBudget && matchAction;
  });

  return (
    <>
      <Hero /> 
      
      <div id="properties-section" style={{ marginTop: '3rem' }}>
        <h2>Explore <span className="accent-text">{searchAction}</span> Properties</h2>
        
       {/* 2. REMOVED INLINE STYLES HERE */}
        <div className="property-grid">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(p => (
              <PropertyCard key={p._id} property={p} />
            ))
          ) : (
            <h3 className="empty-state-text">
               No properties found for this category. Be the first to post one!
            </h3>
          )}
        </div>

        <div className="map-section-wrapper">
          <PropertyMap properties={filteredProperties} /> 
        </div>
      </div>
    </>
  );
};

export default HomePage;