// src/hooks/useVetCentersFilters.js

"use client";

import { useState, useMemo } from 'react';

export default function useVetCenterFilters(vetCenters) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVetCenters = useMemo(() => {
    return vetCenters.filter(vetCenter =>
      vetCenter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vetCenters, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredVetCenters,
  };
}