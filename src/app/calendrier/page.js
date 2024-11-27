"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/appointments");
        const formattedEvents = response.data.map((event) => ({
          title: event.title,
          start: event.start,
          end: event.end,
          extendedProps: event.extendedProps,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des événements :", error);
      }
    };

    fetchEvents();
  }, []);

  // Gestion du clic sur un événement
  const handleEventClick = (clickInfo) => {
    const entityUrl = clickInfo.event.extendedProps.entityUrl;
    if (entityUrl) {
      router.push(entityUrl);
    } else {
      alert("Page de détail non disponible.");
    }
  };

  // Fonction de rendu des événements
  const renderEventContent = (eventInfo) => {
    return (
      <div className="bg-blue-100 p-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="text-sm font-semibold text-blue-700">{eventInfo.timeText}</div>
        <div className="text-base font-bold text-gray-900">{eventInfo.event.title}</div>
        <div className="text-xs text-gray-500 italic">{eventInfo.event.extendedProps.entityType}</div>
        <div className="text-sm text-gray-700">{eventInfo.event.extendedProps.entityName}</div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Mon calendrier</h1>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          locale="fr"
          locales={[frLocale]}
          timeZone="Europe/Paris"
          height="auto"
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
