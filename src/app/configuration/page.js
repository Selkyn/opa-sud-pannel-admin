"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/apiCall";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfigurationSection from "../components/ConfigurationSection";

export default function Configuration() {
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [statusPatients, setStatusPatients] = useState([]);
  const [appointmentReasons, setAppointmentReasons] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [races, setRaces] = useState([]);

  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); // ✅ Stocke l'ID de la tâche en mode édition
  const [editedTaskName, setEditedTaskName] = useState(""); // ✅ Stocke le nom modifié

  //   useEffect(() => {
  //     fetchTasks();
  //   }, []);

  //   const fetchTasks = async () => {
  //     try {
  //       const response = await api.get("/tasks");
  //       console.log(response.data);
  //       setTasks(response.data);
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération des taches");
  //     }
  //   };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log(animalTypes.races);
  const fetchData = async () => {
    const [
      tasks,
      appointments,
      paymentModes,
      paymentTypes,
      paymentStatus,
      statusPatients,
      appointmentReasons,
      appointmentStatus,
      contacts,
      animalTypes,
      races,
    ] = await Promise.all([
      api.get("/tasks"),
      api.get("/appointments"),
      api.get("/paymentModes"),
      api.get("/paymentTypes"),
      api.get("/paymentStatus"),
      api.get("/statusPatients"),
      api.get("/appointmentReasons"),
      api.get("/appointmentStatus"),
      api.get("/contacts"),
      api.get("/animalTypes"),
      api.get("/races"),
    ]);

    setTasks(tasks.data);
    setAppointments(appointments.data);
    setPaymentModes(paymentModes.data);
    setPaymentTypes(paymentTypes.data);
    setPaymentStatus(paymentStatus.data);
    setStatusPatients(statusPatients.data);
    setAppointmentReasons(appointmentReasons.data);
    setAppointmentStatus(appointmentStatus.data);
    setContacts(contacts.data);
    setAnimalTypes(animalTypes.data);
    setRaces(races.data);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Accordion type="single" collapsible>
        <AccordionItem value="Taches">
          <AccordionTrigger className="font-bold text-lg">
            Tâches / planning
          </AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              category={"tasks"}
              items={tasks}
              fetchData={fetchData}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="reason-appointent">
          <AccordionTrigger className="font-bold text-lg">
            Raisons des rendez-vous
          </AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              category={"appointmentReasons"}
              items={appointmentReasons}
              fetchData={fetchData}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="status-appointent">
          <AccordionTrigger className="font-bold text-lg">
            Status des rendez-vous
          </AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              category={"appointmentStatus"}
              items={appointmentStatus}
              fetchData={fetchData}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="status-animal">
          <AccordionTrigger className="font-bold text-lg">
            Travail en cours, status patient
          </AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              category={"statusPatients"}
              items={statusPatients}
              fetchData={fetchData}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact-partner">
          <AccordionTrigger className="font-bold text-lg">
            Contacts partenaires
          </AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              category={"contacts"}
              items={contacts}
              fetchData={fetchData}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="animal-type">
          <AccordionTrigger className="font-bold text-lg">
            Espèces
          </AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              category={"animalTypes"}
              items={animalTypes}
              fetchData={fetchData}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="races">
          <AccordionTrigger className="font-bold text-lg">
            Races
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {animalTypes.map((animalType) => (
                <li key={animalType.id}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="races">
                      <AccordionTrigger className="font-bold ml-8">
                        - {animalType.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-10 p-2 border-2">
                          <ConfigurationSection
                            category={"races"}
                            items={races.filter(
                              (race) => race.animalTypeId === animalType.id
                            )} // ✅ Filtrage des races ici
                            fetchData={fetchData}
                            animalTypeId={animalType.id}
                            race={true}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="status-payment">
          <AccordionTrigger className="font-bold text-lg">
            Status de paiement
          </AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              category={"paymentStatus"}
              items={paymentStatus}
              fetchData={fetchData}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type-payment">
          <AccordionTrigger className="font-bold text-lg">
            Types de paiement
          </AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              category={"paymentTypes"}
              items={paymentTypes}
              fetchData={fetchData}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mode-payment">
          <AccordionTrigger className="font-bold text-lg">
            Modes de paiement
          </AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              category={"paymentModes"}
              items={paymentModes}
              fetchData={fetchData}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
