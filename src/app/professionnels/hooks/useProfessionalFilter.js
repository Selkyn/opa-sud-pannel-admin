// src/hooks/useProfessionalFilters.js

"use client";

import { useState, useMemo } from 'react';

export default function useProfessionalFilters(professionals) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(professional =>
      professional.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [professionals, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredProfessionals,
  };
}