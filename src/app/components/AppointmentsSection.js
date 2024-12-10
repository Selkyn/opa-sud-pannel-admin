"use client";

import React, { useState } from "react";
import EventModalDetails from "./EventModalDetails"; // Le composant pour le modal
import Appointment from "./Appointment"; // Le formulaire de rendez-vous

export default function AppointmentsSection({
  entity,
  entityAppointments,
  participantTypeFromParams,
  fetchEntity
}) {
  const appointments = entity?.[entityAppointments] || [];
  const [selectedAppointment, setSelectedAppointment] = useState(null); // RDV sélectionné pour l'édition
  const [isEditModalOpen, setEditModalOpen] = useState(false); // État pour ouvrir/fermer le modal

  const handleEditClick = (appointment) => {
    const start = new Date(appointment.start_time);
    const end = new Date(appointment.end_time);
  
    setSelectedAppointment({
      id: appointment.id,
      start_time: start.toISOString().split("T")[0], // Date au format ISO
      start_time_hour: start.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Format 24 heures
      }),
      end_time: end.toISOString().split("T")[0],
      end_time_hour: end.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      reasonAppointmentId: appointment.reasonAppointment?.id || "",
      statusAppointmentId: appointment.statusAppointment?.id || "",
      infos: appointment.infos || "",
    });
  
    setEditModalOpen(true); // Ouvre le modal
  };

  const closeEditModal = () => {
    setSelectedAppointment(null); // Réinitialise le rendez-vous sélectionné
    setEditModalOpen(false); // Ferme le modal
  };

  return (
    <>
      <h3>Rendez-vous</h3>
      <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
        <thead className="bg-green-500 text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Date et Heure
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Raison
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Statut
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(appointment.start_time).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}{" "}
                  -{" "}
                  {new Date(appointment.start_time).toLocaleTimeString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}{" "}
                  -{" "}
                  {new Date(appointment.end_time).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.reasonAppointment?.name || "Non spécifié"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.statusAppointment?.name || "Non spécifié"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEditClick(appointment)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
              >
                Aucun rendez-vous trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal pour modifier un rendez-vous */}
      <EventModalDetails
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Modifier le Rendez-vous"
      >
        {selectedAppointment && (
          <Appointment
            initialData={selectedAppointment} // Passe les données du RDV sélectionné
            participantIdFromParams={entity.id} // ID du participant
            participantTypeFromParams={participantTypeFromParams} // Type (par exemple, "patient")
            onClose={closeEditModal} // Ferme le modal après soumission
            fetchEntity={fetchEntity}
            edit={true}
          />
        )}
      </EventModalDetails>
    </>
  );
}
