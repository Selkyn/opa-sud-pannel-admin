"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CenterCard from "@/app/components/CenterCard";
import Appointment from "@/app/components/Appointment";
import ToggleSection from "@/app/components/ToggleSection";
import AppointmentsSection from "@/app/components/AppointmentsSection";
import EventModalDetails from "@/app/components/EventModalDetails";
import api from '@/utils/apiCall';


export default function osteoCenterDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [osteoCenter, setOsteoCenter] = useState(null);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOsteoCenterDetails();
    }
  }, [id]);

  const fetchOsteoCenterDetails = async () => {
    try {
      const response = await api.get(
        `/osteo-centers/${id}`
      );
      setOsteoCenter(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du centre ostéopathe"
      );
    }
  };

  const handleDelete = async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${osteoCenter.name} ?`)) {
      try {
        await api.delete(
          `/osteo-centers/${osteoCenter.id}/delete`
        );
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
      <AppointmentsSection
        entity={osteoCenter}
        entityAppointments={"osteoCenterAppointments"}
        participantTypeFromParams="osteoCenter"
        fetchEntity={fetchOsteoCenterDetails}
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
          participantTypeFromParams="osteoCenter"
          fetchEntity={fetchOsteoCenterDetails}
        />
      </EventModalDetails>
    </>
  );
}
