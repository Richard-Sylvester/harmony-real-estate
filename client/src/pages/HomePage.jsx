import { useLocation } from 'react-router-dom';
import { BadgeCheck, Star, Clock, History } from 'lucide-react';
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

  // 1. FILTER BY SEARCH BAR & TABS
  const filteredProperties = properties.filter((property) => {
    const locLower = property.location ? property.location.toLowerCase() : '';
    const catLower = property.category ? property.category.toLowerCase() : '';
    const typeLower = property.type ? property.type.toLowerCase() : '';

    const matchLocation = locLower.includes(searchLocation);
    const matchType = searchType === '' || catLower.includes(searchType) || typeLower.includes(searchType);
    const matchBudget = searchBudget ? property.price <= Number(searchBudget) : true;
    
   // --- TAB LOGIC ---
    let matchAction = true;
    
    // 1. Explicitly define ALL Commercial strings
    const isCommercial = catLower.includes('commercial') || 
                         catLower.includes('office') || 
                         catLower.includes('shop') || 
                         catLower.includes('showroom') || 
                         catLower.includes('warehouse') || 
                         catLower.includes('godown') || 
                         catLower.includes('co-working');

    // 2. Explicitly define ALL Plot strings
    const isPlot = catLower.includes('plot') || catLower.includes('land');

    // 3. Explicitly define ALL PG strings
    const isPG = catLower.includes('pg') || catLower.includes('hostel') || catLower.includes('co-living');

    // 4. If it is none of the above, it MUST be a Residential home (Flat, Villa, House)!
    const isResidential = !isCommercial && !isPlot && !isPG;

    // 5. Lock the properties into their strictly matching tabs
    if (searchAction === 'Buy') {
      matchAction = isResidential && (typeLower.includes('sell') || typeLower.includes('buy') || typeLower.includes('sale')); 
    } else if (searchAction === 'Rent') {
      matchAction = isResidential && typeLower.includes('rent');
    } else if (searchAction === 'Commercial') {
      matchAction = isCommercial; // Traps all commercial types, whether for rent or sale
    } else if (searchAction === 'Plots/Land') {
      matchAction = isPlot; // Traps all plots
    } else if (searchAction === 'PG') {
      matchAction = isPG; // Traps all PGs
    }

    return matchLocation && matchType && matchBudget && matchAction;
  });

  // 2. SORT INTO 4 BUCKETS
  const companyOwnedProps = filteredProperties.filter(p => 
    p.isCompanyOwned && (!p.status || p.status === 'Available')
  );
  
  const featuredProps = filteredProperties.filter(p => 
    p.isFeatured && !p.isCompanyOwned && (!p.status || p.status === 'Available')
  );
  
  const normalProps = filteredProperties.filter(p => 
    !p.isFeatured && !p.isCompanyOwned && (!p.status || p.status === 'Available')
  );
  
  const trackRecordProps = filteredProperties.filter(p => 
    p.status === 'Sold' || p.status === 'Rented'
  );

  return (
    <>
      <Hero /> 
      
      <div className="home-content-wrapper" id="properties-section" style={{ marginTop: '3rem' }}>
        {filteredProperties.length === 0 ? (
          <h3 className="empty-state-text" style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
            No properties found for this category. Be the first to post one!
          </h3>
        ) : (
          <div className="property-sections-container" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>

            {/* --- BUCKET 1: HARMONY VERIFIED --- */}
            {companyOwnedProps.length > 0 && (
              <div className="property-category-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1b263b', fontSize: '1.4rem', marginBottom: '20px' }}>
                  <BadgeCheck size={24} color="#C5A059" /> Harmony Verified
                </h3>
                <div className="property-grid">
                  {companyOwnedProps.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
              </div>
            )}

            {/* --- BUCKET 2: FEATURED PROPERTIES --- */}
            {featuredProps.length > 0 && (
              <div className="property-category-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1b263b', fontSize: '1.4rem', marginBottom: '20px' }}>
                  <Star size={24} color="#C5A059" fill="#C5A059" /> Featured Listings
                </h3>
                <div className="property-grid">
                  {featuredProps.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
              </div>
            )}

            {/* --- BUCKET 3: FRESH LISTINGS (NORMAL) --- */}
            {normalProps.length > 0 && (
              <div className="property-category-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1b263b', fontSize: '1.4rem', marginBottom: '20px' }}>
                  <Clock size={24} color="#415A77" /> Fresh Listings
                </h3>
                <div className="property-grid">
                  {normalProps.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
              </div>
            )}

            {/* --- BUCKET 4: SOLD/RENTED (TRACK RECORD) --- */}
            {trackRecordProps.length > 0 && (
              <div className="property-category-section track-record-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '1.4rem', marginBottom: '20px' }}>
                  <History size={24} color="#64748b" /> Recently Closed
                </h3>
                <div className="property-grid" style={{ opacity: 0.85 }}> {/* Slight fade for sold items */}
                  {trackRecordProps.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
              </div>
            )}

          </div>
        )}

        {/* --- MAP SECTION --- */}
        <div className="map-section-wrapper" style={{ marginTop: '50px' }}>
          <PropertyMap properties={filteredProperties} /> 
        </div>

      </div>
    </>
  );
};

export default HomePage;