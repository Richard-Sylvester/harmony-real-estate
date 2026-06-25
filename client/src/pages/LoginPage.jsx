import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; // Make sure this path points to your new file
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let responseData;

      if (isLogin) {
        // --- LOGGING IN ---
        // Sends data to router.post('/login') in your backend
        const { data } = await axios.post('/api/users/login', {
          email: formData.email,
          password: formData.password
        });
        responseData = data;
      } else {
        // --- REGISTERING ---
        // Sends data to router.post('/') in your backend
        const { data } = await axios.post('/api/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        responseData = data;
      }

      // 1. Save the VIP token to the browser
      localStorage.setItem('userInfo', JSON.stringify(responseData));
      
      // 2. Redirect to the homepage
      window.location.href = '/';

    } catch (error) {
      // If the backend sends back a 400 or 401 error (wrong password, user exists, etc.)
      const errorMessage = error.response?.data?.message || "Authentication failed. Please try again.";
      console.error("Manual Auth Error:", errorMessage);
      alert(errorMessage);
    }
  };

 const handleGoogleLogin = async (e) => {
    e.preventDefault(); 
    
    try {
      // 1. The Bouncer: Firebase verifies the Google Account
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // 2. The Bridge: Send the verified data to your Node.js backend
      // Note: We use a specific route here, like '/api/users/google'
      const { data } = await axios.post('/api/users/google', {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL // Google gives us their profile picture for free!
      });

      // 3. The VIP Lounge: Save the backend response (token) and let them in
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/';

    } catch (error) {
      console.error("Google Auth Failed:", error.message);
      alert("Failed to log in with Google. Please try again.");
    }
  };

  return (
    <div className="premium-auth-container">
      
      {/* --- LEFT PANEL: Brand & Imagery --- */}
      <div className="auth-left-panel">
        <button onClick={() => navigate('/')} className="auth-back-btn">
          <ArrowLeft size={18} /> Back to Harmony
        </button>
        
        <div className="auth-brand-content">
          <h1>Find Your Space in <br/><span className="text-gold">Harmony</span></h1>
          <p>Join Bengaluru's most exclusive network of premium property owners and verified buyers.</p>
        </div>
      </div>

      {/* --- RIGHT PANEL: The Form --- */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="auth-toggle-link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign up for free' : 'Log in here'}
              </span>
            </p>
          </div>

          {/* --- GOOGLE AUTH BUTTON --- */}
          <button className="google-auth-btn" onClick={handleGoogleLogin}>
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          {/* --- THE FORM --- */}
          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* Name Input (Only shows on Sign Up) */}
            <div className={`form-field-slide ${!isLogin ? 'show' : ''}`}>
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-icon" />
                <input 
                  type="text" 
                  name="name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-icon" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="forgot-password-link">
                Forgot password?
              </div>
            )}

            <button type="submit" className="auth-submit-btn">
              {isLogin ? 'Log In to Account' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-footer-disclaimer">
            By continuing, you agree to Harmony's Terms of Service and Privacy Policy.
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;