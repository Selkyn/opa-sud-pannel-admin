"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox, JollyCheckboxGroup } from "@/components/ui/checkbox";

import CenterFormSection from "@/app/components/CenterFormSection";
import api from "@/utils/apiCall";

export default function AddPatientForm() {
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
    vetCenterId: null,
    nameVetCenter: "",
    adressVetCenter: "",
    cityVetCenter: "",
    departmentVetCenter: "",
    postalVetCenter: "",
    phoneVetCenter: "",
    emailVetCenter: "",
    infosVetCenter: "",
    osteoCenterId: null,
    nameOsteoCenter: "",
    adressOsteoCenter: "",
    cityOsteoCenter: "",
    departmentOsteoCenter: "",
    postalOsteoCenter: "",
    phoneOsteoCenter: "",
    emailOsteoCenter: "",
    infosOsteoCenter: "",
    limbs: [],
    vets: [],
    osteos: [],
  });

  const [sexes, setSexes] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [limbs, setLimbs] = useState([]);
  const [vetCenters, setVetCenters] = useState([]);
  const [osteoCenters, setOsteoCenters] = useState([]);
  const [races, setRaces] = useState([]);
  const [showCustomAnimalType, setShowCustomAnimalType] = useState(false);
  const [showCustomRace, setShowCustomRace] = useState(false);
  const [showCustomRaceStandalone, setShowCustomRaceStandalone] =
    useState(false);
  const [enableVetFields, setEnableVetFields] = useState(false);
  const [enableOsteoFields, setEnableOsteoFields] = useState(false);
  const [vetStaffList, setVetStaffList] = useState([]);
  const [osteoStaffList, setOsteoStaffList] = useState([]);
  const [disabledRace, setDisabledRace] = useState(true);

  const setVetsList = (vetsList) => {
    setVetStaffList(vetsList); // Mise à jour de vetStaffList avec les données des vétérinaires
    setFormData((prevData) => ({ ...prevData, vets: vetsList }));
  };

  const setOsteosList = (osteosList) => {
    setOsteoStaffList(osteosList); // Mise à jour de osteoStaffList avec les données des vétérinaires
    setFormData((prevData) => ({ ...prevData, osteos: osteosList }));
  };

  // Gestion des changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Gérer le champ "Autre" pour le type d'animal
    if (name === "animalTypeId") {
      if (value === "other") {
        // Si l'utilisateur sélectionne "Autre" pour le type d'animal
        setShowCustomAnimalType(true); // Affiche le champ personnalisé pour le type d'animal
        setDisabledRace(false); // Active le champ "race"
        setRaces([]); // Réinitialise les races
        setFormData({
          ...formData,
          animalTypeId: value,
          raceId: "", // Réinitialise la race
          customAnimalType: "",
          customRace: "",
        });
      } else if (value === "") {
        // Si aucun type n'est sélectionné, désactive tout
        setShowCustomAnimalType(false);
        setDisabledRace(true);
        setFormData({
          ...formData,
          animalTypeId: value,
          raceId: "",
          customAnimalType: "",
          customRace: "",
        });
      } else {
        // Si un type d'animal existant est sélectionné
        setShowCustomAnimalType(false); // Cache le champ personnalisé pour le type
        setDisabledRace(false); // Active le champ "race"
        updateRaceOptions(value); // Met à jour les options de race
        setFormData({
          ...formData,
          animalTypeId: value,
          raceId: "", // Réinitialise la race
          customAnimalType: "",
          customRace: "",
        });
      }
    }

    if (name === "raceId" && value === "other") {
      // Si l'utilisateur sélectionne "Autre" pour la race
      setShowCustomRace(true); // Affiche le champ personnalisé pour la race
    } else if (name === "raceId") {
      setShowCustomRace(false); // Cache le champ personnalisé pour la race
    }

    // Gérer le champ "Autre" pour les centres vétérinaires et ostéopathes
    if (name === "vetCenterId") {
      setEnableVetFields(value === "other");
    }
    if (name === "osteoCenterId") {
      setEnableOsteoFields(value === "other");
    }
  };

  // Gestion des changements de sélection des limbs
  const handleLimbChange = (e) => {
    const { value, checked } = e.target;
    let updatedLimbs = [...formData.limbs];

    if (checked) {
      updatedLimbs.push(value); // Ajouter l'ID du limb si coché
    } else {
      updatedLimbs = updatedLimbs.filter((limbId) => limbId !== value); // Retirer si décoché
    }

    setFormData({ ...formData, limbs: updatedLimbs });
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
    fetchFormData();
  }, []);

  const checkClientEmail = async (email) => {
    try {
      const response = await api.get(`/clients/email/${email}`);
      if (response.data) {
        const clientData = response.data; // Les informations du client récupérées
        setFormData((prevData) => ({
          ...prevData,
          firstname: clientData.firstname || "",
          lastname: clientData.lastname || "",
          phone: clientData.phone || "",
          adress: clientData.adress || "",
          city: clientData.city || "",
          postal: clientData.postal || "",
          department: clientData.department || "",
          clientSexId: clientData.sexId || "",
        }));
        alert("Les informations du client ont été préremplies.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email :", error);
      alert("Aucun client trouvé avec cet email.");
    }
  };

  // Envoi des données du formulaire au backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    let formDataToSend = {
      ...formData,
      vets: vetStaffList,
      osteos: osteoStaffList,
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
      formDataToSend.infosVetCenter = formData.infosVetCenter;
    }

    // Gestion de "Autre" pour le centre vétérinaire
    if (formData.osteoCenterId === "other") {
      formDataToSend.osteoCenterId = null; // On met OsteoCenterId à null car on va utiliser les champs personnalisés pour le centre
      formDataToSend.nameOsteoCenter = formData.nameOsteoCenter;
      formDataToSend.adressOsteoCenter = formData.adressOsteoCenter;
      formDataToSend.cityOsteoCenter = formData.cityOsteoCenter;
      formDataToSend.departmentOsteoCenter = formData.departmentOsteoCenter;
      formDataToSend.postalOsteoCenter = formData.postalOsteoCenter;
      formDataToSend.phoneOsteoCenter = formData.phoneOsteoCenter;
      formDataToSend.emailOsteoCenter = formData.emailOsteoCenter;
      formDataToSend.infosOsteoCenter = formData.infosOsteoCenter;
    }

    try {
      const response = await api.post("/patients/add", formDataToSend);
      alert("Patient ajouté avec succès !");
      // Réinitialiser les données du formulaire après la soumission
      setFormData({
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
        limbs: [],
      });
      setEnableVetFields(false);
      setEnableOsteoFields(false);
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
              <label
                htmlFor="animalType"
                className="block text-sm font-medium text-gray-700"
              >
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
                  <label
                    htmlFor="customAnimalType"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                disabled={disabledRace}
              >
                <option value="">Sélectionnez une race</option>
                {races.map((race) => (
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
                    disabled={disabledRace}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              )}
            </div>

            <div className="mb-5">
              <JollyCheckboxGroup
                className="flex flex-wrap text-base font-medium text-[#07074D]"
                label="Sélectionnez des membres"
                value={formData.limbs || []}
                onChange={(values) =>
                  setFormData({ ...formData, limbs: values })
                }
                color="primary"
                orientation="vertical"
              >
                <div className="grid grid-cols-2">
                  {limbs.map((limb) => (
                    <Checkbox
                      // className="w-fit flex mb-2 rounded-md border border-[#e0e0e0] bg-white py-2 px-2 text-base font-medium text-[#07074D] outline-none focus:border-[#3766AB] focus:shadow-md"
                      key={limb.id}
                      value={limb.id}
                    >
                      {limb.name}
                    </Checkbox>
                  ))}
                </div>
              </JollyCheckboxGroup>
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
          </div>
        </div>

        {/* CLIENT */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informations du client
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sexe du client
            </label>
            <div className="flex items-center space-x-6 mt-2">
              {sexes.map((sex) => (
                <div key={sex.id} className="flex items-center">
                  <input
                    id={sex.id}
                    name="clientSexId"
                    type="radio"
                    value={sex.id}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label
                    htmlFor={sex.id}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {sex.name}
                  </label>
                </div>
              ))}
            </div>
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
                onBlur={(e) => checkClientEmail(e.target.value)} // Vérifie l'email lors de la perte de focus
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

        {/* CENTRE OSTEOPATHE */}
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
                centerLabel="ostéopathe"
                centerType="OsteoCenter"
                enableStaff={true}
                staffLabel="ostéopathe"
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
            Ajouter le patient
          </button>
        </div>
      </form>
    </section>
  );
}
