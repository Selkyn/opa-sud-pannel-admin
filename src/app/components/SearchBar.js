"use client";

import React from 'react';

export default function SearchBar({ searchTerm, onSearchChange, placeholder }) {
  return (
    <div className="relative w-full max-w-xs mx-auto mb-6">
      <input
        type="text"
        placeholder={placeholder || "Rechercher..."}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
  );
}