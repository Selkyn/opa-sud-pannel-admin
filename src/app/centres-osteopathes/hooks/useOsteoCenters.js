// src/hooks/useVetCentersFilters.js

"use client";

import { useState, useMemo } from 'react';

export default function useVetCenterFilters(osteoCenters) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOsteoCenters = useMemo(() => {
    return osteoCenters.filter(osteoCenter =>
      osteoCenter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [osteoCenters, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredOsteoCenters,
  };
}