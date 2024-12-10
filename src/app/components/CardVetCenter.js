//src/app/components/CardVetCenter.js

import React, {useEffect, useState} from "react";
import axios from "axios";
import Link from 'next/link';


const CardVetCenter = ({ params }) => {
    const { id } = params;
    const [vetCenter, setVetCenter] = useState([]);

    useEffect(() => {
        if (id) {
            const fetchVetCenterDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:4000/vet-centers/${id}`);
                    setVetCenter(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des détails du centre vétérinaire");
                }
            };
            fetchVetCenterDetails();
        }
    }, [id])

    return(
        <div className="container mx-auto px-4 py-8">
            {vetCenter ? (
                <div className="flex flex-col gap-4">
                    <div>
                        <Link key={vetCenter.id} href={`/centres-veterinaires/${vetCenter.id}`}>
                            <h3 className="text-4xl font-bold text-gray-800 mb-4">{vetCenter.name}</h3>
                        </Link>    
                        <p>{vetCenter.adress}, {vetCenter.city}</p>
                        <p>Téléphone : {vetCenter.phone}</p>
                        <p>Email : {vetCenter.email}</p>
                        <p>Infos : {vetCenter.infos}</p>
                    </div>
                    <div>
                        Liste des vétérinaires : 
                        {vetCenter.vets && vetCenter.vets.length > 0 ? (
                            <ul>
                                {vetCenter.vets.map((vet) =>(
                                    <li className="mt-8" key={vet.id}>
                                        Dr {vet.firstname} {vet.lastname}
                                        <ul>
                                            <li>Email : {vet.email}</li>
                                            <li>Téléphone: {vet.phone}</li>
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            "Aucun vétérinaire"
                        )}
                    </div>
                    <div>
                        <p>Listes des patients :</p>
                        {vetCenter.patients && vetCenter.patients.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {vetCenter.patients.map((patient) => (
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
                <p>Centre vétérinaire introuvable</p>
            )}
        </div>
    )
}

export default CardVetCenter;