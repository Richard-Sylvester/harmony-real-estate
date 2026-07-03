import { useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import './Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    type: '',
    message: ''
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) return alert("Please select a star rating!");
    if (!formData.type) return alert("Please select a feedback type!");

    setSending(true);
    try {
      await axios.post('/api/feedback', formData);
      setSuccess(true);
      setSending(false);
    } catch (error) {
      console.error(error);
      alert('Failed to send feedback. Please try again.');
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="feedback-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: '#1b263b', fontSize: '2rem' }}>Thank you for your feedback!</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Your thoughts help us make Harmony Real Estate better every day.</p>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <h2>We would love to hear from you!</h2>
        <p className="feedback-subtitle">Your feedback powers our platform.</p>

        <form onSubmit={handleSubmit} className="feedback-form">
          <input 
            type="text" 
            placeholder="Name" 
            className="premium-input"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="premium-input"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <div className="rating-section">
            <p>Rate the Harmony platform</p>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={`feedback-star ${(hoveredStar || formData.rating) >= star ? 'filled' : ''}`}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setFormData({...formData, rating: star})}
                />
              ))}
            </div>
          </div>

          <div className="custom-select-wrapper">
            <select 
              className="premium-input select-feedback"
              required
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="" disabled>Select Feedback</option>
              <option value="I want to report a problem">I want to report a problem</option>
              <option value="I have a suggestion">I have a suggestion</option>
              <option value="I want to compliment Harmony">I want to compliment Harmony</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <textarea 
            placeholder="Type your feedback" 
            className="premium-input feedback-textarea"
            required
            rows="5"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>

          <button type="submit" className="submit-btn" disabled={sending}>
            {sending ? 'Sending...' : 'Send Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;