"use client";

import React, { useEffect, useState} from "react";
import axios from "axios";
import CenterForm from "@/app/components/CenterForm";
import api from '@/utils/apiCall';


export default function AddOsteoCenterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postal: "",
        infos: "",
        department: "",
        phone: ""
    });

    const [osteos, setOsteos] = useState([
        { firstname: "", lastname: "", email: "" }
    ]);

    // Soumission du formulaire
    const handleSubmit = async (data) => {
    // Renommer "staff" en "osteos" pour correspondre au modèle attendu par l'API
        const formDataToSend = { ...data, osteos: data.staff };
        delete formDataToSend.staff;

        try {
            const response = await api.post("/osteo-centers/add", formDataToSend);
            alert("Centre pstéopathe ajouté avec succès !");
            setFormData({
                name: "",
                email: "",
                address: "",
                city: "",
                postal: "",
                infos: "",
                department: "",
                phone: ""
            });
            setOsteos([{ firstname: "", lastname: "", email: "" }]);
        } catch (error) {
            console.error("Erreur lors de l'ajout du centre ostéopathe :", error);
            alert("Erreur lors de l'ajout du centre ostéopathe.");
        }
    };

    return (
        <CenterForm
            centerType="ostéopathe"
            staffLabel="ostéopathe"
            initialData={{ ...formData, staff: osteos }}
            enableSubmitBtn = {true}
            onSubmit={handleSubmit}
            isEditing= {false}
        />
    );
}