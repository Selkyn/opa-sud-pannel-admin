"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";
import axios from "axios";
import EventModal from "../components/EventModal";

import EventModalDetails from "@/app/components/EventModalDetails";
import Appointment from "../components/Appointment";
import Workschedule from "../components/WorkSchedule";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [isWorkScheduleModalOpen, setWorkScheduleModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [vetCenters, setVetCenters] = useState([]);
  const [osteoCenters, setOsteoCenters] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventType, setEventType] = useState();

  const router = useRouter();

  useEffect(() => {
    if (isAppointmentModalOpen || isModalOpen) {
      fetchPatients();
      fetchOsteoCenters();
      fetchVetCenters();
    }
  }, [isAppointmentModalOpen, isModalOpen]);

  useEffect(() => {
    if (isWorkScheduleModalOpen) {
      fetchPatients();
    }
  }, [isWorkScheduleModalOpen]);

  // useEffect(() => {
  //   fetchOsteoCenters();
  //   fetchVetCenters();
  // }, [vetCenters, osteoCenters]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:4000/patients");
      const sortedPatients = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setPatients(sortedPatients);
    } catch (error) {
      console.error("Erreur lors de la récupération des patients");
    }
  };

  const fetchVetCenters = async () => {
    try {
      const response = await axios.get("http://localhost:4000/vet-centers");
      const sortedVetCenters = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setVetCenters(sortedVetCenters);
    } catch (error) {
      console.error("Erreur lors de la récupération des centres vétérinaires");
    }
  };

  const fetchOsteoCenters = async () => {
    try {
      const response = await axios.get("http://localhost:4000/osteo-centers");
      const sortedOsteoCenters = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setOsteoCenters(sortedOsteoCenters);
    } catch (error) {
      console.error("Erreur lors de la récupération des centres vétérinaires");
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      // Récupérer les rendez-vous
      const appointmentsResponse = await axios.get(
        "http://localhost:4000/appointments"
      );
      const formattedAppointments =
        appointmentsResponse.data?.map((appointment) => {
          const extendedProps = appointment.extendedProps || {};

          return {
            id: appointment.id,
            title: appointment.title || "Rendez-vous",
            start: appointment.start,
            end: appointment.end,
            eventType: appointment.eventType,
            extendedProps: {
              patientId: extendedProps.patientId || null,
              vetCenterId: extendedProps.vetCenterId || null,
              osteoCenterId: extendedProps.osteoCenterId || null,
              participantType: extendedProps.entityType || "",
              participantId:
                extendedProps.patientId ||
                extendedProps.vetCenterId ||
                extendedProps.osteoCenterId ||
                null,
              reasonAppointmentId: extendedProps.reasonAppointmentId || null,
              statusAppointmentId: extendedProps.statusAppointmentId || null,
              infos: extendedProps.infos || "",
              entityName: extendedProps.entityName || "",
              entityUrl: extendedProps.entityUrl || "#",
              status: extendedProps.status || "",
            },
          };
        }) || [];
      // console.log("Rendez-vous formatés :", formattedAppointments);

      // Récupérer les plannings de travail
      const workScheduleResponse = await axios.get(
        "http://localhost:4000/work-schedules"
      );
      const formattedWorkSchedules =
        workScheduleResponse.data?.map((workSchedule) => ({
          id: workSchedule.id,
          title: workSchedule.title || "Planning de travail",
          start: workSchedule.start,
          end: workSchedule.end,
          eventType: workSchedule.eventType,
          extendedProps: workSchedule.extendedProps || {},
        })) || [];

      // Combiner les deux types d'événements
      setCalendarEvents([...formattedAppointments, ...formattedWorkSchedules]);
    } catch (error) {
      console.error("Erreur lors du chargement des événements :", error);
    }
  };

  const handleEditClick = (eventInfo) => {
    const eventId = eventInfo.event.id;
    const eventType = eventInfo.event.extendedProps.eventType;

      const selectedAppointment = calendarEvents.find(
      (event) => String(event.id) === String(eventId)
    );

    const selectedWorkSchedule = calendarEvents.find(
      (event) => String(event.id) === String(eventId)
    );

    console.log("Événement trouvé pour édition :", selectedAppointment);

    if (selectedAppointment && eventType === "appointment") {
      // console.log(
      //   "Données étendues de l'événement :",
      //   selectedAppointment.extendedProps
      // );
      setSelectedEvent(selectedAppointment);
      setAppointmentModalOpen(true);
    } else if (selectedWorkSchedule && eventType === "workSchedule") {
      setSelectedEvent(selectedWorkSchedule);
      setWorkScheduleModalOpen(true);
    } else {
      console.error("Aucun événement correspondant trouvé !");
    }
  };

  const handleDateClick = (info) => {
    console.log("Date reçue :", info.dateStr);
    setSelectedDate(info.dateStr); // Récupère la date cliquée
    setIsModalOpen(true); // Ouvre le modal
  };

  const handleDeleteClick = async (eventInfo) => {
    const eventId = eventInfo.event.id; // ID unique de l'événement
    const eventType = eventInfo.event.extendedProps.eventType; // Récupérer le type d'événement depuis extendedProps

    try {
      // Construire l'URL en fonction du type d'événement
      const url =
        eventType === "workSchedule"
          ? `http://localhost:4000/work-schedules/${eventId}/delete`
          : `http://localhost:4000/appointments/${eventId}/delete`;

      await axios.delete(url);

      fetchAllEvents();

      alert("Événement supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement :", error);
      alert("Erreur lors de la suppression de l'événement.");
    }
  };

  const renderDayCell = (dayCellInfo) => {
    const handleAddClick = () => {
      const dateStr = dayCellInfo.date.toISOString().split("T")[0]; // Formate la date
      setSelectedDate(dateStr); // Définit la date sélectionnée
      setIsModalOpen(true); // Ouvre le modal
      // setAppointmentModalOpen(true);
    };

    return (
      <div className="flex flex-col h-full">
        <div>{dayCellInfo.dayNumberText}</div> {/* Affiche le numéro du jour */}
        <button
          onClick={handleAddClick} // Utilise la fonction corrigée
          className="bg-blue-500 text-white text-xs py-1 px-2 rounded mt-2"
        >
          +
        </button>
      </div>
    );
  };

  // Fonction de rendu des événements
  const renderEventContent = (eventInfo) => {
    const isAppointment =
      eventInfo.event.extendedProps.eventType === "appointment";
    const isWorkSchedule =
      eventInfo.event.extendedProps.eventType === "workSchedule";
    const handleDetailsClick = () => {
      const entityUrl = eventInfo.event.extendedProps.entityUrl;
      if (entityUrl) {
        router.push(entityUrl);
      } else {
        alert("Page de détail non disponible.");
      }
    };
    return (
      <div className="flex items-center justify-between bg-blue-100 p-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
        <div>
          <div className="text-sm font-semibold text-blue-700">
            {new Date(eventInfo.event.start).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(eventInfo.event.end).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-base font-bold text-gray-900">
            {eventInfo.event.title}
          </div>
          <div className="text-xs text-gray-500 italic">
            {eventInfo.event.extendedProps.entityType}
          </div>
          <div className="text-sm text-gray-700">
            {eventInfo.event.extendedProps.entityName}
          </div>
          <div className="text-xs text-gray-500 italic">
            {eventInfo.event.extendedProps.status}
          </div>
        </div>
        <div className="flex flex-col ml-6 gap-1">
          <button
            onClick={() => handleEditClick(eventInfo)}
            className="bg-green-500 text-white text-xs py-1 rounded-md hover:bg-green-600"
          >
            Modifier
          </button>
          <button
            onClick={() => handleDeleteClick(eventInfo)}
            className="bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600"
          >
            Supprimer
          </button>
          <button
            onClick={handleDetailsClick}
            className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-600"
          >
            Détails
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Mon calendrier</h1>
      {isModalOpen && (
        <EventModal
          onClose={() => setIsModalOpen(false)}
          // onEventAdded={fetchAllEvents}
          selectedDate={selectedDate}
          fetchAllEvents={fetchAllEvents}
          osteoCenters={osteoCenters}
          patients={patients}
          vetCenters={vetCenters}
        />
      )}

      <EventModalDetails
        isOpen={isAppointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        title={
          selectedEvent ? "Modifier le Rendez-vous" : "Prendre un Rendez-vous"
        }
      >
        <Appointment
          patients={patients}
          vetCenters={vetCenters}
          osteoCenters={osteoCenters}
          initialData={{
            id: selectedEvent?.id,
            start_time: selectedEvent?.start.split("T")[0],
            start_time_hour: selectedEvent?.start.split("T")[1]?.slice(0, 5),
            end_time: selectedEvent?.end.split("T")[0],
            end_time_hour: selectedEvent?.end.split("T")[1]?.slice(0, 5),
            infos: selectedEvent?.extendedProps?.infos || "",
            reasonAppointmentId:
              selectedEvent?.extendedProps?.reasonAppointmentId || "",
            statusAppointmentId:
              selectedEvent?.extendedProps?.statusAppointmentId || "",
            participantId:
              selectedEvent?.extendedProps?.patientId ||
              selectedEvent?.extendedProps?.vetCenterId ||
              selectedEvent?.extendedProps?.osteoCenterId ||
              "",
            participantType:
              selectedEvent?.extendedProps?.participantType || "",
          }}
          edit={!!selectedEvent}
          onClose={() => setAppointmentModalOpen(false)}
          fetchAllEvents={fetchAllEvents}
        />
      </EventModalDetails>

      <EventModalDetails
        isOpen={isWorkScheduleModalOpen}
        onClose={() => setWorkScheduleModalOpen(false)}
        title={selectedEvent ? "Modifier la tache" : "Ajouter une tache"}
      >
        <Workschedule
          patients={patients}
          initialData={{
            id: selectedEvent?.id,
            start_time: selectedEvent?.start,
            start_time_hour: selectedEvent?.start,
            end_time: selectedEvent?.end,
            end_time_hour: selectedEvent?.end,
            // infos: selectedEvent?.extendedProps?.infos || "",
            patientId: selectedEvent?.extendedProps?.patientId,
            taskId: selectedEvent?.extendedProps?.taskId,
          }}
          edit={!!selectedEvent}
          onClose={() => setAppointmentModalOpen(false)}
          fetchAllEvents={fetchAllEvents}
        />
      </EventModalDetails>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={calendarEvents}
          eventContent={renderEventContent}
          dayCellContent={renderDayCell}
          eventClassNames={(eventInfo) => {
            if (eventInfo.event.extendedProps.eventType === "appointment") {
              return ["bg-green-500", "text-white", "rounded-md", "p-1"];
            } else if (
              eventInfo.event.extendedProps.eventType === "workSchedule"
            ) {
              return ["bg-blue-500", "text-white", "rounded-md", "p-1"];
            }
            return ["bg-gray-300", "text-black", "rounded-md", "p-1"]; // Par défaut
          }}
          // eventClick={handleEventClick}
          // editable={true} // Active le drag and drop
          // eventDrop={handleEventDrop} // Gestionnaire pour déplacer un événement
          // eventResize={handleEventResize} // Gestionnaire pour redimensionner un événement
          locale="fr"
          locales={[frLocale]}
          timeZone="Europe/Paris"
          height="auto"
          // dateClick={handleDateClick}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,dayGridWeek",
          }}
        />
      </div>
    </div>
  );
}

