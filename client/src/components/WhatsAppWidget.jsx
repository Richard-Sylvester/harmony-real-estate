import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppWidget.css';

const WhatsAppWidget = () => {
  // Replace with your brother's actual number (Keep country code, no + or spaces)
  const brokerNumber = "919110621925"; 
  const defaultMessage = "Hi Harmony Real Estate! I need some help regarding a property on your website.";

  return (
    <a 
      href={`https://wa.me/${brokerNumber}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank" 
      rel="noopener noreferrer"
      className="whatsapp-floating-widget"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={35} />
      <span className="whatsapp-tooltip">Chat with us!</span>
    </a>
  );
};

export default WhatsAppWidget;