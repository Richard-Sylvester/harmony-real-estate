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
          <h3>Company</h3>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Testimonials</Link></li>
            <li><Link to="/search?type=Sell">Buy a Property</Link></li>
            <li><Link to="/search?type=Rent">Rent a Property</Link></li>
            <li><Link to="/post-property">List Your Property</Link></li>
          </ul>
        </div>

        {/* Column 3: Legal & Support */}
        <div className="footer-col">
          <h3>Support & Legal</h3>
          <ul className="footer-links">
            <li><Link to="/legal#help">Help Center</Link></li>
            <li><Link to="/legal#feedback">Feedback</Link></li>
            <li><Link to="/legal#terms">Terms of Service</Link></li>
            <li><Link to="/legal#privacy">Privacy Policy</Link></li>
            <li><Link to="/legal#fraud">Fraud Alert</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Us (NOW CLICKABLE!) */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul className="footer-contact-info">
            <li>
              <MapPin className="contact-icon" size={20} />
              <a href="https://maps.google.com/?q=124+Prestige+Tower,+MG+Road,+Bengaluru,+Karnataka+560001" target="_blank" rel="noopener noreferrer" className="contact-link">
                124 Prestige Tower, MG Road,<br />Bengaluru, Karnataka 560001
              </a>
            </li>
            <li>
              <Phone className="contact-icon" size={20} />
              <a href="tel:+919110621925" className="contact-link">+91 91106 21925</a>
            </li>
            <li>
              <Mail className="contact-icon" size={20} />
              <a href="mailto:support@harmonyrealestate.com" className="contact-link">
                support@harmonyrealestate.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Harmony Estate And Developers. All rights reserved.</p>
        
        {/* --- YOUR DEVELOPER CREDIT --- */}
        <p className="footer-developer-credit">
          Designed & Developed by <a href="https://richardsylvester.vercel.app/" target="_blank" rel="noopener noreferrer">Richard Sylvester</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;