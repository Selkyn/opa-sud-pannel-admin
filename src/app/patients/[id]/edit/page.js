"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import api from "@/utils/apiCall";
import PatientForm from "@/app/components/PatientForm";

export default function EditPatient() {
  const { id } = useParams();
  const router = useRouter();
  const form = useForm();
  const [initialData, setInitialData] = useState(null); // ✅ Stocker les données du patient
  const [isLoading, setIsLoading] = useState(true); // ✅ Ajouter un état de chargement

  const [sexes, setSexes] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [vetCenters, setVetCenters] = useState([]);
  const [osteoCenters, setOsteoCenters] = useState([]);
  const [races, setRaces] = useState([]);
  const [limbs, setLimbs] = useState([]);
   const [specialities, setSpecialities] = useState([]);

  // ✅ Charger les données du patient
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/patients/${id}`);
        const patient = response.data;


        setInitialData({
          name: patient.name || "",
          birthYear: patient.birthYear || "",
          weight: patient.weight || "",
          sexId: patient.sexId || "",
          animalTypeId: patient.animalTypeId || "",
          customAnimalType: patient.customAnimalType || "",
          raceId: patient.raceId || "",
          customRace: patient.customRace || "",
          pathology: patient.pathology || "",
          firstname: patient.client?.firstname || "",
          lastname: patient.client?.lastname || "",
          email: patient.client?.email || "",
          phone: patient.client?.phone || "",
          adress: patient.client?.adress || "",
          city: patient.client?.city || "",
          postal: patient.client?.postal || "",
          department: patient.client?.department || "",
          clientSexId: patient.client?.sexId || "",
          vetCenters: patient.VetCenters.map((center) => {
            // Trouver les spécialités sélectionnées par le patient pour ce centre
            const selectedSpecialities = patient.PatientVetCenters?.find(
              (pvc) => pvc.vetCenterId === center.id
            )?.Specialities?.map((spec) => spec.id) || [];
        
            return {
              id: center.id,
              name: center.name,
              city: center.city,
              Specialities: center.Specialities || [], // ✅ Les spécialités générales du centre
              selectedSpecialities: selectedSpecialities, // ✅ Spécialités choisies par le patient
            };
          }) || [],
          osteoCenters: patient.OsteoCenters || [],
          limbs: patient.Limbs ? patient.Limbs.map((limb) => limb.id) : [],
          // selectedSpecialities: patient.VetCenters.Specialities ? patient.VetCenters.Specialities.map((speciality) => speciality.id) : [],
        });

        setIsLoading(false); // ✅ Données chargées, on enlève le loader
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du patient :",
          error
        );
      }
    };

    fetchPatientData();
  }, [id]);

  // ✅ Charger les données du formulaire (sexes, animaux, etc.)
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await api.get("/patients/form");
        const { sexes, animalTypes, vetCenters, osteoCenters, limbs, races } =
          response.data;

        setSexes(sexes);
        setAnimalTypes(animalTypes);
        setRaces(races);
        setVetCenters(vetCenters);
        setOsteoCenters(osteoCenters);
        setLimbs(limbs);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du formulaire",
          error
        );
      }
    };
    fetchFormData();
  }, []);

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await api.get("/specialities");
        setSpecialities(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSpecialities();
  }, []);

  if (isLoading) return <p>Chargement...</p>; // ✅ Empêche le rendu tant que les données ne sont pas chargées

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold text-white mb-4">Modifier le patient</h1>
      <PatientForm
        initialData={initialData} // ✅ Envoie les valeurs chargées
        sexes={sexes}
        animalTypes={animalTypes}
        races={races}
        limbs={limbs}
        vetCenters={vetCenters}
        osteoCenters={osteoCenters}
        specialities={specialities}
        isEditing={true} // ✅ Indique que c'est une édition
        patientId={id} // ✅ Envoie l'ID du patient
      />
    </div>
  );
}
