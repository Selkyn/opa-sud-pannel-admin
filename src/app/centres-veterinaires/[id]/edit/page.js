"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CenterForm from "@/app/components/CenterForm";
import api from '@/utils/apiCall';
import { useRouter } from "next/navigation";



export default function EditVetCenterForm({ params }) {
    const [initialData, setInitialData] = useState(null);
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = params;

    const router = useRouter();

    useEffect(() => {
        const fetchSpecialities = async () => {
            try {
                const response = await api.get("/specialities");
                setSpecialities(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des spécialités")
            }
        }
        fetchSpecialities();
    }, [])

    useEffect(() => {
        const fetchVetCenter = async () => {
            try {
                const response = await api.get(`/vet-centers/${id}`);
                const vetCenter = response.data;

                // Formatage des données pour le composant CenterForm
                setInitialData({
                    name: vetCenter.name,
                    email: vetCenter.email,
                    adress: vetCenter.adress,
                    city: vetCenter.city,
                    postal: vetCenter.postal,
                    department: vetCenter.department,
                    phone: vetCenter.phone,
                    infos: vetCenter.infos,
                    staff: vetCenter.vets.map(vet => ({
                        id: vet.id,
                        firstname: vet.firstname,
                        lastname: vet.lastname,
                        email: vet.email,
                        phone: vet.phone
                    }))
                });
                setSelectedSpecialities(vetCenter.Specialities ? vetCenter.Specialities.map(speciality => speciality.id) : [])
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVetCenter();
    }, [id]);

    const handleSubmit = async (data) => {
        try {
            await api.put(`/vet-centers/${id}/edit`, {
                ...data,
                vets: data.staff, // Renommez 'staff' en 'vets' pour correspondre à l'API
                specialities: selectedSpecialities 
            });
            alert("Centre vétérinaire mis à jour avec succès !");
            router.push(`/centres-veterinaires/${id}`)
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
            centerType="vétérinaire"
            staffLabel="Vétérinaire"
            initialData={initialData}
            enableSubmitBtn={true}
            onSubmit={handleSubmit}
            isEditing= {true}
            specialities={specialities}
            selectedSpecialities={selectedSpecialities}
            setSelectedSpecialities={setSelectedSpecialities}
        />
    );
}
