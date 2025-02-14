// src/app/patients/page.js

"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import CheckboxFilter from "../components/CheckBoxFilter";
import usePatientFilters from "./hooks/usePatientFilters";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { dateInput } from "@nextui-org/react";
import withAuth from "../../utils/withAuth";
import api from "@/utils/apiCall";
import { Payment, columns } from "./columns";
import { DataTable } from "../components/data-table";
import CardPatientList from "../components/CardPatientList";
import { Switch } from "@/components/ui/switch";
import { Badge } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [status, setStatus] = useState([]);
  const [payments, setPayments] = useState();
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [totalPatients, setTotalPatients] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 20;
  const [isCardView, setIsCardView] = useState(true);

  const {
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
  } = usePatientFilters(patients);

  // Calcul des patients visibles
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    setTotalPatients(patients.length);
  }, [patients]);

  const fetchPatients = async () => {
    try {
      const response = await api.get("/patients");
      const sortedPatients = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setPatients(sortedPatients);
    } catch (error) {
      console.error("Erreur lors de la récupération des patients");
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/patients/status");
        setStatus(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des Status");
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      try {
        const response = await api.get("/paymentStatus");
        setPaymentStatuses(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des status de paiements");
      }
    };

    fetchPaymentStatuses();
  }, []);

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const response = await api.get("/paymentTypes");
        setPaymentTypes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des types de paiements");
      }
    };

    fetchPaymentTypes();
  }, []);

  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const response = await api.get("/paymentModes");
        setPaymentModes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des Modes de paiements");
      }
    };

    fetchPaymentModes();
  }, []);

  const handleStatusChange = async (patientId, newStatusId) => {
    try {
      await api.put(`/patients/${patientId}/status`, { statusId: newStatusId });
      fetchPatients();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const handlePaymentTypeChange = async (patientId, newPaymentTypeId) => {
    try {
      await api.put(`/payment/${patientId}/edit`, {
        paymentTypeId: newPaymentTypeId,
      });
      fetchPatients();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du type de paiement:",
        error
      );
    }
  };

  const handlePaymentModeChange = async (patientId, newPaymentModeId) => {
    try {
      await api.put(`/payment/${patientId}/edit`, {
        paymentModeId: newPaymentModeId,
      });
      fetchPatients();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du mode de paiement:",
        error
      );
    }
  };

  const handleDateChange = async (patientId, newDate) => {
    try {
      await api.put(`/payment/${patientId}/edit`, { date: newDate });
      fetchPatients();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la date de paiement:",
        error
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedStatusFilters,
    selectedPaymentTypeFilters,
    selectedPaymentModeFilters,
    selectedPaymentStatusFilters,
  ]);


  return (
    <div className="container mx-auto p-4 w-full">
      {/* Conteneur principal : divisé en deux parties (contenu à gauche et filtres à droite) */}
      <div className="flex justify-between gap-6">
        {/* 🌍 Section principale (Barre de recherche, toggle, patients) */}
        <div className="flex-1">
          {/* 🔍 Barre de recherche et switch (table/cards) */}
          <div className="flex flex-col items-center  mb-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Rechercher un patient..."
            />
            <span className="rounded-lg bg-green-700 text-white px-2">
              {filteredPatients.length} / {totalPatients}
            </span>

            {/* <div className="flex items-center space-x-3">
            <label>Table</label>
            <Switch checked={isCardView} onCheckedChange={setIsCardView} />
            <label>Cards</label>
          </div> */}
          </div>

          {/* 🏥 Nombre total de patients et bouton d'ajout */}
          <div className="flex justify-between items-center mb-6">
            {/* <p className="text-lg font-semibold">
            Nombre de patients : {filteredPatients.length} / {totalPatients}
          </p> */}
            {/* <span className="rounded-lg bg-blue-500 text-white px-2">{filteredPatients.length} / {totalPatients}</span> */}
            {/* <Link
            href="/patients/form"
            className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
          >
            Ajouter un patient
          </Link> */}
          </div>

          {/* 📋 Liste des patients (table ou cards) */}
          <section>
            {isCardView ? (
              <div className="flex flex-wrap justify-center gap-4">
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient) => (
                    <CardPatientList key={patient.id} patient={patient} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    Aucun patient trouvé

                  </p>
                )}
              </div>
            ) : (
              <DataTable columns={columns} data={currentPatients} />
            )}

            {/* 📌 Pagination */}
            <Pagination
              totalItems={filteredPatients.length}
              currentPage={currentPage}
              itemsPerPage={patientsPerPage}
              onPageChange={setCurrentPage}
            />
          </section>
        </div>

        {/* 🎯 Section des filtres (toujours à droite) */}
        <div className="w-1/8 space-y-4">
          <div className="flex items-center space-x-3 mb-8">
            <label>Table</label>
            <Switch checked={isCardView} onCheckedChange={setIsCardView} />
            <label>Cards</label>
          </div>
          <Link
            href="/patients/form"
            // className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
          >
            <Button className="bg-green-700 hover:bg-green-600">Ajouter un patient</Button>
            
          </Link>

          <div className="mt-4 border-2 rounded-lg px-2 pt-2 bg-gray-50">
            <h3 className="font-semibold">Filtres</h3>
            <CheckboxFilter
              title="Status du patient"
              options={status}
              selectedFilters={selectedStatusFilters}
              onFilterChange={handleStatusFilterChange}
            />

            <CheckboxFilter
              title="Status de paiement"
              options={paymentStatuses}
              selectedFilters={selectedPaymentStatusFilters}
              onFilterChange={handlePaymentStatusFilterChange}
            />

            <CheckboxFilter
              title="Type de paiement"
              options={paymentTypes}
              selectedFilters={selectedPaymentTypeFilters}
              onFilterChange={handlePaymentTypeFilterChange}
            />

            <CheckboxFilter
              title="Mode de paiement"
              options={paymentModes}
              selectedFilters={selectedPaymentModeFilters}
              onFilterChange={handlePaymentModeFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  {
    /* <div className="overflow-x-auto">
          <table className="table-auto w-full text-left bg-white shadow-lg rounded-lg">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="px-4 py-2">Patient</th>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">État</th>
                <th className="px-4 py-2">Paiement</th>
                <th className="px-4 py-2">Mode</th>
                <th className="px-4 py-2">Date de paiment</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="bg-gray-100 hover:bg-gray-200 border-b"
                  >
                    <td className="px-4 py-2">
                      <Link href={`/patients/${patient.id}`}>
                        {patient.sex.name === "male" ? (
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                            {capitalizeFirstLetter(patient.name)}
                          </button>
                        ) : (
                          <button className="bg-pink-500 text-white px-4 py-2 rounded-md mr-2">
                            {capitalizeFirstLetter(patient.name)}
                          </button>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      {patient.client && patient.client.sex
                        ? patient.client.sex.name === "male"
                          ? "Mr"
                          : patient.client.sex.name === "female"
                          ? "Mme"
                          : "Non spécifié"
                        : "Non spécifié"}{" "}
                      {patient.client
                        ? `${capitalizeFirstLetter(
                            patient.client.lastname
                          )} ${capitalizeFirstLetter(patient.client.firstname)}`
                        : "Client inconnu"}
                    </td>
                    <td className="px-4 py-2">
                      {patient.animalType
                        ? capitalizeFirstLetter(patient.animalType.name)
                        : "Non spécifié"}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={patient.status ? patient.status.id : ""}
                        onChange={(e) =>
                          handleStatusChange(patient.id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        {status.map((statu) => (
                          <option key={statu.id} value={statu.id}>
                            {statu.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={
                          patient.payment && patient.payment.paymentType
                            ? patient.payment.paymentType.id
                            : ""
                        }
                        onChange={(e) =>
                          handlePaymentTypeChange(patient.id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        {paymentTypes.map((paymentType) => (
                          <option key={paymentType.id} value={paymentType.id}>
                            {paymentType.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={
                          patient.payment && patient.payment.paymentMode
                            ? patient.payment.paymentMode.id
                            : ""
                        }
                        onChange={(e) =>
                          handlePaymentModeChange(patient.id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        {paymentModes.map((paymentMode) => (
                          <option key={paymentMode.id} value={paymentMode.id}>
                            {paymentMode.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={
                          patient.payment && patient.payment.date
                            ? patient.payment.date.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleDateChange(patient.id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Aucun patient trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div> */
  }
}
