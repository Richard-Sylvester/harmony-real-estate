import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Extracts the current pathname (e.g., '/about', '/privacy')
  const { pathname } = useLocation();

  useEffect(() => {
    // Forces the browser window to scroll to the absolute top-left
    window.scrollTo(0, 0);
  }, [pathname]); // This array ensures the effect runs EVERY time the URL changes

  return null; // This component is invisible!
};

export default ScrollToTop;