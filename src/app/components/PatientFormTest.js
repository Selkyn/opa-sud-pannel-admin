

import React, { useEffect, useState } from "react";
import axios from "axios";
import api from '@/utils/apiCall';


export default function PatientForm({ initialData = {}, isEditMode = false }) {
    const [formData, setFormData] = useState({
      name: initialData.name || "",
      birthYear: initialData.birthYear || "",
      sexId: initialData.sexId || "",
      animalTypeId: initialData.animalTypeId || "",
      customAnimalType: initialData.customAnimalType || "",
      raceId: initialData.raceId || "",
      customRace: initialData.customRace || "",
      customRaceStandalone: initialData.customRaceStandalone || "",
      pathology: initialData.pathology || "",
      firstname: initialData.firstname || "",
      lastname: initialData.lastname || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      adress: initialData.adress || "",
      city: initialData.city || "",
      postal: initialData.postal || "",
      department: initialData.department || "",
      clientSexId: initialData.clientSexId || "",
      vetCenterId: initialData.vetCenterId || "",
      nameVetCenter: initialData.nameVetCenter || "",
      adressVetCenter: initialData.adressVetCenter || "",
      cityVetCenter: initialData.cityVetCenter || "",
      departmentVetCenter: initialData.departmentVetCenter || "",
      postalVetCenter: initialData.postalVetCenter || "",
      phoneVetCenter: initialData.phoneVetCenter || "",
      emailVetCenter: initialData.emailVetCenter || ""
    });

  const [sexes, setSexes] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [vetCenters, setVetCenters] = useState([]);
  const [races, setRaces] = useState([]);
  const [showCustomAnimalType, setShowCustomAnimalType] = useState(false);
  const [showCustomRace, setShowCustomRace] = useState(false);
  const [enableVetFields, setEnableVetFields] = useState(false);

  // Mise à jour des options de race en fonction du type d'animal
  const updateRaceOptions = (animalTypeId) => {
    const selectedAnimalType = animalTypes.find(
      (animal) => animal.id === parseInt(animalTypeId)
    );
    setRaces(selectedAnimalType ? selectedAnimalType.races : []);
  };

  // Gestion des changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "animalTypeId") {
      if (value === "other") {
        setShowCustomAnimalType(true);
        setRaces([]);
        setFormData({
          ...formData,
          raceId: "",
          customRace: "",
          customAnimalType: "",
        });
      } else {
        setShowCustomAnimalType(false);
        updateRaceOptions(value);
      }
    }

    if (name === "raceId" && value === "other") {
      setShowCustomRace(true);
    } else if (name === "raceId") {
      setShowCustomRace(false);
    }

    if (name === "vetCenterId" && value === "other") {
      setEnableVetFields(true);
    } else if (name === "vetCenterId") {
      setEnableVetFields(false);
    }
  };

  // Charger les données si nous sommes en mode édition (initialData est fourni)
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await api.get("/patients/form");
        const { sexes, animalTypes, vetCenters } = response.data;
        setSexes(sexes);
        setAnimalTypes(animalTypes);
        setVetCenters(vetCenters);

        // Si des données initiales sont fournies (mode édition), préremplir le formulaire
        if (initialData) {
          setFormData(initialData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du formulaire", error);
      }
    };

    fetchFormData();
  }, [initialData]);

 // Envoi des données du formulaire au backend
 const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    let formDataToSend = { ...formData }; // Clone formData

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

    try {
      const url = isEditMode
        ? `/patients/${initialData.id}/edit`
        : "/patients/add";
      const response = await api.post(url, formDataToSend);
      alert(isEditMode ? "Patient modifié avec succès !" : "Patient ajouté avec succès !");
      // Réinitialiser les données du formulaire après la soumission
      setFormData({
        name: "",
        birthYear: "",
        sexId: "",
        animalTypeId: "",
        customAnimalType: "",
        raceId: "",
        customRace: "",
        customRaceStandalone: "",
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
        emailVetCenter: ""
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout ou de la modification du patient :", error);
      alert("Erreur lors de la soumission du formulaire. Veuillez réessayer.");
    }
  };

  return (
    <section className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {isEditMode ? "Modifier le patient" : "Ajouter un patient"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Informations du patient
                </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom
                    </label>
                    <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
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
                            name="customRaceStandalone"
                            id="customRaceStandalone"
                            value={formData.customRaceStandalone}
                            onChange={handleInputChange}
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

                    {/* CLIENT */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informations du client
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sexe du client</label>
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
                  <label htmlFor={sex.id} className="ml-2 block text-sm text-gray-700">
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

            {enableVetFields && (
              <>
                <div className="md:col-span-2">
                  <label
                    htmlFor="nameVetCenter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nom du centre
                  </label>
                  <input
                    type="text"
                    name="nameVetCenter"
                    id="nameVetCenter"
                    value={formData.nameVetCenter}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adressVetCenter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adressVetCenter"
                    id="adressVetCenter"
                    value={formData.adressVetCenter}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cityVetCenter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ville
                  </label>
                  <input
                    type="text"
                    name="cityVetCenter"
                    id="cityVetCenter"
                    value={formData.cityVetCenter}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalVetCenter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="postalVetCenter"
                    id="postalVetCenter"
                    value={formData.postalVetCenter}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneVetCenter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Téléphone
                  </label>
                  <input
                    type="text"
                    name="phoneVetCenter"
                    id="phoneVetCenter"
                    value={formData.phoneVetCenter}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="emailVetCenter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="emailVetCenter"
                    id="emailVetCenter"
                    value={formData.emailVetCenter}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </>
            )}
          </div>
        </div>

            {/* Autres champs similaires à l'exemple */}
            {/* Réutilisez les champs existants */}
            </div>
        </div>

        <div className="mt-6 flex justify-end">
            <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700"
            >
            {isEditMode ? "Modifier" : "Ajouter"}
            </button>
        </div>
        </form>
    </section>
  );
}