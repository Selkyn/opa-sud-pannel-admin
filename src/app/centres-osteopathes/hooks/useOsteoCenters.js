// src/hooks/useVetCentersFilters.js

"use client";

import { useState, useMemo } from 'react';

export default function useVetCenterFilters(osteoCenters) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactFilters, setSelectedContactFilters] = useState([]);

  const filteredOsteoCenters = useMemo(() => {
    return osteoCenters.filter(osteoCenter =>
      osteoCenter.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedContactFilters.length === 0 || selectedContactFilters.includes(osteoCenter.contact?.id))
    );
  }, [osteoCenters, searchTerm, selectedContactFilters]);

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
    filteredOsteoCenters,
    handleContactFilterChange,
    selectedContactFilters
  };
}