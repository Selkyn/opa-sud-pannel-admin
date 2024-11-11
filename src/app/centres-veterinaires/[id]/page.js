// src/app/centres-veterinaires/[id]/page.js

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function vetCenterDetailsPage({ params }) {
    const { id } = params;
    const router = useRouter();

    const [vetCenter, setvetCenter] = useState(null);

    useEffect(() => {
        if(id) {
            const fetchVetCenterDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:4000/vet-centers/${id}`)
                    setvetCenter(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des détails du centre vétérinaire");
                }
            };
            fetchVetCenterDetails();
        }
    }, [id]);

    const handleDelete = async () => {
        if (confirm(`Etes-vous sûr de vouloir supprimer ${vetCenter.name} ?`)) {
          try {
            await axios.delete(`http://localhost:4000/vet-centers/${vetCenter.id}/delete`);
      
            router.push("/centres-veterinaires");
      
          } catch (error) {
            console.error("Erreur lors de la suppression du vetCenter :", error);
          }
        }
      };

    return (
        <div className="container mx-auto px-4 py-8">
            <button 
                onClick={() => router.back()} 
                className="bg-green-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-700"
            >
                Revenir à la page précédente
            </button>
            {vetCenter ? (
                <div>
                    <h1>{vetCenter.name}</h1>
                    <Link href={`/centres-veterinaires/${vetCenter.id}/edit`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Modifier</button>
                    </Link>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Supprimer
            </button>
            <Link href={`/map?vetCenterId=${id}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700">
                    Voir sur la carte
                </button>
            </Link>
                </div>
                
            ) : (
                <p>Centre vétérinaire introuvable</p>
            )}


        </div>
    )
}