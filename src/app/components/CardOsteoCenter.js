//src/app/components/CardOsteoCenter.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from 'next/link';
import api from '@/utils/apiCall';


const CardOsteoCenter = ({ params }) => {
    const { id } = params;
    const [osteoCenter, setOsteoCenter] = useState([]);

    useEffect(() => {
        if (id) {
            const fetchOsteoCenterDetails = async () => {
                try {
                    const response = await api.get(`/osteo-centers/${id}`);
                    setOsteoCenter(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des détails du centre ostéopathique");
                }
            };
            fetchOsteoCenterDetails();
        }
    }, [id]);

    return (
        <div className="container mx-auto px-4 py-8">
            {osteoCenter ? (
                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-4xl font-bold text-gray-800 mb-4">{osteoCenter.name}</h3>
                        <p>{osteoCenter.adress}, {osteoCenter.city}</p>
                    </div>
                    <div>
                        {osteoCenter.osteos && osteoCenter.osteos.length > 0 ? (
                            <ul>
                                {osteoCenter.osteos.map((osteo) => (
                                    <li key={osteo.id}>
                                        Dr {osteo.firstname} {osteo.lastname}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            "Aucun ostéopathe"
                        )}
                    </div>
                    <div>
                        <p>Listes des patients :</p>
                        {osteoCenter.patients && osteoCenter.patients.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {osteoCenter.patients.map((patient) => (
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
                        )}
                    </div>
                </div>
            ) : (
                <p>Centre ostéopathique introuvable</p>
            )}
        </div>
    );
};

export default CardOsteoCenter;
