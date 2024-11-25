// src/hooks/useVetCentersFilters.js

"use client";

import { useState, useMemo } from 'react';

export default function useVetCenterFilters(vetCenters) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactFilters, setSelectedContactFilters] = useState([]);

  const filteredVetCenters = useMemo(() => {
    return vetCenters.filter(vetCenter =>
      vetCenter.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedContactFilters.length === 0 || selectedContactFilters.includes(vetCenter.contact?.id))
    );
  }, [vetCenters, searchTerm, selectedContactFilters]);

  const handleContactFilterChange = (contactId) => {
    setSelectedContactFilters(prevFilters =>
      prevFilters.includes(contactId)
        ? prevFilters.filter(id => id !== contactId)
        : [...prevFilters, contactId]
    );
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredVetCenters,
    handleContactFilterChange,
    selectedContactFilters
  };
}