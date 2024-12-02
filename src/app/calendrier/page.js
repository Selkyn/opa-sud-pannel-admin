"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";
import axios from "axios";
import EventModal from "../components/EventModal";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchAllEvents();
  }, [])

  const fetchAllEvents = async () => {
    try {
      // Récupérer les rendez-vous
      const appointmentsResponse = await axios.get("http://localhost:4000/appointments");
      const formattedAppointments = appointmentsResponse.data?.map((appointment) => ({
        id: appointment.id,
        title: appointment.title || "Rendez-vous",
        start: appointment.start,
        end: appointment.end,
        eventType: appointment.eventType,
        extendedProps: appointment.extendedProps || {},
      })) || [];

      // Récupérer les plannings de travail
      const workScheduleResponse = await axios.get("http://localhost:4000/work-schedules");
      const formattedWorkSchedules = workScheduleResponse.data?.map((workSchedule) => ({
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

  // useEffect(() => {
  //   const fetchAllEvents = async () => {
  //     try {
  //       // Récupérer les rendez-vous
  //       const appointmentsResponse = await axios.get("http://localhost:4000/appointments");
  //       const formattedAppointments = appointmentsResponse.data?.map((appointment) => ({
  //         id: appointment.id,
  //         title: appointment.title || "Rendez-vous",
  //         start: appointment.start,
  //         end: appointment.end,
  //         eventType: appointment.eventType,
  //         extendedProps: appointment.extendedProps || {},
  //       })) || [];
  
  //       // Récupérer les plannings de travail
  //       const workScheduleResponse = await axios.get("http://localhost:4000/work-schedules");
  //       const formattedWorkSchedules = workScheduleResponse.data?.map((workSchedule) => ({
  //         id: workSchedule.id,
  //         title: workSchedule.title || "Planning de travail",
  //         start: workSchedule.start,
  //         end: workSchedule.end,
  //         eventType: workSchedule.eventType,
  //         extendedProps: workSchedule.extendedProps || {},
  //       })) || [];
  
  //       // Combiner les deux types d'événements
  //       setCalendarEvents([...formattedAppointments, ...formattedWorkSchedules]);
  //     } catch (error) {
  //       console.error("Erreur lors du chargement des événements :", error);
  //     }
  //   };
  
  //   fetchAllEvents();
  // }, []);
  

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:4000/appointments");
  //       const formattedEvents = response.data.map((event) => ({
  //         title: event.title,
  //         start: event.start,
  //         end: event.end,
  //         extendedProps: event.extendedProps,
  //       }));
  //       setEvents(formattedEvents);
  //     } catch (error) {
  //       console.error("Erreur lors du chargement des événements :", error);
  //     }
  //   };

  //   fetchEvents();
  // }, []);

  // useEffect(() => {
  //   const fetchWorkschedules = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:4000/work-schedules");
  //       const formattedWorkSchedules = response.data.map((workSchedule) => ({
  //         title: workSchedule.title,
  //         start: workSchedule.start,
  //         end: workSchedule.end,
  //         extendedProps: workSchedule.extendedProps,
  //       }));
  //       setWorkSchedules(formattedWorkSchedules);
  //     } catch (error) {
  //       console.error("Erreur lors du chargement des événements :", error);
  //     }
  //   };

  //   fetchWorkschedules();
  // }, []);

  const handleDateClick = (info) => {
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

    fetchAllEvents()

  
    // Recharger les événements depuis le backend
      
  
      alert("Événement supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement :", error);
      alert("Erreur lors de la suppression de l'événement.");
    }
  };


  // Fonction de rendu des événements
  const renderEventContent = (eventInfo) => {
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
    <div className="text-base font-bold text-gray-900">{eventInfo.event.title}</div>
    <div className="text-xs text-gray-500 italic">{eventInfo.event.extendedProps.entityType}</div>
    <div className="text-sm text-gray-700">{eventInfo.event.extendedProps.entityName}</div>
  </div>
    <div className="flex flex-col ml-6 gap-1">
      <button
        onClick={() => alert(`Modifier : ${eventInfo.event.title}`)}
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
      />
    )}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={calendarEvents}
          eventContent={renderEventContent}
          // eventClick={handleEventClick}
          locale="fr"
          locales={[frLocale]}
          timeZone="Europe/Paris"
          height="auto"
          dateClick={handleDateClick}
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
