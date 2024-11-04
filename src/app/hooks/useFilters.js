// src/hooks/useFilters.js
"use client";

import { useState, useMemo } from 'react';

export default function useFilters(items, { searchKey, filtersConfig }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(
    filtersConfig.reduce((acc, filter) => ({ ...acc, [filter.key]: [] }), {})
  );

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item[searchKey].toLowerCase().includes(searchTerm.toLowerCase()) &&
      filtersConfig.every(filter => 
        selectedFilters[filter.key].length === 0 || 
        selectedFilters[filter.key].includes(item[filter.key]?.id)
      )
    );
  }, [items, searchTerm, selectedFilters]);

  const handleFilterChange = (filterKey, id) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: prevFilters[filterKey].includes(id)
        ? prevFilters[filterKey].filter(selectedId => selectedId !== id)
        : [...prevFilters[filterKey], id]
    }));
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    handleFilterChange,
    selectedFilters,
  };
}
