import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LegalPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('terms');

  // Automatically switch to the correct tab if they click a specific link in the footer
  useEffect(() => {
    if (location.hash === '#privacy') setActiveTab('privacy');
    if (location.hash === '#terms') setActiveTab('terms');
    if (location.hash === '#fraud') setActiveTab('fraud');
  }, [location]);

  const legalData = {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "July 2026",
      content: (
        <>
          <p>This document explains what data we collect and how our backend architecture protects it.</p>
          
          <h3>Information Collection</h3>
          <p>We collect personal information (name, email, phone number, and account password) when you register as a buyer or seller. We also collect property details, uploaded images, and precise geolocation coordinates to power our map features.</p>
          
          <h3>Use of Information</h3>
          <p>Your data is used to facilitate connections between buyers, renters, and sellers. When a property is successfully transacted, its status is updated to "Sold" or "Rented" to maintain a public track record, but the listing remains visible on the platform. We also securely track your "Saved Homes" wishlist to personalize your dashboard. Support requests initiated via "Contact Agent" buttons redirect directly to WhatsApp or native phone applications and are not stored in our database.</p>
          
          <h3>Data Security & Privacy</h3>
          <p>We implement strict security measures, including JSON Web Token (JWT) authentication and bcrypt password hashing, to protect your account. Furthermore, all property images uploaded to our platform are automatically stripped of hidden EXIF and GPS tracking metadata by our cloud providers to protect user privacy.</p>
          
          <h3>Account Deletion & Data Retention</h3>
          <p>Users have the right to request account deletion. Upon request, your account enters a 30-day "soft-delete" grace period. During this time, your properties are instantly hidden from public view. If you do not restore your account within 30 days, an automated system permanently erases your personal data and property listings from our database.</p>
        </>
      )
    },
    terms: {
      title: "Terms & Conditions",
      lastUpdated: "July 2026",
      content: (
        <>
          <p>These terms govern your use of the Harmony Real Estate platform.</p>

          <h3>Role of Harmony</h3>
          <p>Harmony Real Estate operates as a digital real estate agency and facilitation platform. All property inquiries, negotiations, and initial communications are routed exclusively through Harmony's authorized representatives. By using the platform, users agree that Harmony acts as the designated point of contact between buyers, renters, and property owners to ensure quality, security, and streamlined transactions.</p>
          
          <h3>Brokerage & Fees</h3>
          <p>As the acting agent facilitating these connections, Harmony may be entitled to brokerage fees, commissions, or consulting charges upon the successful sale or lease of a property, the terms of which will be communicated directly to the respective parties prior to finalization.</p>
          
          <h3>Content Moderation, Approvals & Accuracy</h3>
          <p>Harmony reserves the right to review, approve, edit, or delete any property listing. To ensure quality, properties submitted by users do not go live on the public search feed until a platform Admin reviews and explicitly approves them. While Harmony’s representatives actively manage communications, the foundational property details, images, and legal statuses are provided by the original property owners. Harmony acts in good faith but does not guarantee the absolute accuracy of owner-submitted data.</p>
          
          <h3>Platform Curation</h3>
          <p>Harmony reserves the right to highlight specific listings with a "Featured" or "Company-Owned" badge at the discretion of the administration.</p>

          <h3>User Obligations & Final Transactions</h3>
          <p>You agree to provide accurate, current, and truthful information when listing a property. You must possess the legal right to sell or rent the listed property. We reserve the right to ban users or remove listings that upload spam, fraudulent data, or inappropriate content. While Harmony facilitates the negotiations and acts as the primary agent, the final legal lease or sale agreement remains strictly between the property owner and the buyer/renter.</p>
        </>
      )
    },
    fraud: {
      title: "Fraud Alert",
      lastUpdated: "July 2026",
      content: (
        <>
          <p>This is critical information to protect our users from common real estate scams.</p>

          <ul>
            <li><strong>Never Pay Before Visiting:</strong> Never transfer token amounts, booking fees, or deposit money to a landlord or agent without first physically visiting the property and verifying the owner's credentials.</li>
            <li><strong>Beware of Fake IDs:</strong> Be highly cautious of individuals claiming to be military personnel or government officials transferring out of the city in a hurry, who ask for advance payments via UPI or QR codes.</li>
            <li><strong>Protect Your Financial Data:</strong> Harmony will never call you to ask for your bank details, UPI PIN, OTPs, or passwords. Do not share this information with anyone claiming to represent our platform.</li>
            <li><strong>Verify Documents:</strong> Always verify original property documents, Khata certificates, and RERA approvals before signing any lease or sale agreement.</li>
            <li><strong>Report Suspicious Activity:</strong> If you encounter a fake listing or a user demanding unwarranted payments, please contact our support team immediately so we can investigate and suspend the account.</li>
          </ul>
        </>
      )
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', minHeight: '60vh' }}>
      <h1 style={{ color: '#1b263b', textAlign: 'center', marginBottom: '30px' }}>Legal & Support</h1>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {Object.keys(legalData).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '10px 24px',
              backgroundColor: activeTab === key ? '#1b263b' : '#f8fafc',
              color: activeTab === key ? 'white' : '#64748b',
              border: `1px solid ${activeTab === key ? '#1b263b' : '#e2e8f0'}`,
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            {legalData[key].title}
          </button>
        ))}
      </div>

      {/* Dynamic Content Rendering */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid #f1f5f9',
        color: '#334155',
        lineHeight: '1.7'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
          <h2 style={{ color: '#1b263b', margin: 0 }}>{legalData[activeTab].title}</h2>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Last Updated: {legalData[activeTab].lastUpdated}</span>
        </div>
        
        <div className="legal-content">
          {legalData[activeTab].content}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;