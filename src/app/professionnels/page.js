"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { capitalizeFirstLetter } from '../utils/stringUtils';
import SearchBar from '../components/SearchBar';
import useProfessionalFilters from './hooks/useProfessionalFilter';

export default function ProfessionnelsPage() {
    const [professionals, setProfessionals] = useState([]);

    const {
        searchTerm,
        setSearchTerm,
        filteredProfessionals
      } = useProfessionalFilters(professionals);
    
      useEffect(() => {
        fetchProfessionals();
      }, []);
    
      const fetchProfessionals = async () => {
        try {
          const response = await axios.get("http://localhost:4000/professionals");
          setProfessionals(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des professionnels", error);
        }
      };


    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Professionnels</h2>

            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm}/>

        
            <div className="mb-6 text-center">
                <Link href="/professionnels/form" className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
                    Ajouter un professionnel
                </Link>
            </div>

            <section>
    <div className="overflow-x-auto">
        <table className="table-auto w-full text-left bg-white shadow-lg rounded-lg">
            <thead className="bg-green-900 text-white">
                <tr>
                    <th className="px-4 py-2">Centre vétérinaire</th>
                    <th className="px-4 py-2">Vétérinaires</th>
                    <th className="px-4 py-2">Adresse</th>
                    <th className="px-4 py-2">Téléphone</th>
                    <th className="px-4 py-2">Email</th>
                </tr>
            </thead>
            <tbody>
                {filteredProfessionals.length > 0 ? (
                    filteredProfessionals.map((professional, index) => (
                        <React.Fragment key={professional.id}>
                            <tr 
                                className={`${
                                    index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                                } hover:bg-gray-300 border-b`}
                            >
                                <td className="px-4 py-4">
                                    <Link href={`/professionnels/${professional.id}`}>
                                    {capitalizeFirstLetter(professional.name)}
                                    </Link>
                                </td>
                                <td className="px-4 py-4">
                                    {professional.vets && professional.vets.length > 0 ? (
                                        <ul>
                                            {professional.vets.map((vet) => (
                                                <li key={vet.id}>
                                                    Dr {capitalizeFirstLetter(vet.firstname)} {capitalizeFirstLetter(vet.lastname)}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        "Aucun vétérinaire"
                                    )}
                                </td>
                                <td className="px-4 py-4">{professional.adress}, {professional.postal} {capitalizeFirstLetter(professional.city)}</td>
                                <td className="px-4 py-4">{professional.phone}</td>
                                <td className="px-4 py-4">{professional.email}</td>
                            </tr>
                            {professional.patients && professional.patients.length > 0 && (
                                <tr className="bg-gray-50 border-b">
                                    <td colSpan="5" className="px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {professional.patients.map((patient) => (
                                                <Link key={patient.id} href={`/patients/${patient.id}`}>
                                                    {patient.sex.name === "male" ? (
                                                        <button className="bg-blue-500 text-white px-2 py-2 rounded-md mb-2">
                                                            {patient.name}
                                                        </button>
                                                    ) : (
                                                        <button className="bg-pink-500 text-white px-2 py-2 rounded-md mb-2">
                                                            {patient.name}
                                                        </button>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan="5" className="py-4"></td>
                            </tr>
                        </React.Fragment>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center py-4 text-gray-500">Aucun professionnel trouvé</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
</section>

        </div>
    );
}
