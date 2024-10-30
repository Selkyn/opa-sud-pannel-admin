"use client"

// src/app/context/PatientContext.js
import { createContext, useContext, useState } from 'react';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [focusedPatientId, setFocusedPatientId] = useState(null);

  return (
    <PatientContext.Provider value={{ focusedPatientId, setFocusedPatientId }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);
