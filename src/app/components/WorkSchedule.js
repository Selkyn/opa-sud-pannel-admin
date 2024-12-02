import React, { useState, useEffect } from "react";
import axios from "axios";
import DateTimeForm from "./DateTimeForm";

export default function Workschedule({ patientIdFromParams, patients = [], initialData = {}, onClose, fetchAllEvents }) {
  const [formData, setFormData] = useState({
    patientId: patientIdFromParams || "",
    custom_task_name: "",
    taskId: "",
    start_time: initialData.start_time || "",
    start_time_hour: initialData.start_time_hour || "",
    end_time: "",
    end_time_hour: "",
  });

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/work-schedules/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches");
      }
    };
    fetchTasks();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullDateTimeStart = `${formData.start_time}T${formData.start_time_hour}:00`;
    const fullDateTimeEnd = `${formData.end_time}T${formData.end_time_hour}:00`;

    try {
      await axios.post("http://localhost:4000/work-schedules/add", {
        ...formData,
        start_time: fullDateTimeStart,
        end_time: fullDateTimeEnd,
      });
      fetchAllEvents()
      alert("Tâche ajoutée au planning !");
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une tâche de travail: ", error);
      alert("Erreur lors de l'ajout d'une tâche de travail");
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-8">
      <h4 className="text-xl font-semibold text-gray-900 mb-6">Tâche de travail</h4>
      {!patientIdFromParams && (
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
            Sélectionnez un patient
          </label>
          <select
            name="patientId"
            id="patientId"
            value={formData.patientId}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez un patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} - {patient.client.firstname} {patient.client.lastname} ({patient.client.city})
              </option>
            ))}
          </select>
        </div>
      )}
      <DateTimeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        additionalFields={
          <div>
            <label htmlFor="taskId" className="block text-sm font-medium text-gray-700">
              Sélectionnez une tâche
            </label>
            <select
              name="taskId"
              id="taskId"
              value={formData.taskId}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez une tâche</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>
        }
        
        submitButtonLabel="Ajouter une tâche"
      />
    </section>
  );
}