"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import CenterCard from "@/app/components/CenterCard";
import Appointment from "@/app/components/Appointment";

export default function osteoCenterDetailsPage({ params }) {
    const { id } = params;
    const router = useRouter();

    const [osteoCenter, setOsteoCenter] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchOsteoCenterDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:4000/osteo-centers/${id}`);
                    setOsteoCenter(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des détails du centre ostéopathe");
                }
            };
            fetchOsteoCenterDetails();
        }
    }, [id]);

    const handleDelete = async () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${osteoCenter.name} ?`)) {
            try {
                await axios.delete(`http://localhost:4000/osteo-centers/${osteoCenter.id}/delete`);
                router.push("/centres-osteopathes");
            } catch (error) {
                console.error("Erreur lors de la suppression du centre :", error);
            }
        }
    };

    return (
        <>
            {osteoCenter && (
                <CenterCard
                    handleDelete={handleDelete}
                    editLink={`/centres-osteopathes/${osteoCenter.id}/edit`}
                    mapLink={`/map?osteoCenterId=${id}`}
                    center={osteoCenter}
                />
            )}

            <Appointment
                itemId={id}
                entityType="osteoCenter"
            />
        </>
    );
}
