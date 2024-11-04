"use client";

import { useState, useMemo } from 'react';

export default function usePatientFilters(patients) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);
  const [selectedPaymentTypeFilters, setSelectedPaymentTypeFilters] = useState([]);
  const [selectedPaymentModeFilters, setSelectedPaymentModeFilters] = useState([]);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedStatusFilters.length === 0 || selectedStatusFilters.includes(patient.status?.id)) &&
      (selectedPaymentTypeFilters.length === 0 || selectedPaymentTypeFilters.includes(patient.payment?.paymentType?.id)) &&
      (selectedPaymentModeFilters.length === 0 || selectedPaymentModeFilters.includes(patient.payment?.paymentMode?.id))
    );
  }, [patients, searchTerm, selectedStatusFilters, selectedPaymentTypeFilters, selectedPaymentModeFilters]);

  const handleStatusFilterChange = (statusId) => {
    setSelectedStatusFilters(prevFilters =>
      prevFilters.includes(statusId)
        ? prevFilters.filter(id => id !== statusId)
        : [...prevFilters, statusId]
    );
  };

  const handlePaymentTypeFilterChange = (paymentTypeId) => {
    setSelectedPaymentTypeFilters(prevFilters =>
      prevFilters.includes(paymentTypeId)
        ? prevFilters.filter(id => id !== paymentTypeId)
        : [...prevFilters, paymentTypeId]
    );
  };

  const handlePaymentModeFilterChange = (paymentModeId) => {
    setSelectedPaymentModeFilters(prevFilters =>
      prevFilters.includes(paymentModeId)
        ? prevFilters.filter(id => id !== paymentModeId)
        : [...prevFilters, paymentModeId]
    );
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredPatients,
    handleStatusFilterChange,
    handlePaymentTypeFilterChange,
    handlePaymentModeFilterChange,
    selectedStatusFilters,
    selectedPaymentTypeFilters,
    selectedPaymentModeFilters,
  };
}