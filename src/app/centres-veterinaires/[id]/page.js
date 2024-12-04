// src/app/centres-veterinaires/[id]/page.js

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import CenterCard from "@/app/components/CenterCard";
import Appointment from "@/app/components/Appointment";
import ToggleSection from "@/app/components/ToggleSection";
import AppointmentsSection from "@/app/components/AppointmentsSection";
import EventModalDetails from "@/app/components/EventModalDetails";

export default function vetCenterDetailsPage({ params }) {
    const { id } = params;
    const router = useRouter();

    const [vetCenter, setvetCenter] = useState(null);
    const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);

    useEffect(() => {
        if(id) {
            fetchVetCenterDetails();
        }
    }, [id]);

    const fetchVetCenterDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/vet-centers/${id}`)
            setvetCenter(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du centre vétérinaire");
        }
    };

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

            <AppointmentsSection
                    entity={vetCenter}
                    entityAppointments={"vetCenterAppointments"}
                    participantTypeFromParams="vetCenter"
                    fetchEntity={fetchVetCenterDetails}
            />

            <div className="flex space-x-4 mt-6">
                <button
                onClick={() => setAppointmentModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                Ajouter un Rendez-vous
                </button>
            </div>


            <EventModalDetails
                isOpen={isAppointmentModalOpen}
                onClose={() => setAppointmentModalOpen(false)}
                title="Prendre un Rendez-vous"
            >
                <Appointment
                    participantIdFromParams={id}
                    participantTypeFromParams="vetCenter"
                    fetchEntity={fetchVetCenterDetails}
                />
          </EventModalDetails>
        </>
    )
}