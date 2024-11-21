"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'; 
import CenterFormSection from "@/app/components/CenterFormSection";

export default function EditPatientForm({ params }) {
  const [formData, setFormData] = useState({
    name: "",
    birthYear: "",
    weight: "",
    sexId: "",
    animalTypeId: "",
    customAnimalType: "",
    raceId: "",
    customRace: "",
    pathology: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    adress: "",
    city: "",
    postal: "",
    department: "",
    clientSexId: "",
    vetCenterId: "",
    nameVetCenter: "",
    adressVetCenter: "",
    cityVetCenter: "",
    departmentVetCenter: "",
    postalVetCenter: "",
    phoneVetCenter: "",
    emailVetCenter: "",
    osteoCenterId: "",
    nameOsteoCenter: "",
    adressOsteoCenter: "",
    cityOsteoCenter: "",
    departmentOsteoCenter: "",
    postalOsteoCenter: "",
    phoneOsteoCenter: "",
    emailOsteoCenter: "",
    vets: [],
    osteos: []
  });

  const [sexes, setSexes] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [vetCenters, setVetCenters] = useState([]);
  const [osteoCenters, setOsteoCenters] = useState([]);
  const [races, setRaces] = useState([]);
  const [limbs, setLimbs] = useState([]);  // Liste des limbs disponibles
  const [selectedLimbs, setSelectedLimbs] = useState([]);
  const [showCustomAnimalType, setShowCustomAnimalType] = useState(false);
  const [showCustomRace, setShowCustomRace] = useState(false);
  const [showCustomRaceStandalone, setShowCustomRaceStandalone] = useState(false);
  const [enableVetFields, setEnableVetFields] = useState(false);
  const [enableOsteoFields, setEnableOsteoFields] = useState(false);
  const [disabledRace, setDisabledRace] = useState(true);
  const [vetStaffList, setVetStaffList] = useState([]);
  const [osteoStaffList, setOsteoStaffList] = useState([]);

  const { id } = params;
  const router = useRouter();

    const setVetsList = (vetsList) => {
    setVetStaffList(vetsList); // Mise à jour de vetStaffList avec les données des vétérinaires
    setFormData((prevData) => ({ ...prevData, vets: vetsList }));
  };

  const setOsteosList = (osteosList) => {
    setOsteoStaffList(osteosList); // Mise à jour de osteoStaffList avec les données des vétérinaires
    setFormData((prevData) => ({ ...prevData, osteos: osteosList }));
  };

// Charger les informations du patient existant
useEffect(() => {
    const fetchPatientData = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:4000/patients/${id}`);
          const patient = response.data;
          setFormData({
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
            vetCenterId: patient.vetCenterId || "",
            osteoCenterId: patient.osteoCenterId || "",
            // nameVetCenter: patient.vetCenter?.name || "",
            // adressVetCenter: patient.vetCenter?.adress || "",
            // cityVetCenter: patient.vetCenter?.city || "",
            // departmentVetCenter: patient.vetCenter?.department || "",
            // postalVetCenter: patient.vetCenter?.postal || "",
            // phoneVetCenter: patient.vetCenter?.phone || "",
            // emailVetCenter: patient.vetCenter?.email || "",
            // osteoCenterId: patient.osteoCenterId || "",
            // nameVetCenter: patient.vetCenter?.name || "",
            // adressOsteoCenter: patient.osteoCenter?.adress || "",
            // cityOsteoCenter: patient.osteoCenter?.city || "",
            // departmentOsteoCenter: patient.osteoCenter?.department || "",
            // postalOsteoCenter: patient.osteoCenter?.postal || "",
            // phoneOsteoCenter: patient.osteoCenter?.phone || "",
            // emailOsteoCenter: patient.osteoCenter?.email || ""
          });

          // if (patient.animalType?.races) {
          //   console.log("Races fetched for animal type:", patient.animalType.races);

          //   setRaces(patient.animalType.races);
          // }

          setSelectedLimbs(patient.Limbs ? patient.Limbs.map(limb => limb.id) : []);
        } catch (error) {
          console.error("Erreur lors de la récupération des données du patient :", error);
        }
      }
    };
  
    fetchPatientData();
  }, [id]);
  

  // Gestion des changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Gérer le champ "Autre" pour le type d'animal
    if (name === "animalTypeId") {
      if (value === "other") {
          setShowCustomAnimalType(true);
          setRaces([]);
          setFormData({
              ...formData,
              animalTypeId: value,
              raceId: "",
              customAnimalType: "",
              customRace: ""
          });
      } else if (value === "") {
          setShowCustomAnimalType(false);
          setFormData({
              ...formData,
              animalTypeId: "",
              raceId: "",
              customAnimalType: "",
              customRace: ""
          });
      } else {
          setShowCustomAnimalType(false);
          updateRaceOptions(value);
          setFormData({
              ...formData,
              animalTypeId: value,
              raceId: "",
              customAnimalType: "",
              customRace: ""
          });
      }
  }

  if (name === "raceId") {
      if (value === "other") {
          setShowCustomRace(true);
      } else {
          setShowCustomRace(false);
      }
  }

    // Gestion des centres vétérinaires
    if (name === "vetCenterId" && value === "other") {
      setEnableVetFields(true); // Active les champs du centre vétérinaire si "Autre" est sélectionné
    } else if (name === "vetCenterId") {
      setEnableVetFields(false);
    }

    if (name === "osteoCenterId") {
      setEnableOsteoFields(value === "other");
    }
  };

  // Met à jour les options de race en fonction du type d'animal
  const updateRaceOptions = (animalTypeId) => {
    const selectedAnimalType = animalTypes.find(
      (animal) => animal.id === parseInt(animalTypeId)
    );
    setRaces(selectedAnimalType ? selectedAnimalType.races : []);
  };

  // Récupération des données pour le formulaire lors du chargement de la page
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/patients/form");
        const { sexes, animalTypes, vetCenters, osteoCenters, limbs, races } = response.data;
        console.log(limbs)
        setSexes(sexes);
        setAnimalTypes(animalTypes);
        setRaces(races);
        setVetCenters(vetCenters);
        setOsteoCenters(osteoCenters)
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

  // Envoi des données du formulaire au backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    let formDataToSend = { ...formData, 
      limbs: selectedLimbs,
      vets: vetStaffList,
      osteos: osteoStaffList
      }; // Clone formData

    // Si l'utilisateur a choisi "Autre" pour le type d'animal, ajouter le champ personnalisé
    if (formData.animalTypeId === "other") {
      formDataToSend.animalTypeId = null; // On met animalTypeId à null car on va utiliser customAnimalType
      formDataToSend.customAnimalType = formData.customAnimalType;
    }
  
    // Si l'utilisateur a choisi "Autre" pour la race, ajouter le champ personnalisé
    if (formData.raceId === "other") {
      formDataToSend.raceId = null; // On met raceId à null car on va utiliser customRace
      formDataToSend.customRace = formData.customRace;
    }

      // Gestion de "Autre" pour le centre vétérinaire
  if (formData.vetCenterId === "other") {
    formDataToSend.vetCenterId = null; // On met vetCenterId à null car on va utiliser les champs personnalisés pour le centre
    formDataToSend.nameVetCenter = formData.nameVetCenter;
    formDataToSend.adressVetCenter = formData.adressVetCenter;
    formDataToSend.cityVetCenter = formData.cityVetCenter;
    formDataToSend.departmentVetCenter = formData.departmentVetCenter;
    formDataToSend.postalVetCenter = formData.postalVetCenter;
    formDataToSend.phoneVetCenter = formData.phoneVetCenter;
    formDataToSend.emailVetCenter = formData.emailVetCenter;
  }

  if (formData.osteoCenterId === "other") {
    formDataToSend.OsteoCenterId = null; // On met OsteoCenterId à null car on va utiliser les champs personnalisés pour le centre
    formDataToSend.nameOsteoCenter = formData.nameOsteoCenter;
    formDataToSend.adressOsteoCenter = formData.adressOsteoCenter;
    formDataToSend.cityOsteoCenter = formData.cityOsteoCenter;
    formDataToSend.departmentOsteoCenter = formData.departmentOsteoCenter;
    formDataToSend.postalOsteoCenter = formData.postalOsteoCenter;
    formDataToSend.phoneOsteoCenter = formData.phoneOsteoCenter;
    formDataToSend.emailOsteoCenter = formData.emailOsteoCenter;
  }
    
    try {
      const response = await axios.put(
        `http://localhost:4000/patients/${id}/edit/add`,
        formDataToSend
      );
      alert("Patient modifié avec succès !");
      router.push("/patients");
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient :", error);
      alert("Erreur lors de l'ajout du patient. Veuillez réessayer.");
    }
  };

  return (
    <section className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Ajouter un patient
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informations du patient
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nom
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="birthYear"
                className="block text-sm font-medium text-gray-700"
              >
                Date de naissance
              </label>
              <input
                type="text"
                name="birthYear"
                id="birthYear"
                value={formData.birthYear}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Poids
              </label>
              <input
                type="text"
                name="weight"
                id="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="sex"
                className="block text-sm font-medium text-gray-700"
              >
                Sexe
              </label>
              <select
                name="sexId"
                id="sex"
                value={formData.sexId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Sélectionnez un sexe</option>
                {sexes.map((sex) => (
                  <option key={sex.id} value={sex.id}>
                    {sex.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="animalType" className="block text-sm font-medium text-gray-700">
                  Type d'animal
              </label>
              <select
                  name="animalTypeId"
                  id="animalType"
                  value={formData.animalTypeId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                  <option value="">Sélectionnez un type</option>
                  {animalTypes.map((animalType) => (
                      <option key={animalType.id} value={animalType.id}>
                          {animalType.name}
                      </option>
                  ))}
                  <option value="other">Autre</option>
              </select>
                {showCustomAnimalType && (
                  <div className="mt-4">
                      <label htmlFor="customAnimalType" className="block text-sm font-medium text-gray-700">
                          Entrez le type d'animal
                      </label>
                      <input
                          type="text"
                          name="customAnimalType"
                          id="customAnimalType"
                          value={formData.customAnimalType}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                  </div>
                )}
             </div>


            <div>
              <label
                htmlFor="race"
                className="block text-sm font-medium text-gray-700"
              >
                Race
              </label>
              <select
                name="raceId"
                id="race"
                value={formData.raceId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                // disabled={disabledRace}
              >
                <option value="">Sélectionnez une race</option>
                {Array.isArray(races) && races.map((race) => (
                  <option key={race.id} value={race.id}>
                    {race.name}
                  </option>
                ))}
                <option value="other">Autre</option>
              </select>
              {showCustomRace && (
                <div className="mt-4">
                  <label
                    htmlFor="customRace"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Entrez la race
                  </label>
                  <input
                    type="text"
                    name="customRace"
                    id="customRace"
                    value={formData.customRace}
                    onChange={handleInputChange}
                    // disabled={disabledRace}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              )}
            </div>



            <div className="md:col-span-2">
              <label
                htmlFor="pathology"
                className="block text-sm font-medium text-gray-700"
              >
                Pathologie
              </label>
              <input
                type="text"
                name="pathology"
                id="pathology"
                value={formData.pathology}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="mb-5">
              <h4 className="text-xl text-gray-700 mb-4">
                Membres affectés :
              </h4>
              {limbs.map((limb) => (
                <div key={limb.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`limb-${limb.id}`}
                    name="limbs"
                    value={limb.id}
                    checked={selectedLimbs.includes(limb.id)}  // Cocher si le limb est sélectionné
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLimbs([...selectedLimbs, limb.id]);  // Ajouter le limb si coché
                      } else {
                        setSelectedLimbs(selectedLimbs.filter(id => id !== limb.id));  // Retirer si décoché
                      }
                    }}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor={`limb-${limb.id}`} className="ml-2 block text-sm text-gray-700">
                    {limb.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CLIENT */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informations du client
          </h3>
          <div>
              <label
                htmlFor="sex"
                className="block text-sm font-medium text-gray-700"
              >
                Sexe
              </label>
              <select
                name="clientSexId"
                id="clientSexId"
                value={formData.clientSexId}
                onChange={handleInputChange}
                className="mt-1 block w-30 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {sexes.map((sex) => (
                  <option key={sex.id} value={sex.id}>
                    {sex.name}
                  </option>
                ))}
              </select>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                Prénom du client
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Nom du client
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email du client
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Téléphone du client
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="adress"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse du client
              </label>
              <input
                type="text"
                name="adress"
                id="adress"
                value={formData.adress}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                Ville
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="postal"
                className="block text-sm font-medium text-gray-700"
              >
                Code Postal
              </label>
              <input
                type="text"
                name="postal"
                id="postal"
                value={formData.postal}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Département
              </label>
              <input
                type="text"
                name="department"
                id="department"
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            
          </div>
        </div>

        {/* CENTRE VETERINAIRE */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informations sur le centre vétérinaire
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="vetCenter"
                className="block text-sm font-medium text-gray-700"
              >
                Centre vétérinaire
              </label>
              <select
                name="vetCenterId"
                id="vetCenter"
                value={formData.vetCenterId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Sélectionnez un centre vétérinaire</option>
                {vetCenters.map((vetCenter) => (
                  <option key={vetCenter.id} value={vetCenter.id}>
                    {vetCenter.name} à {vetCenter.city}
                  </option>
                ))}
                <option value="other">Autres</option>
              </select>
            </div>
          </div>

          {enableVetFields && (
            <div className="mt-6">
              <CenterFormSection
                formData={formData}
                onInputChange={handleInputChange}
                centerLabel="veterinaire"
                centerType="VetCenter"
                enableStaff={true}
                staffLabel="veterinaire"
                onStaffListChange={setVetsList}
              />
            </div>
          )}
        </div>

                {/* CENTRE VETERINAIRE */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informations sur le centre ostéopathe
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="osteoCenter"
                className="block text-sm font-medium text-gray-700"
              >
                Centre ostéopathe
              </label>
              <select
                name="osteoCenterId"
                id="osteoCenter"
                value={formData.osteoCenterId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Sélectionnez un centre ostéopathe</option>
                {osteoCenters.map((osteoCenter) => (
                  <option key={osteoCenter.id} value={osteoCenter.id}>
                    {osteoCenter.name} à {osteoCenter.city}
                  </option>
                ))}
                <option value="other">Autres</option>
              </select>
            </div>
          </div>

          {enableOsteoFields && (
            <div className="mt-6">
              <CenterFormSection
                formData={formData}
                onInputChange={handleInputChange}
                centerLabel="osteopathe"
                centerType="OsteoCenter"
                enableStaff={true}
                staffLabel="osteopathe"
                onStaffListChange={setOsteosList}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Modifier le patient
          </button>
        </div>
      </form>
    </section>
  );
}