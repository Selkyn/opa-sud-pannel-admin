// src/app/centres-veterinaires/[id]/page.js

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import CenterCard from "@/app/components/CenterCard";
import Appointment from "@/app/components/Appointment";

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
        <>
            {vetCenter && (
                <CenterCard
                    handleDelete={handleDelete}
                    editLink={`/centres-veterinaires/${vetCenter.id}/edit`}
                    mapLink={`/map?vetCenterId=${id}`}
                    center={vetCenter}
                />
            )}
            <Appointment
                itemId={id}
                entityType="vetCenter"
            />
        </>
    )
}