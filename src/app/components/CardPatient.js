//src/app/components/CardPatient.js
import React, { useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const CardPatient = ({ params }) => {
    const { id } = params;
    const [patient, setPatient] = useState([]);
    const [loading, setLoading] = useState(true); // Gère l'état de chargement
    const [error, setError] = useState(null); 

    useEffect(() => {
        if (id) {
          const fetchPatientDetails = async () => {
            try {
              const response = await axios.get(`http://localhost:4000/patients/${id}`);
              setPatient(response.data);
              console.log("Détails du patient :", response.data); // Vérification
            } catch (error) {
              console.error("Erreur lors de la récupération des détails du patient");
            }
          };
          fetchPatientDetails();
        }
      }, [id]);



    return (
        <div className="container mx-auto px-4 py-8">
            {patient ? (
                <div className="flex flex-col item-center">
                    {/* Section du nom du patient */}
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">{patient.name}</h1>
                        <p className="text-gray-600"><strong>Date du premier contact :</strong> {patient.createdAt}</p>
                    </div>
                    {/* Section Patient */}
                    <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Client</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Nom du client : </strong>
                                {patient.client && patient.client.sex ? (
                                    patient.client.sex.name === "male" ? "Mr" : patient.client.sex.name === "female" ? "Mme" : "Non spécifié"
                                ) : (
                                    "Non spécifié"
                                )}{" "} 
                                {patient.client && patient.client.lastname ? patient.client.lastname : "Non spécifié"} {patient.client && patient.client.firstname ? patient.client.firstname : "Non spécifié"}</p>
                                <p><strong>Adresse mail :</strong> {patient.client && patient.client.email ? patient.client.email : "Non spécifié"}</p>
                                <p><strong>Téléphone :</strong> {patient.client && patient.client.phone ? patient.client.phone : "Non spécifié"}</p>
                                <p><strong>Adresse :</strong> {patient.client && patient.client.adress ? patient.client.adress : "Non spécifié"}</p>
                            </div>

                        </div>
                    </div>
                    <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Patient</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Espece : </strong> {patient.animalType && patient.animalType.name ? patient.animalType.name : "Non spécifié"}</p>
                                <p><strong>Race : </strong> {patient.race && patient.race.name ? patient.race.name : "Non spécifié"}</p>
                                <p><strong>Date de naissance :</strong> {patient.birthday ? patient.birthday : "Non spécifié"}</p>
                                <p><strong>Poids :</strong></p>
                                <p><strong>Pathologie :</strong> {patient.pathology? patient.pathology: "Non spécifié"}</p>
                            </div>
                            {/* <div>
                                <p><strong>Attentes du client :</strong></p>
                                <textarea className="w-full border-gray-300 rounded-md"></textarea>
                            </div> */}
                        </div>
                    </div>
                    <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Centre vétérinaire</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Nom du centre : </strong> {patient.vetCenter && patient.vetCenter.name ? patient.vetCenter.name : "Non spécifié"}</p>
                                <p><strong>Adresse mail :</strong> {patient.vetCenter && patient.vetCenter.email ? patient.vetCenter.email : "Non spécifié"}</p>
                                <p><strong>Téléphone :</strong> {patient.vetCenter && patient.vetCenter.phone ? patient.vetCenter.phone : "Non spécifié"}</p>
                                <p><strong>Vétérinaire :</strong></p>
                                {patient.vetCenter?.vets && patient.vetCenter.vets.length > 0 ? (
                                    <ul>
                                        {patient.vetCenter.vets.map((vet) => (
                                            <li key={vet.id}>
                                                Dr {vet.firstname} {vet.lastname}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    "Aucun vétérinaire"
                                )}

                            </div>

                        </div>
                    </div>
                    
                </div>
            ) : (
                <p className="text-center">Patient introuvable</p>
            )}


        </div>
        
    );
}

export default CardPatient;