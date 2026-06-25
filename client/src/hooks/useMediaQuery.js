import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 1. Ask the browser if the current screen matches our query (e.g., max-width: 768px)
    const media = window.matchMedia(query);
    
    // 2. Set the initial state
    setMatches(media.matches);

    // 3. Create a listener that fires every time the screen is resized
    const listener = (event) => {
      setMatches(event.matches);
    };

    // 4. Attach the listener to the window
    media.addEventListener('change', listener);

    // 5. Cleanup function (Security/Performance!) 
    // This stops the app from crashing by removing the listener if the component is deleted.
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};