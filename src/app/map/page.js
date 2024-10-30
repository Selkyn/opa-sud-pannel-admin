"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import CardPatient from '../components/CardPatient';
import CardVetCenter from '../components/CardVetCenter';

// Charger la carte dynamiquement avec SSR désactivé
const Map = dynamic(() => import('../components/Map'), { ssr: false });

const MapPage = ({ searchParams }) => { // Ajout de `searchParams` ici
  const patientId = searchParams.patientId; // Récupérer l'ID du patient depuis les paramètres de l'URL
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedVetCenterId, setSelectedVetCenterId] = useState(null);

  useEffect(() => {
    if (patientId) {
      console.log("Patient ID reçu depuis l'URL :", patientId);
    }
  }, [patientId]);

  const handleSelectPatient = (id) => {
    console.log("Patient sélectionné :", id); // Vérification
    setSelectedPatientId(id);
    setSelectedVetCenterId(null);
  };

  const handleSelectVetCenter = (id) => {
    setSelectedVetCenterId(id);
    setSelectedPatientId(null);
  };

  return (
    <div className="flex">
      <div className="w-4/5">
        <Map
          onSelectPatient={handleSelectPatient}
          onSelectVetCenter={handleSelectVetCenter}
          focusedPatientId={patientId} // Passer patientId comme prop
        />
      </div>
      <div className="w-1/5 bg-gray-100 p-4">
        {selectedPatientId && <CardPatient params={{ id: selectedPatientId }} />}
        {selectedVetCenterId && <CardVetCenter params={{ id: selectedVetCenterId }} />}
      </div>
    </div>
  );
};

export default MapPage;
