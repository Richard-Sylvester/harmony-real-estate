import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage'; // <-- Import our new clean page!
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PropertyPage from './pages/PropertyPage';
import PostProperty from './pages/PostProperty';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import EditProperty from './pages/EditProperty';
import BottomNav from './components/BottomNav';
import MobileHeader from './components/MobileHeader';
import AdminRoute from './components/AdminRoute';
import LegalPage from './pages/LegalPage';
import AboutUs from './pages/AboutUs';
import './App.css';

function App() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await axios.get('/api/properties');
      setProperties(data);
    };
    fetchProperties();
  }, []);

  return (
    <Router>
      <MobileHeader />
      <Navbar />
      <main className="main-layout-container">
        <Routes>
          
          {/* HOME PAGE ROUTE - We just pass the properties down to it */}
          <Route path="/" element={<HomePage properties={properties} />} />
          
          {/* OTHER ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/property/:id" element={<PropertyPage properties={properties} />} />
          <Route path="/post-property" element={<PostProperty />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/edit-property/:id" element={<EditProperty />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* LEGAL & COMPANY ROUTES */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/testimonials" element={<div style={{ padding: '100px', textAlign: 'center' }}><h2>Testimonials</h2><p>Coming soon...</p></div>} />
          <Route path="/help-center" element={<div style={{ padding: '100px', textAlign: 'center' }}><h2>Help Center</h2><p>Coming soon...</p></div>} />
          <Route path="/feedback" element={<div style={{ padding: '100px', textAlign: 'center' }}><h2>Feedback</h2><p>Coming soon...</p></div>} />
          {/* --- LEGAL & SUPPORT --- */}
          <Route path="/legal" element={<LegalPage />} />
        </Routes>
      </main>
      <WhatsAppWidget />
      <BottomNav />
      <Footer />
    </Router>
  );
}

export default App;