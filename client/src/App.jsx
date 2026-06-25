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
        </Routes>
      </main>
      <WhatsAppWidget />
      <BottomNav />
      <Footer />
    </Router>
  );
}

export default App;