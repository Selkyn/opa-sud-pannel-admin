"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function ProfessionnelsPage() {
    const [professionals, setProfessionals] = useState([]);

    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const response = await axios.get("http://localhost:4000/professionals");
                console.log("Données récupérées :", response.data); 
                setProfessionals(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des professionnels");
            }
        };
        fetchProfessionals();
    }, []);
   

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Professionnels</h2>
        
            <div className="mb-6 text-center">
                <Link href="/professionals/form" className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
                    Ajouter un professionnel
                </Link>
            </div>

            <section>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left bg-white shadow-lg rounded-lg">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">Centre vétérinaire</th>
                                <th className="px-4 py-2">Vétérinaires</th>
                                <th className="px-4 py-2">Patients</th>
                                <th className="px-4 py-2">Adresse</th>
                                <th className="px-4 py-2">Téléphone</th>
                                <th className="px-4 py-2">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professionals.length > 0 ? (
                                professionals.map((professional) => (
                                    <tr key={professional.id} className="bg-gray-100 hover:bg-gray-200 border-b">
                                        <td className="px-4 py-2">{professional.name}</td>
                                        <td className="px-4 py-2">
                                            {professional.vets && professional.vets.length > 0 ? (
                                                <ul>
                                                    {professional.vets.map((vet) => (
                                                        <li key={vet.id}>
                                                            Dr {vet.firstname} {vet.lastname}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                "Aucun vétérinaire"
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {professional.patients && professional.patients.length > 0 ? (
                                                <ul>
                                                    {professional.patients.map((patient) => (
                                                        <li key={patient.id}>
                                                        <Link href={`/patients/${patient.id}`}>
                                                            {patient.sex.name === "male" ? (
                                                            <button className="bg-blue-500 text-white px-2 py-2 rounded-md mb-2">{patient.name}</button>
                                                            ) : (
                                                            <button className="bg-pink-500 text-white px-2 py-2 rounded-md mb-2">{patient.name}</button>
                                                            )}
                                                        </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                "Aucun patient"
                                            )}
                                        </td>
                                        <td className="px-4 py-2">{professional.adress}</td>
                                        <td className="px-4 py-2">{professional.phone}</td>
                                        <td className="px-4 py-2">{professional.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">Aucun professionnel trouvé</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
