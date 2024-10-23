// src/app/patients/page.js

"use client";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { capitalizeFirstLetter } from '../utils/stringUtils';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [situations, setSituations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:4000/patients");
        const sortedPatients = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setPatients(sortedPatients);
      } catch (error) {
        console.error("Erreur lors de la récupération des patients");
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
  const fetchSituations = async () => {
    try {
      const response = await axios.get("http://localhost:4000/patients/situation");
      setSituations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des situations");
    }
  };

  fetchSituations();
}, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSituationChange = async (patientId, newSituationId) => {
    try {
      await axios.put(`http://localhost:4000/patients/${patientId}/situation`, { situationId: newSituationId });
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === patientId ? { ...patient, situation: { id: newSituationId, name: situations.find(s => s.id === newSituationId)?.name } } : patient
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la situation:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Patients</h2>

      <div>
        <input
          type="text"
          placeholder="Rechercher ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Lien vers le formulaire d'ajout de patient */}
      <div className="mb-6 text-center">
        <Link href="/patients/form" className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
          Ajouter un patient
        </Link>
      </div>
      <section>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left bg-white shadow-lg rounded-lg">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="px-4 py-2">Patient</th>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Pathologie</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">État</th>
                <th className="px-4 py-2">Paiement</th>
                <th className="px-4 py-2">Mode</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="bg-gray-100 hover:bg-gray-200 border-b">
                    <td className="px-4 py-2">
                      <Link href={`/patients/${patient.id}`}>
                        {patient.sex.name === "male" ? (
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">{capitalizeFirstLetter(patient.name)}</button>
                        ) : (
                          <button className="bg-pink-500 text-white px-4 py-2 rounded-md mr-2">{capitalizeFirstLetter(patient.name)}</button>
                        )}
                      </Link>
                  </td>
                    <td className="px-4 py-2">
                      {patient.client && patient.client.sex ? (
                        patient.client.sex.name === "male" ? "Mr" : patient.client.sex.name === "female" ? "Mme" : "Non spécifié"
                      ) : (
                        "Non spécifié"
                      )}{" "}
                      {patient.client ? `${capitalizeFirstLetter(patient.client.lastname)} ${capitalizeFirstLetter(patient.client.firstname)}` : "Client inconnu"}
                    </td>
                    <td className="px-4 py-2">{capitalizeFirstLetter(patient.pathology)}</td>
                    <td className="px-4 py-2">{patient.animalType ? capitalizeFirstLetter(patient.animalType.name) : 'Non spécifié'}</td>
                    <td className="px-4 py-2">
                      <select
                        value={patient.situation ? patient.situation.id : ''}
                        onChange={(e) => handleSituationChange(patient.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="">Non spécifié</option>
                        {situations.map((situation) => (
                          <option key={situation.id} value={situation.id}>
                            {situation.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">{patient.payment && patient.payment.paymentType ? patient.payment.paymentType.name : 'Non spécifié'}</td>
                    <td className="px-4 py-2">{patient.payment && patient.payment.paymentMode ? patient.payment.paymentMode.name : 'Non spécifié'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">Aucun patient trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}