"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import axios from "axios";
const events = [
    { title: 'Meeting', start: new Date() }
  ]

export default function CalendarPage () {
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const response = await axios.get("http://localhost:4000/appointments"); // Remplacez par votre URL API
            const formattedEvents = response.data.map((event) => ({
              title: event.title,
              start: event.start,
              end: event.end,
            }));
            setEvents(formattedEvents);
          } catch (error) {
            console.error("Erreur lors du chargement des événements :", error);
          }
        };
    
        fetchEvents();
      }, []);
    
      // Fonction de rendu des événements
      const renderEventContent = (eventInfo) => {
        return (
          <div>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
          </div>
        );
      };
        
    return (
        <div>
          <h1>Demo App</h1>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView='dayGridMonth'
            weekends={false}
            events={events}
            eventContent={renderEventContent}
          />
        </div>
      )
}