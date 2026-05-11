import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation]   = useState(null);   // { lat, lng }
  const [area, setArea]           = useState('Detecting location...');
  const [status, setStatus]       = useState('idle'); // idle | detecting | granted | denied | error

  const detect = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setArea('Geolocation not supported');
      return;
    }
    setStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocation({ lat, lng });
        setStatus('granted');
        // Reverse-geocode using a free API (no key needed)
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(r => r.json())
          .then(d => {
            const suburb = d.address?.suburb || d.address?.neighbourhood || d.address?.city_district || '';
            const city   = d.address?.city || d.address?.town || d.address?.village || '';
            setArea([suburb, city].filter(Boolean).join(', ') || 'Your location');
          })
          .catch(() => setArea(`${lat.toFixed(3)}, ${lng.toFixed(3)}`));
      },
      () => {
        setStatus('denied');
        setArea('Location access denied');
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  // Auto-detect on mount
  useEffect(() => { detect(); }, []);

  return (
    <LocationContext.Provider value={{ location, area, status, detect }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation2 = () => useContext(LocationContext);
