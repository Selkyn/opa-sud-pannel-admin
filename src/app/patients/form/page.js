"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/apiCall";
import PatientForm from "@/app/components/PatientForm";

export default function AddPatientForm() {
  const [sexes, setSexes] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [limbs, setLimbs] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [races, setRaces] = useState([]);
  const [vetCenters, setVetCenters] = useState([]);
  const [osteoCenters, setOsteoCenters] = useState([]);
  const [showCustomAnimalType, setShowCustomAnimalType] = useState(false);
  const [showCustomRace, setShowCustomRace] = useState(false);
   const [vetStaffList, setVetStaffList] = useState([]);
     const [vets, setVets] = useState([
       { firstname: "", lastname: "", email: "" },
     ]);

     const [osteos, setOsteos] = useState([
        { firstname: "", lastname: "", email: "" },
      ]);

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

  useEffect(() => {
    // Récupération des données pour le formulaire lors du chargement de la page
    fetchFormData();
  }, []);
  const fetchFormData = async () => {
    try {
      const response = await api.get("/patients/form");
      const { sexes, animalTypes, vetCenters, limbs, osteoCenters } =
        response.data;
      setSexes(sexes);
      setAnimalTypes(animalTypes);
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

  const handleSubmitCenterVet = async (data) => {
    const formDataToSend = { ...data, vets: data.staff };
    delete formDataToSend.staff;

    try {
      const response = await api.post("/vet-centers/add", formDataToSend);
      const newCenter = response.data; // 📌 Récupérer le centre ajouté

      alert("Centre vétérinaire ajouté avec succès !");

      // 📌 Rafraîchir la liste des centres depuis l'API (optionnel, mais recommandé)
      fetchFormData();

      // 📌 Ajouter le nouveau centre à la liste sans recharger
      setVetCenters((prev) => [...prev, newCenter]);

      // ✅ Sélectionner automatiquement le centre ajouté
      // setFormData((prevData) => ({
      //   ...prevData,
      //   vetCenters: [...prevData.vetCenters, newCenter.id], // Ajoute l'ID du nouveau centre
      // }));
    } catch (error) {
      console.error("Erreur lors de l'ajout du centre vétérinaire :", error);
      alert("Erreur lors de l'ajout du centre vétérinaire.");
    }
  };

  const handleSubmitCenterOsteo = async (data) => {
    const formDataToSend = { ...data, osteos: data.staff };
    delete formDataToSend.staff;

    try {
      const response = await api.post("/osteo-centers/add", formDataToSend);
      const newCenter = response.data; // 📌 Récupérer le centre ajouté

      alert("Centre ostéopathe ajouté avec succès !");

      // 📌 Rafraîchir la liste des centres depuis l'API (optionnel, mais recommandé)
      fetchFormData();

      // 📌 Ajouter le nouveau centre à la liste sans recharger
      setOsteoCenters((prev) => [...prev, newCenter]);

      // ✅ Sélectionner automatiquement le centre ajouté
      // setFormData((prevData) => ({
      //   ...prevData,
      //   vetCenters: [...prevData.vetCenters, newCenter.id], // Ajoute l'ID du nouveau centre
      // }));
    } catch (error) {
      console.error("Erreur lors de l'ajout du centre ostéopathe :", error);
      alert("Erreur lors de l'ajout du centre ostéopathe.");
    }
  };

    const [formDataVetCenter, setFormDataVetCenter] = useState({
      name: "",
      email: "",
      address: "",
      city: "",
      postal: "",
      infos: "",
      department: "",
      phone: "",
    });

    const [formDataOsteoCenter, setFormDataOsteoCenter] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postal: "",
        infos: "",
        department: "",
        phone: "",
      });



  return (
    <section className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
        <PatientForm 
            sexes={sexes}
            animalTypes={animalTypes}
            limbs={limbs}
            specialities={specialities}
            vetCenters={vetCenters}
            submitVetCenter={handleSubmitCenterVet}
            formDataVetCenter={formDataVetCenter}
            vets={vets}
            osteoCenters={osteoCenters}
            submitOsteoCenter={handleSubmitCenterOsteo}
            formDataOsteoCenter={formDataOsteoCenter}
            osteos={osteos}
        />
    </section>
  )
}
