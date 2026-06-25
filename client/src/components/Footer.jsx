import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="premium-footer">
      <div className="footer-container">
        
        {/* Column 1: Brand & About */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo-link">
            <img src={logo} alt="Harmony Real Estate Logo" className="footer-logo-img" />
          </Link>
          <p className="footer-about">
            Bengaluru's premier real estate platform. We connect verified buyers, sellers, and renters with premium properties across the city.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><FaFacebook size={18} /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/search?type=Sell">Buy a Property</Link></li>
            <li><Link to="/search?type=Rent">Rent a Property</Link></li>
            <li><Link to="/post-property">List Your Property</Link></li>
            <li><Link to="/dashboard">My Dashboard</Link></li>
          </ul>
        </div>

        {/* Column 3: Legal & Support */}
        <div className="footer-col">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><Link to="#">Help Center</Link></li>
            <li><Link to="#">Terms of Service</Link></li>
            <li><Link to="#">Privacy Policy</Link></li>
            <li><Link to="#">Fraud Alert</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className="footer-col contact-col">
          <h3>Contact Us</h3>
          <ul className="footer-contact-info">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>124 Prestige Tower, MG Road,<br/>Bengaluru, Karnataka 560001</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+91 91106 21925</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>support@harmonyrealestate.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Harmony Real Estate. All rights reserved.</p>
        
        {/* --- YOUR DEVELOPER CREDIT --- */}
        <p className="footer-developer-credit">
          Designed & Developed by <a href="https://richardsylvester.vercel.app/" target="_blank" rel="noopener noreferrer">Richard Sylvester</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;