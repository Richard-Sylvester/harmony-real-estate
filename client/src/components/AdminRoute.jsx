import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // 1. Grab the current user from LocalStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // 2. Check if they exist AND if they have the VIP pass
  if (userInfo && userInfo.isAdmin) {
    return children; // Let them see the dashboard!
  } else {
    // Kick them back to the homepage immediately
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;