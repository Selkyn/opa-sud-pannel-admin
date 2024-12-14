"use client";
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Workschedule from './WorkSchedule';
import Appointment from './Appointment';


export default function EventModal({ onClose, selectedDate, fetchAllEvents, patients, vetCenters, osteoCenters }) {
    
    // const [patients, setPatients] = useState([]);
    // const [vetCenters, setVetCenters] = useState([]);
    // const [osteoCenters, setOsteoCenters] = useState([]);
    const [eventType, setEventType] = useState();
    // const [start, setStart] = useState(
    //     selectedDate ? new Date(selectedDate).toISOString().slice(0, 16) : ""
    //   ); // Préremplir avec la date cliquée, formatée pour <input type="datetime-local">
    //   const [end, setEnd] = useState("");

    //   const [tasks, setTasks] = useState([]);
    //   const [selectedTaskId, setSelectedTaskId] = useState("");

    //   useEffect(() => {
    //     const fetchTasks = async () => {
    //       try {
    //         const response = await axios.get("http://localhost:4000/work-schedules/tasks");
    //         setTasks(response.data);
    //       } catch (error) {
    //         console.error("Erreur lors de la récupération des tâches");
    //       }
    //     };
    //     fetchTasks();
    //   }, []);
    // useEffect(() => {
    //     fetchPatients();
    //   }, []);

    //   useEffect(() => {
    //     fetchOsteoCenters();
    //     fetchVetCenters();
    //   }, [vetCenters, osteoCenters])

    //   const fetchPatients = async () => {
    //     try {
    //       const response = await axios.get("http://localhost:4000/patients");
    //       const sortedPatients = response.data.sort((a, b) =>
    //         a.name.localeCompare(b.name)
    //       );
    //       setPatients(sortedPatients);
    //     } catch (error) {
    //       console.error("Erreur lors de la récupération des patients");
    //     }
    //   };



    //   const fetchVetCenters = async () => {
    //     try {
    //       const response = await axios.get("http://localhost:4000/vet-centers");
    //       const sortedVetCenters = response.data.sort((a, b) =>
    //         a.name.localeCompare(b.name)
    //       );
    //       setVetCenters(sortedVetCenters);
    //     } catch (error) {
    //       console.error("Erreur lors de la récupération des centres vétérinaires");
    //     }
    //   };

    //   const fetchOsteoCenters = async () => {
    //     try {
    //       const response = await axios.get("http://localhost:4000/osteo-centers");
    //       const sortedOsteoCenters = response.data.sort((a, b) =>
    //         a.name.localeCompare(b.name)
    //       );
    //       setOsteoCenters(sortedOsteoCenters);
    //     } catch (error) {
    //       console.error("Erreur lors de la récupération des centres vétérinaires");
    //     }
    //   };

    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative z-60">
          <h3 className="text-lg font-bold mb-4">Ajouter un évènement</h3>
          <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'événement
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="appointment">Rendez-vous</option>
            <option value="workSchedule">Tâche de travail</option>
          </select>
        </div>

        {/* Formulaire conditionnel */}
        {eventType === "workSchedule" ? (
          <Workschedule
            patients={patients}
            initialData={{
              start_time: selectedDate ? selectedDate.split("T")[0] : "", // Date de début (YYYY-MM-DD)
              start_time_hour: selectedDate
                ? selectedDate.split("T")[1]?.slice(0, 5)
                : "", // Heure de début (HH:mm)
                end_time: selectedDate ? selectedDate.split("T")[0] : "", // Date de début (YYYY-MM-DD)
                end_time_hour: selectedDate
                  ? selectedDate.split("T")[1]?.slice(0, 5)
                  : "", // Heure de début (HH:mm)
            }}
            onClose={onClose}
            fetchAllEvents={fetchAllEvents}
          />
        ) : (
          <Appointment
            patients={patients}
            osteoCenters={osteoCenters}
            vetCenters={vetCenters}
            initialData={{
              start_time: selectedDate ? selectedDate.split("T")[0] : "", // Date de début (YYYY-MM-DD)
              start_time_hour: selectedDate
                ? selectedDate.split("T")[1]?.slice(0, 5)
                : "", // Heure de début (HH:mm)
                end_time: selectedDate ? selectedDate.split("T")[0] : "", // Date de début (YYYY-MM-DD)
                end_time_hour: selectedDate
                  ? selectedDate.split("T")[1]?.slice(0, 5)
                  : "", // Heure de début (HH:mm)
            }}
            onClose={onClose}
            fetchAllEvents={fetchAllEvents}
          />
        )}

            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
                Annuler
            </button>
        </div>
      </div>
    );
  }
  