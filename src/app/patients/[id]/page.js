// src/app/patients/[id]/page.js

"use client"; // Indique que ce composant est rendu côté client

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function PatientDetailsPage({ params }) {
    const { id } = params; // Récupération de l'id du patient à partir des paramètres de la route dynamique
    const router = useRouter();

    const [patient, setPatient] = useState(null); // Stocke les détails du patient
    const [loading, setLoading] = useState(true); // Gère l'état de chargement
    const [error, setError] = useState(null); // Gère les erreurs

    useEffect(() => {
        if (id) {
            const fetchPatientDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:4000/patients/${id}`);
                    setPatient(response.data);
                    setLoading(false);
                } catch (err) {
                    setError("Erreur lors de la récupération des détails du patient");
                    setLoading(false);
                }
            };
            fetchPatientDetails();
        }
    }, [id]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleDelete = async () => {
        if(confirm(`Etes-vous sûr de vouloir supprimer ${patient.name} ?`)) {
            try {
                await axios.delete(`http://localhost:4000/patients/${patient.id}/delete`);
                router.push("/patients");
            } catch (error) {
                console.error("Erreur lors de la suppression du patient :", error);
                alert("Une erreur est survenue lors de la suppression du patient.");
            }
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button 
                onClick={() => router.back()} 
                className="bg-green-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-700"
            >
                Revenir à la page précédente
            </button>
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
                            {/* <div>
                                <p><strong>Attentes du client :</strong></p>
                                <textarea className="w-full border-gray-300 rounded-md"></textarea>
                            </div> */}
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
                            {/* <div>
                                <p><strong>Attentes du client :</strong></p>
                                <textarea className="w-full border-gray-300 rounded-md"></textarea>
                            </div> */}
                        </div>
                    </div>
                    {/* <p><strong>Date de naissance:</strong> {patient.birthday}</p>
                    <p><strong>Sexe:</strong> {patient.sex ? patient.sex.name : "Non spécifié"}</p>
                    <p><strong>Pathologie:</strong> {patient.pathology}</p>
                    <p><strong>Date d'inscription:</strong> {patient.createdAt}</p>
                    <p><strong>Email:</strong> {patient.client && patient.client.email ? patient.client.email : "Non spécifié"}</p>
                    <p><strong>Téléphone:</strong> {patient.client && patient.client.phone ? patient.client.phone : "Non spécifié"}</p> */}
                </div>
            ) : (
                <p className="text-center">Patient introuvable</p>
            )}

            <Link href={`/patients/${patient.id}/edit`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Modifier</button>
            </Link>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Supprimer
            </button>

        </div>
        
    );
}