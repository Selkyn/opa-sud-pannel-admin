"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Appointment({
    itemId,
    entityType
}) {
    const [formData, setFormData] = useState({
        patientId: entityType === "patient" ? itemId : "",
        vetCenterId: entityType === "vetCenter" ? itemId : "",
        osteoCenterId: entityType === "osteoCenter" ? itemId : "",
        appointmentDate: "",
        appointmentTime: "",
        infos: "",
        reasonAppointmentId: "",
        statusAppointmentId: 1
    })
    const [reasonAppointments, setReasonAppointments] = useState([]);
    const [statusAppointments, setStatusAppointments] = useState([]);

    useEffect(() => {
        const fetchReasonAppointments = async () => {
            try {
                const response = await axios.get("http://localhost:4000/appointments/reasons");
                setReasonAppointments(response.data);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des rdv"
                )
            }
        }
        fetchReasonAppointments();
    }, []);

    useEffect(() => {
        const fetchstatuAppointments = async () => {
            try {
                const response = await axios.get("http://localhost:4000/appointments/status");
                setStatusAppointments(response.data);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des rdv"
                )
            }
        }
        fetchstatuAppointments();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

        try {
            const response = await axios.post("http://localhost:4000/appointments/add", {
                ...formData,
                appointmentDate: fullDateTime,
            });            alert("Rendez-vous pris !")
        } catch (error) {
            console.error("Erreur lors de la prise du RDV: ", error);
            alert("Erreur lors de la prise du RDV");
        }
    }

    return (
        <section>
            <h4>Rendez vous</h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor="appointmentDate"
                    >
                        Date
                    </label>
                    <input
                        type="date"
                        name="appointmentDate"
                        id="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="appointmentTime">Heure</label>
                    <input
                        type="time"
                        name="appointmentTime"
                        id="appointmentTime"
                        value={formData.appointmentTime || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
    
                <div>
                    <label
                        htmlFor="infos"
                    >
                        Infos
                    </label>
                    <input
                        type="text"
                        name="infos"
                        id="infos"
                        value={formData.infos}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <select
                        name="reasonAppointmentId"
                        id="reasonAppointmentID"
                        value={formData.reasonAppointmentId}
                        onChange={handleChange}
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

                {/* <div>
                    <select
                        name="statusAppointmentId"
                        id="statusAppointmentID"
                        value={formData.statusAppointmentId}
                        onChange={handleChange}
                    >
                        {statusAppointments.map((statusAppointment) => (
                            <option key={statusAppointment.id} value={statusAppointment.id}>
                                {statusAppointment.name}
                            </option>
                        ))}
                    </select>
                </div> */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Prendre RDV
                    </button>
                </div>
    
            </form>
        </section>
    )
}
