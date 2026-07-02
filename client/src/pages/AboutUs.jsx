import React from 'react';
import './AboutUs.css'; // We'll create this in the next step

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Harmony Estate And Developers</h1>
        <p>Your Trusted Partner in Bengaluru Real Estate</p>
      </div>

      <div className="about-content">
        <div className="about-text">
          <h2>Redefining Property Facilitation</h2>
          <p>
            At Harmony Estate And Developers, we believe that finding a home should be as seamless 
            as living in one. Unlike traditional platforms that leave you to navigate 
            endless listings and unverified agents, we provide a personalized, 
            brokerage-led experience.
          </p>
          <p>
            We curate only the highest quality properties, ensuring that every listing 
            you see on our platform meets our stringent standards for quality, legal 
            clearance, and transparency.
          </p>

          <h2 style={{ marginTop: '40px' }}>Meet the Founder</h2>
          <p>
            <strong>Samuel Mishael David</strong> is the driving force behind Harmony. 
            With a deep understanding of the Bengaluru property market and a passion 
            for helping families find their perfect match, he acts as your dedicated 
            point of contact throughout the entire journey.
          </p>
          <p>
            "My goal isn't just to help you rent or buy a property; it's to ensure 
            that every step of the process is handled with total professionalism, 
            clear communication, and absolute peace of mind."
          </p>
        </div>

        <div className="about-image">
          <img 
            src="[INSERT_URL_TO_FOUNDER_PHOTO]" 
            alt="Founder of Harmony Real Estate" 
            className="founder-photo"
          />
          <div className="founder-quote">
            <p>"Harmony: Where your property search ends and your new chapter begins."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;