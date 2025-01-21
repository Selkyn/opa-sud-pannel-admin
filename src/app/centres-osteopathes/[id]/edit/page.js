"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CenterForm from "@/app/components/CenterForm";
import api from '@/utils/apiCall';


export default function EditOsteoCenterForm({ params }) {
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = params;

    useEffect(() => {
        const fetchOsteoCenter = async () => {
            try {
                const response = await api.get(`/osteo-centers/${id}`);
                const osteoCenter = response.data;

                // Formatage des données pour le composant CenterForm
                setInitialData({
                    name: osteoCenter.name,
                    email: osteoCenter.email,
                    adress: osteoCenter.adress,
                    city: osteoCenter.city,
                    postal: osteoCenter.postal,
                    department: osteoCenter.department,
                    phone: osteoCenter.phone,
                    infos: osteoCenter.infos,
                    staff: osteoCenter.osteos.map(osteo => ({
                        id: osteo.id,
                        firstname: osteo.firstname,
                        lastname: osteo.lastname,
                        email: osteo.email,
                        phone: osteo.phone
                    }))
                });
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOsteoCenter();
    }, [id]);

    const handleSubmit = async (data) => {
        try {
            await api.put(`/osteo-centers/${id}/edit`, {
                ...data,
                osteos: data.staff // Renommez 'staff' en 'osteos' pour correspondre à l'API
            });
            alert("Centre ostéopathique mis à jour avec succès !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            alert("Erreur lors de la mise à jour.");
        }
    };

    if (loading) {
        return <div>Chargement des données...</div>;
    }

    return (
        <CenterForm
            centerType="ostéopathique"
            staffLabel="Ostéopathe"
            initialData={initialData}
            enableSubmitBtn={true}
            onSubmit={handleSubmit}
            isEditing= {true}
        />
    );
}
