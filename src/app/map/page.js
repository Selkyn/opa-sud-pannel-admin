"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import CardPatient from '../components/CardPatient';

// Charger la carte dynamiquement avec SSR désactivé
const Map = dynamic(() => import('../components/Map'), { ssr: false });

const MapPage = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const handleSelectPatient = (id) => {
    console.log("Patient sélectionné :", id); // Vérification
    setSelectedPatientId(id);
  };

  return (
    <div className="flex">
      {/* Carte Leaflet avec 80% de largeur */}
      <div className="w-4/5">
        <Map onSelectPatient={handleSelectPatient} /> 
      </div>
      
      {/* Carte des détails du patient avec 20% de largeur */}
      <div className="w-1/5 bg-gray-100 p-4">
        {selectedPatientId && (
          <CardPatient params={{ id: selectedPatientId }} /> 
        )}
      </div>
    </div>
  );
};

export default MapPage;