// const handleEventDrop = async (info) => {
//   const updatedEvent = {
//     id: info.event.id,
//     start: info.event.start.toISOString(),
//     end: info.event.end ? info.event.end.toISOString() : null,
//   };

//   try {
//     const eventType = info.event.extendedProps.eventType;
//     const url =
//       eventType === "workSchedule"
//         ? `http://localhost:4000/work-schedules/${updatedEvent.id}/edit`
//         : `http://localhost:4000/appointments/${updatedEvent.id}/update`;

//     const response = await axios.put(url, updatedEvent);

//     // Utiliser les données enrichies du backend pour mettre à jour l'état
//     const updatedWorkSchedule = response.data.workSchedule;

//     setCalendarEvents((prevEvents) =>
//       prevEvents.map((event) =>
//         event.id === updatedEvent.id
//           ? { ...event, ...updatedWorkSchedule }
//           : event
//       )
//     );

//     alert("Événement mis à jour avec succès !");
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour de l'événement :", error);
//     alert("Erreur lors de la mise à jour de l'événement.");
//     info.revert(); // Revenir à l'état précédent en cas d'erreur
//   }
// };

// const handleEventResize = async (info) => {
//   const updatedEvent = {
//     id: info.event.id,
//     start: info.event.start.toISOString(),
//     end: info.event.end ? info.event.end.toISOString() : null,
//   };

//   try {
//     const url =
//       updatedEvent.eventType === "workSchedule"
//         ? `http://localhost:4000/work-schedules/${updatedEvent.id}/edit`
//         : `http://localhost:4000/appointments/${updatedEvent.id}/edit`;

//     await axios.put(url, updatedEvent);

//     const updatedEvents = calendarEvents.map((event) =>
//       event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
//     );
//     setCalendarEvents(updatedEvents);

//     alert("Durée de l'événement mise à jour !");
//   } catch (error) {
//     console.error(
//       "Erreur lors de la mise à jour de la durée de l'événement :",
//       error
//     );
//     alert("Erreur lors de la mise à jour de la durée.");
//     info.revert(); // Revenir à l'état précédent en cas d'erreur
//   }
// };
