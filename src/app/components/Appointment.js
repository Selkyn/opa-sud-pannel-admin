import React, { useState, useEffect } from "react";
import axios from "axios";
import DateTimeForm from "./DateTimeForm";

export default function Appointment({
    patients,
    vetCenters,
    osteoCenters,
    initialData = {},
    onClose,
    participantIdFromParams = null, // ID défini via params (si fourni)
    participantTypeFromParams = null, // Type défini via params (si fourni)
    fetchAllEvents,
    edit = false,
    fetchEntity
  }) {
    const [formData, setFormData] = useState({
      // id: initialData.eventId || null,
      participantId: participantIdFromParams || initialData.participantId || "", // ID du participant (via params ou sélection)
      participantType: participantTypeFromParams || initialData.participantType ||"", // Type du participant (via params ou sélection)
      start_time: initialData.start_time || "",
      start_time_hour: initialData.start_time_hour || "",
      end_time: initialData.end_time || "",
      end_time_hour: initialData.end_time_hour || "",
      infos: "",
      reasonAppointmentId: initialData.reasonAppointmentId ||"",
      statusAppointmentId: initialData.statusAppointmentId || "",
    });

  const [reasonAppointments, setReasonAppointments] = useState([]);
  const [statusAppointments, setStatusAppointments] = useState([]);
  
  useEffect(() => {
    console.log("Données initialisées dans formData :", formData);
  }, [formData]);
  
  // useEffect(() => {
  //   console.log("Form Data après initialisation :", formData); // Log après mise à jour
  // }, [formData]);

  useEffect(() => {
    const fetchReasonAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/appointments/reasons");
        setReasonAppointments(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des raisons");
      }
    };
    fetchReasonAppointments();
  }, []);

  const fetchStatusAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:4000/appointments/status");
      setStatusAppointments(response.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des status des rdv");
    }
  }

  useEffect(() => {
    fetchStatusAppointments()
  }, [])

  const resetForm = () => {
    setFormData({
      participantId: participantIdFromParams || "",
      participantType: participantTypeFromParams || "",
      start_time: initialData.start_time || "",
      start_time_hour: initialData.start_time_hour || "",
      end_time: "",
      end_time_hour: "",
      infos: "",
      reasonAppointmentId: "",
      statusAppointmentId: 1,
    });
  };

  const handleChange = (name, value) => {
    setFormData((prevData) => {
      // Si la date de début est modifiée, synchronisez également la date de fin
      if (name === "start_time") {
        return {
          ...prevData,
          [name]: value,
          end_time: value, // Synchronise la date de fin avec la date de début
        };
      }
  
      // Sinon, mettez à jour uniquement le champ ciblé
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullDateTimeStart = `${formData.start_time}T${formData.start_time_hour}:00`;
    const fullDateTimeEnd = `${formData.end_time}T${formData.end_time_hour}:00`;

    try {
      if (edit) {
        // Mode édition : mise à jour du rendez-vous
        await axios.put(`http://localhost:4000/appointments/${initialData.id}/edit`, {
          ...formData,
          start_time: fullDateTimeStart,
          end_time: fullDateTimeEnd,
        });
        alert("Rendez-vous mis à jour !");
      } else {
        // Mode création : ajout d'un nouveau rendez-vous
        await axios.post("http://localhost:4000/appointments/add", {
          ...formData,
          statusAppointmentId: 1,
          start_time: fullDateTimeStart,
          end_time: fullDateTimeEnd,
        });
        alert("Rendez-vous pris !");
      }
      resetForm();
      if(!participantIdFromParams) {
        fetchAllEvents()
      } else {
        fetchEntity()
      }

      
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error("Erreur lors de la prise du RDV: ", error);
      alert("Erreur lors de la prise du RDV");
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-8">
      {/* <h4 className="text-xl font-semibold text-gray-900 mb-6">Prendre un rendez-vous</h4> */}
      <DateTimeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        additionalFields={
          <>
            <div>
              <label htmlFor="infos" className="block text-sm font-medium text-gray-700">
                Infos
              </label>
              <input
                type="text"
                name="infos"
                id="infos"
                value={formData.infos}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="reasonAppointmentId"
                className="block text-sm font-medium text-gray-700"
              >
                Sélectionnez une raison
              </label>
              <select
                name="reasonAppointmentId"
                id="reasonAppointmentId"
                value={formData.reasonAppointmentId || ""}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez une raison</option>
                {reasonAppointments.map((reasonAppointment) => (
                  <option key={reasonAppointment.id} value={reasonAppointment.id}>
                    {reasonAppointment.name}
                  </option>
                ))}
              </select>
            </div>
            {edit && (
              <div>
              <label
                htmlFor="statusAppointmentId"
                className="block text-sm font-medium text-gray-700"
              >
                Sélectionnez un status
              </label>
              <select
                name="statusAppointmentId"
                id="statusAppointmentId"
                value={formData.statusAppointmentId || ""}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez un status</option>
                {statusAppointments.map((statusAppointment) => (
                  <option key={statusAppointment.id} value={statusAppointment.id}>
                    {statusAppointment.name}
                  </option>
                ))}
              </select>
            </div>
            )}

            {/* Si participantIdFromParams est défini, pas besoin de liste */}
            {!participantIdFromParams && (
              <>
                {/* Sélection du type de participant */}
                <div>
                  <label
                    htmlFor="participantType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Avec qui prenez-vous le rendez-vous ?
                  </label>
                  <select
                    name="participantType"
                    id="participantType"
                    value={formData.participantType || ""}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="patient">Patient</option>
                    <option value="vetCenter">Centre vétérinaire</option>
                    <option value="osteoCenter">Centre ostéopathique</option>
                  </select>
                </div>

                {/* Liste dynamique basée sur le type sélectionné */}
                {formData.participantType === "patient" && (
                  <div>
                    <label
                      htmlFor="participantId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sélectionnez un patient
                    </label>
                    <select
                      name="participantId"
                      id="participantId"
                      value={formData.participantId || ""}
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

                {formData.participantType === "vetCenter" && (
                  <div>
                    <label
                      htmlFor="participantId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sélectionnez un centre vétérinaire
                    </label>
                    <select
                      name="participantId"
                      id="participantId"
                      value={formData.participantId}
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionnez un centre vétérinaire</option>
                      {vetCenters.map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.name} ({center.city})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.participantType === "osteoCenter" && (
                  <div>
                    <label
                      htmlFor="participantId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sélectionnez un centre ostéopathique
                    </label>
                    <select
                      name="participantId"
                      id="participantId"
                      value={formData.participantId}
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionnez un centre ostéopathique</option>
                      {osteoCenters.map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.name} ({center.city})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </>
        }
        
        submitButtonLabel={edit ? "Modifier RDV" : "Prendre RDV"} 
      />
    </section>
  );
}
