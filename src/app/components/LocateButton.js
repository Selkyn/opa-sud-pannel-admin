"use client";

// components/LocateButton.js
import { useMap } from 'react-leaflet';

const LocateButton = ({ onLocate }) => {
  const map = useMap();

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocate([latitude, longitude]);
          map.flyTo([latitude, longitude], 17, { animate: true, duration: 1 });
        },
        (error) => {
          console.error("Erreur de géolocalisation :", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  };

  return (
    <button
      onClick={handleLocate}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      📍 Me localiser
    </button>
  );
};

export default LocateButton;