import React from 'react';

const faqs = [
  {
    q: "How do I list my property?",
    a: "Simply log in to your account, click 'Sell' in the navigation bar, and fill out our guided form. Your property will go live once our admin team verifies the details."
  },
  {
    q: "Why is my property 'Pending Approval'?",
    a: "To ensure a high-quality, spam-free environment, all new listings are manually reviewed by our moderation team. Approvals typically take less than 24 hours."
  },
  {
    q: "How do I contact a property owner?",
    a: "Navigate to the property you are interested in and click the 'Contact Agent' button. You will be instantly connected to our authorized Harmony representatives via WhatsApp or direct call."
  },
  {
    q: "How do I delete my account?",
    a: "Go to your Dashboard, click on 'Settings', and scroll to the bottom. We process a 30-day soft-delete grace period before permanently erasing your data."
  }
];

const HelpCentre = () => {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ color: '#1b263b', fontSize: '2.5rem', marginBottom: '15px' }}>Help Centre</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Frequently asked questions and platform support.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <h3 style={{ color: '#1b263b', margin: '0 0 12px 0', fontSize: '1.25rem' }}>{faq.q}</h3>
              <p style={{ color: '#415A77', margin: '0', lineHeight: '1.6', fontSize: '1rem' }}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* --- NEW: EXTRA ASSISTANCE BLOCK --- */}
        <div style={{ 
          marginTop: '50px', 
          padding: '40px 30px', 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ color: '#1b263b', margin: '0 0 10px 0' }}>Still need assistance?</h2>
          <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '1.05rem' }}>
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a 
            href="mailto:samuel.david@harmonyestates.in" 
            style={{ 
              display: 'inline-block', 
              backgroundColor: '#C5A059', 
              color: 'white', 
              padding: '14px 30px', 
              borderRadius: '30px', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '1.05rem',
              transition: 'transform 0.2s ease, backgroundColor 0.2s ease' 
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b08d4b'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#C5A059'}
          >
            Email Support Team
          </a>
        </div>

      </div>
    </div>
  );
};

export default HelpCentre;