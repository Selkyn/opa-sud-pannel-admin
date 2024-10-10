// src/app/patients/page.js

"use client";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:4000/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des patients");
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Patients Page</h2>
      
      {/* Lien vers le formulaire d'ajout de patient */}
      <div className="mb-6 text-center">
        <Link href="/patients/form" className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
          Ajouter un patient
        </Link>
      </div>
      <section>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-800 text-white">
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
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.id} className="bg-gray-100 hover:bg-gray-200 border-b">
                    <td className="px-4 py-2">
                      <Link href={`/patients/${patient.id}`}>
                          {patient.name}
                      </Link>
                  </td>
                    <td className="px-4 py-2">
                      {patient.client && patient.client.sex ? (
                        patient.client.sex.name === "male" ? "Mr" : patient.client.sex.name === "female" ? "Mme" : "Non spécifié"
                      ) : (
                        "Non spécifié"
                      )}{" "}
                      {patient.client ? patient.client.firstname : "Client inconnu"}
                    </td>
                    <td className="px-4 py-2">{patient.pathology}</td>
                    <td className="px-4 py-2">{patient.animalType ? patient.animalType.name : 'Non spécifié'}</td>
                    <td className="px-4 py-2">{patient.status ? patient.status.name : 'Non spécifié'}</td>
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