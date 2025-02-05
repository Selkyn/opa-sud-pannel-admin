"use client";

import { useState, useMemo } from "react";

export default function usePatientFilters(patients) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);
  const [selectedPaymentTypeFilters, setSelectedPaymentTypeFilters] = useState([]);
  const [selectedPaymentModeFilters, setSelectedPaymentModeFilters] = useState([]);
  const [selectedPaymentStatusFilters, setSelectedPaymentStatusFilters] = useState([]);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Vérifier si le nom du patient correspond au terme de recherche
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Vérifier si le statut du patient est sélectionné
      const matchesStatus = selectedStatusFilters.length === 0 || selectedStatusFilters.includes(patient.status?.id);

      // Vérifier si AU MOINS UN paiement correspond aux filtres
      const matchesPayment = patient.payments?.some((payment) => 
        (selectedPaymentTypeFilters.length === 0 || selectedPaymentTypeFilters.includes(payment.paymentType?.id)) &&
        (selectedPaymentModeFilters.length === 0 || selectedPaymentModeFilters.includes(payment.paymentMode?.id)) &&
        (selectedPaymentStatusFilters.length === 0 || selectedPaymentStatusFilters.includes(payment.paymentStatus?.id))
      ) ?? true; // Si `patient.payments` est vide, on laisse passer

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [
    patients,
    searchTerm,
    selectedStatusFilters,
    selectedPaymentTypeFilters,
    selectedPaymentModeFilters,
    selectedPaymentStatusFilters,
  ]);

  const handleStatusFilterChange = (statusId) => {
    setSelectedStatusFilters((prevFilters) =>
      prevFilters.includes(statusId) ? prevFilters.filter((id) => id !== statusId) : [...prevFilters, statusId]
    );
  };

  const handlePaymentTypeFilterChange = (paymentTypeId) => {
    setSelectedPaymentTypeFilters((prevFilters) =>
      prevFilters.includes(paymentTypeId) ? prevFilters.filter((id) => id !== paymentTypeId) : [...prevFilters, paymentTypeId]
    );
  };

  const handlePaymentModeFilterChange = (paymentModeId) => {
    setSelectedPaymentModeFilters((prevFilters) =>
      prevFilters.includes(paymentModeId) ? prevFilters.filter((id) => id !== paymentModeId) : [...prevFilters, paymentModeId]
    );
  };

  const handlePaymentStatusFilterChange = (paymentStatusId) => {
    setSelectedPaymentStatusFilters((prevFilters) =>
      prevFilters.includes(paymentStatusId) ? prevFilters.filter((id) => id !== paymentStatusId) : [...prevFilters, paymentStatusId]
    );
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredPatients,
    handleStatusFilterChange,
    handlePaymentTypeFilterChange,
    handlePaymentModeFilterChange,
    handlePaymentStatusFilterChange,
    selectedStatusFilters,
    selectedPaymentTypeFilters,
    selectedPaymentModeFilters,
    selectedPaymentStatusFilters,
  };
}
