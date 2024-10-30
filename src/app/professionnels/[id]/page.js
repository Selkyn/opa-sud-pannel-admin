// src/app/professionnels/[id]/page.js

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function ProfessionalDetailsPage({ params }) {
    const { id } = params;
    const router = useRouter();

    const [professional, setProfessional] = useState(null);

    useEffect(() => {
        if(id) {
            const fetchProfessionalDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:4000/professionals/${id}`)
                    setProfessional(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des détails du centre vétérinaire");
                }
            };
            fetchProfessionalDetails();
        }
    }, [id]);

    const handleDelete = async () => {
        if (confirm(`Etes-vous sûr de vouloir supprimer ${professional.name} ?`)) {
          try {
            await axios.delete(`http://localhost:4000/professionals/${professional.id}/delete`);
      
            router.push("/professionnels");
      
          } catch (error) {
            console.error("Erreur lors de la suppression du professional :", error);
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
            {professional ? (
                <div>
                    <h1>{professional.name}</h1>
                    <Link href={`/professionnels/${professional.id}/edit`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Modifier</button>
                    </Link>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Supprimer
            </button>
            <Link href={`/map?professionnelId=${id}`}>
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