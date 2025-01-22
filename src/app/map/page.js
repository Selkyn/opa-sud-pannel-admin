"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import CardPatient from '../components/CardPatient';
import CardVetCenter from '../components/CardVetCenter';
import CardOsteoCenter from '../components/CardOsteoCenter';

// Charger la carte dynamiquement avec SSR désactivé
const Map = dynamic(() => import('../components/Map'), { ssr: false });

const MapPage = ({ searchParams }) => {
  // const patientId = searchParams.patientId;
  // const vetCenterId = searchParams.vetCenterId;
  // const osteoCenterId = searchParams.osteoCenterId;
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedVetCenterId, setSelectedVetCenterId] = useState(null);
  const [selectedOsteoCenterId, setSelectedOsteoCenterId] = useState(null);

    // Met à jour les états locaux lorsque les paramètres changent
    useEffect(() => {
      if (searchParams.patientId) {
        setSelectedPatientId(searchParams.patientId);
        setSelectedVetCenterId(null);
        setSelectedOsteoCenterId(null);
      } else if (searchParams.vetCenterId) {
        setSelectedVetCenterId(searchParams.vetCenterId);
        setSelectedPatientId(null);
        setSelectedOsteoCenterId(null);
      } else if (searchParams.osteoCenterId) {
        setSelectedOsteoCenterId(searchParams.osteoCenterId);
        setSelectedVetCenterId(null);
        setSelectedPatientId(null);
      }
    }, [searchParams]);

  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    setSelectedVetCenterId(null);
    setSelectedOsteoCenterId(null);
  };

  const handleSelectVetCenter = (id) => {
    setSelectedVetCenterId(id);
    setSelectedPatientId(null);
    setSelectedOsteoCenterId(null);
  };

  const handleSelectOsteoCenter = (id) => {
    setSelectedOsteoCenterId(id);
    setSelectedVetCenterId(null);
    setSelectedPatientId(null);
  };

  return (
    <div className="flex">
      <div className="w-4/5">
        <Map
          onSelectPatient={handleSelectPatient}
          onSelectVetCenter={handleSelectVetCenter}
          onSelectOsteoCenter={handleSelectOsteoCenter}
          focusedPatientId={selectedPatientId}
          focusedVetCenterId={selectedVetCenterId}
          focusedOsteoCenterId={selectedOsteoCenterId}
        />
      </div>
      <div className="w-1/5 bg-gray-100 p-4">
        {selectedPatientId && <CardPatient params={{ id: selectedPatientId }} />}
        {selectedVetCenterId && <CardVetCenter params={{ id: selectedVetCenterId }} />}
        {selectedOsteoCenterId && <CardOsteoCenter params={{ id: selectedOsteoCenterId }} />}
      </div>
    </div>
  );
};

export default MapPage;
