"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";

import CenterForm from "./CenterForm";
import api from "@/utils/apiCall";
import { select } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function PatientForm({
  initialData,
  sexes,
  animalTypes,
  races,
  limbs,
  vetCenters,
  osteoCenters,
  vetStaffList,
  osteoStaffList,
  specialities,
  onSubmit,
  isEditing,
  submitVetCenter,
  formDataVetCenter,
  submitOsteoCenter,
  formDataOsteoCenter,
  vets,
  osteos,
  patientId,
}) {
  const form = useForm({
    defaultValues: initialData || {
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
      vetCenters: [],
      osteoCenters: [],
      limbs: [],
      vets: [],
      osteos: [],
    },
  });

  const [showCustomAnimalType, setShowCustomAnimalType] = useState(false);
  const [showCustomRace, setShowCustomRace] = useState(false);
  const [disabledRace, setDisabledRace] = useState(true);

  //   const handleSubmit = (values) => {
  //     console.log("Form values:", values);
  //     onSubmit(values);
  //   };

  const router = useRouter();

  useEffect(() => {
    if (initialData && isEditing) {
      // console.log("Données rechargées dans le formulaire:", initialData); // 🔥 Debug
      // console.log("Valeur sexId avant reset :", initialData.sexId);
      // console.log(
      //   "Valeur animalTypeId avant reset :",
      //   initialData.animalTypeId
      // );
      // console.log("Valeur raceId avant reset :", initialData.raceId);

      form.reset({
        ...initialData,
        sexId: String(initialData.sexId || ""), // 🔥 Assure que sexId est bien un string
        clientSexId: String(initialData.clientSexId || ""),
        animalTypeId: String(initialData.animalTypeId || ""),
        raceId: String(initialData.raceId || ""),
      });
    }
  }, [initialData, isEditing, form]);

  const checkClientEmail = async (email) => {
    try {
      const response = await api.get(`/clients/email/${email}`);
      if (response.data) {
        const clientData = response.data; // Les informations du client récupérées

        form.setValue("firstname", clientData.firstname || "");
        form.setValue("lastname", clientData.lastname || "");
        form.setValue("phone", clientData.phone || "");
        form.setValue("adress", clientData.adress || "");
        form.setValue("city", clientData.city || "");
        form.setValue("postal", clientData.postal || "");
        form.setValue("department", clientData.department || "");
        form.setValue("clientSexId", clientData.sexId || "");

        alert("Les informations du client ont été préremplies.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email :", error);
      alert("Aucun client trouvé avec cet email.");
    }
  };

  const handleSubmit = async (values) => {
    let formDataToSend = {
      ...values,
      vets: vetStaffList, // Liste des vétérinaires
      osteos: osteoStaffList, // Liste des ostéopathes
      vetCenters: values.vetCenters.map((center) => {
        if (typeof center === "object" && center.id === "other") {
          return {
            ...center,
            specialities: center.specialities || [],
          };
        }
        return {
          id: center.id,
          selectedSpecialities: center.selectedSpecialities || [],
        };
      }),
      osteoCenters: values.osteoCenters.map(({ id }) => ({ id })), // Liste des centres ostéopathiques
    };

    // 🔥 Si l'utilisateur a choisi "Autre" pour le type d'animal, gérer `customAnimalType`
    if (values.animalTypeId === "other") {
      formDataToSend.animalTypeId = null; // Mettre à null car on utilise customAnimalType
      formDataToSend.customAnimalType = values.customAnimalType;
    }

    // 🔥 Si l'utilisateur a choisi "Autre" pour la race, gérer `customRace`
    if (values.raceId === "other") {
      formDataToSend.raceId = null; // Mettre à null car on utilise customRace
      formDataToSend.customRace = values.customRace;
    }

    try {
      let response;
      if (isEditing) {
        console.log("🚀 Données envoyées :", JSON.stringify(formDataToSend, null, 2));

        response = await api.put(`/patients/${patientId}/edit`, formDataToSend);
        alert("Patient modifié avec succès !");
        router.push(`/patients/${patientId}`);
      } else {
        response = await api.post("/patients/add", formDataToSend);
        alert("Patient ajouté avec succès !");
      }

      // 🔥 Réinitialiser le formulaire
      form.reset({
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
        vetCenters: [],
        osteoCenters: [],
        limbs: [],
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient :", error);
      alert("Erreur lors de l'ajout du patient. Veuillez réessayer.");
    }
  };

  // 🔥 Observer les valeurs dynamiquement
  const selectedAnimalType = form.watch("animalTypeId");
  const selectedRace = form.watch("raceId");
  // {
  //   console.log("Valeur actuelle de limbs:", form.watch("limbs"));
  // }

  // 🔹 Trouver les races correspondantes directement en fonction du type d'animal sélectionné
  const filteredRaces = selectedAnimalType
    ? animalTypes.find((animal) => String(animal.id) === selectedAnimalType)
        ?.races || []
    : [];

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     form.setValue(name, value); // 🔥 Mettre à jour la valeur directement

  //     // Gérer le champ "Autre" pour le type d'animal
  //     if (name === "animalTypeId") {
  //       if (value === "other") {
  //         // 🔥 Réinitialiser les races et activer le champ personnalisé
  //         form.setValue("raceId", "");
  //         form.setValue("customAnimalType", "");
  //         form.setValue("customRace", "");
  //       } else if (value === "") {
  //         // 🔥 Désactiver tout si rien n'est sélectionné
  //         form.setValue("raceId", "");
  //         form.setValue("customAnimalType", "");
  //         form.setValue("customRace", "");
  //       } else {
  //         // 🔥 Mettre à jour les races en fonction du type
  //         updateRaceOptions(value);
  //         form.setValue("raceId", "");
  //         form.setValue("customAnimalType", null);
  //         form.setValue("customRace", null);
  //       }
  //     }

  //     if (name === "raceId" && value === "other") {
  //       // 🔥 Afficher le champ personnalisé pour la race
  //       form.setValue("customRace", "");
  //     } else if (name === "raceId") {
  //       form.setValue("customRace", null); // Cacher le champ
  //     }
  //   };

  // 🔹 Ajouter un centre vétérinaire à la liste
  const addVetCenter = () => {
    const currentCenters = form.getValues("vetCenters") || [];
    form.setValue("vetCenters", [
      ...currentCenters,
      { id: "", selectedSpecialities: [], isActive: true },
    ]);
  };

  // 🔹 Ajouter un centre osteopathe à la liste
  const addOsteoCenter = () => {
    const currentCenters = form.getValues("osteoCenters") || [];
    form.setValue("osteoCenters", [...currentCenters, { id: "" }]);
  };

  // 🔹 Supprimer un centre vétérinaire
  const removeVetCenter = (index) => {
    const updatedCenters = form
      .getValues("vetCenters")
      .filter((_, i) => i !== index);
    form.setValue("vetCenters", updatedCenters);
  };

  // 🔹 Supprimer un centre osteopathe
  const removeOsteoCenter = (index) => {
    const updatedCenters = form
      .getValues("osteoCenters")
      .filter((_, i) => i !== index);
    form.setValue("osteoCenters", updatedCenters);
  };

  const updateVetCenter = (index, field, value) => {
    const currentVetCenters = form.getValues("vetCenters") || [];
  
    if (field === "id") {
      const selectedCenter = vetCenters.find((vet) => vet.id === parseInt(value));
      currentVetCenters[index] = {
        id: value,
        Specialities: selectedCenter ? selectedCenter.Specialities : [],
        selectedSpecialities: [], 
      };
    } else if (field === "selectedSpecialities") {

  
      currentVetCenters[index].selectedSpecialities = [...value]; // 🔥 Toujours un tableau
  
    } else {
      if (typeof currentVetCenters[index] === "object") {
        currentVetCenters[index][field] = value;
      }
    }
  
    form.setValue("vetCenters", [...currentVetCenters]); // 🔥 Forcer une copie pour maj React
  };
  

  //update osteo center
  const updateOsteoCenter = (index, field, value) => {
    const currentOsteoCenters = form.getValues("osteoCenters") || [];

    if (field === "id") {
      // 🔥 Trouver le centre sélectionné dans la liste `osteoCenters`
      const selectedCenter = osteoCenters.find(
        (osteo) => osteo.id === parseInt(value)
      );

      currentOsteoCenters[index] = {
        id: value,
      };
    } else {
      // Modifier simplement le champ concerné
      if (typeof currentOsteoCenters[index] === "object") {
        currentOsteoCenters[index][field] = value;
      }
    }

    // 🔥 Mettre à jour le formulaire avec `form.setValue`
    form.setValue("osteoCenters", currentOsteoCenters);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informations du patient
          </h3>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Nom obligatoire" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du patient" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthYear"
              rules={{ required: "Année de naissance obligatoire" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année de naissance *</FormLabel>
                  <FormControl>
                    <Input placeholder="Année de naissance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🔹 Poids */}
            <FormField
              control={form.control}
              name="weight"
              rules={{ required: "Poids obligatoire" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poids *</FormLabel>
                  <FormControl>
                    <Input placeholder="Poids" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🔹 Sélection du sexe */}
            <FormField
              control={form.control}
              name="sexId"
              rules={{ required: "Veuillez choisir un sexe" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexe *</FormLabel>
                  <Select
                    key={String(field.value || "default")}
                    onValueChange={(val) => {
                      // console.log("FFFFF", val);
                      field.onChange(val);
                    }}
                    value={String(field.value || "default")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un sexe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sexes.map((sex) => (
                        <SelectItem key={sex.id} value={String(sex.id)}>
                          {sex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🔹 Sélection du type d'animal */}
            <FormField
              control={form.control}
              name="animalTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'animal</FormLabel>
                  <Select
                    key={String(field.value || "default")}
                    onValueChange={(val) => {
                      field.onChange(val === "none" ? null : val); // 🔥 Met à null si "none" est choisi
                      form.setValue("raceId", null); // 🔥 Réinitialiser la race
                    }}
                    value={String(field.value || "none")} // 🔥 Si null, afficher "none"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>{" "}
                      {/* ✅ Permet de réinitialiser */}
                      {animalTypes.map((animalType) => (
                        <SelectItem
                          key={animalType.id}
                          value={String(animalType.id)}
                        >
                          {animalType.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* 🔹 Champ personnalisé si "Autre" est sélectionné */}
            {selectedAnimalType === "other" && (
              <FormField
                control={form.control}
                name="customAnimalType"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Entrez le type d'animal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Chien, Chat..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* 🔹 Sélection de la race */}
            <FormField
              control={form.control}
              name="raceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Race</FormLabel>
                  <Select
                    key={String(field.value || "default")}
                    onValueChange={(val) =>
                      field.onChange(val === "none" ? null : val)
                    }
                    value={String(field.value || "none")}
                    disabled={
                      !selectedAnimalType || selectedAnimalType === "other"
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une race" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>{" "}
                      {/* ✅ Réinitialisation */}
                      {filteredRaces.map((race) => (
                        <SelectItem key={race.id} value={String(race.id)}>
                          {race.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* 🔹 Champ personnalisé pour la race */}
            {(selectedRace === "other" || selectedAnimalType === "other") && (
              <FormField
                control={form.control}
                name="customRace"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Entrez la race</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Husky, Chartreux..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="limbs"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Sélectionnez des membres</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {limbs.map((limb) => (
                      <div
                        key={limb.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`limb-${limb.id}`}
                          value={limb.id}
                          checked={(field.value || []).includes(limb.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const currentValues = field.value || [];
                            const newValues = checked
                              ? [...currentValues, limb.id] // Ajout
                              : currentValues.filter((id) => id !== limb.id); // Suppression

                            field.onChange(newValues);
                          }}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`limb-${limb.id}`}>{limb.name}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🔹 pathologie */}
            <FormField
              control={form.control}
              name="pathology"
              //   rules={{ required: "Poids obligatoire" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pathologie</FormLabel>
                  <FormControl>
                    <Input placeholder="Pathologie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informations du client
          </h3>

          <div className="flex flex-col gap-4">
            {/* 🔹 Sélection du sexe */}
            <FormField
              control={form.control}
              name="clientSexId"
              rules={{ required: "Veuillez choisir un sexe" }}
              render={({ field }) => (
                <FormItem className="w-1/4">
                  <FormLabel>Sexe *</FormLabel>
                  <Select
                    key={String(field.value || "default")}
                    onValueChange={(val) => field.onChange(val)}
                    value={String(field.value || "default")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sexe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sexes.map((sex) => (
                        <SelectItem key={sex.id} value={String(sex.id)}>
                          {sex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <FormField
                control={form.control}
                name="firstname"
                rules={{ required: "Prénom obligatoire" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Prénom du patient"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                rules={{ required: "Nom obligatoire" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom du patient"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email obligatoire" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email du patient"
                        {...field}
                        onBlur={() => checkClientEmail(field.value)} // 🔥 Vérifie l'email quand on quitte le champ
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Téléphone obligatoire" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone du patient" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              controle={form.control}
              name="adress"
              rules={{ required: "Adresse obligatoire" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse *</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse du patient" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <FormField
                controle={form.control}
                name="postal"
                rules={{ required: "Code postal obligatoire" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal *</FormLabel>
                    <FormControl>
                      <Input placeholder="Code postal du patient" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                controle={form.control}
                name="city"
                rules={{ required: "Ville obligatoire" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville du patient" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* CENTRES VÉTÉRINAIRES */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Centres vétérinaires
          </h3>

          {form.watch("vetCenters").map((center, index) => (
            <div
              key={center.id || index}
              className={"mb-4 border-2 p-4 rounded-lg shadow-sm"}
            >
              {/* 🔥 Afficher un message si le centre est inactif */}
              {!center.isActive && isEditing && (
                <p className="text-red-500 text-sm mt-2">
                  ⚠️ Ancien Centre
                </p>
              )}
              <div className="flex gap-4 justify-between">
                <select
                  value={typeof center === "string" ? center : center.id}
                  onChange={(e) => updateVetCenter(index, "id", e.target.value)}
                  className="block w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Sélectionnez un centre vétérinaire</option>
                  {vetCenters.map((vetCenter) => (
                    <option key={vetCenter.id} value={vetCenter.id}>
                      {vetCenter.name} à {vetCenter.city}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => removeVetCenter(index)}
                  className="mt-2 text-red-500"
                >
                  ❌
                </button>
              </div>

              {/* 🔥 Afficher un message si le centre est inactif */}
              {/* {!center.isActive && isEditing && (
                <p className="text-red-500 text-sm mt-2">
                  ⚠️ Ce centre est désactivé
                </p>
              )} */}

              {center.Specialities && center.Specialities.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-gray-700 font-medium">
                    Spécialités disponibles :
                  </h4>
                  {center.Specialities.map((spec) => (
                    <label
                      key={spec.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={(center.selectedSpecialities || []).includes(
                          spec.id
                        )}
                        onChange={(e) => {
                          const updatedSelectedSpecialities = e.target.checked
                            ? [...(center.selectedSpecialities || []), spec.id]
                            : (center.selectedSpecialities || []).filter(
                                (id) => id !== spec.id
                              );

                          updateVetCenter(
                            index,
                            "selectedSpecialities",
                            updatedSelectedSpecialities
                          );
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>{spec.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Bouton pour ajouter un centre */}
          <div className="flex  items-center justify-between">
            <button
              type="button"
              onClick={addVetCenter}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              + Associer un centre vétérinaire
            </button>

            <Dialog>
              <DialogTrigger className="mt-4 p-2 bg-green-700 hover:bg-green-600 rounded-md text-white">
                Ajouter un nouveau centre vétérinaire
              </DialogTrigger>

              <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
                <CenterForm
                  centerType="vétérinaire"
                  staffLabel="Vétérinaire"
                  initialData={{ ...formDataVetCenter, staff: vets }}
                  enableSubmitBtn={true}
                  onSubmit={submitVetCenter}
                  isEditing={false}
                  specialities={specialities}
                  formPatient={true}
                  // onNewCenterAdded={handleNewVetCenterAdded}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* CENTRES Osteopathe */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Centres ostéopathes
          </h3>

          {form.watch("osteoCenters").map((center, index) => (
            <div
              key={center.id || index}
              className="mb-4 border-2 border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50"
            >
              {/* Sélection du centre */}
              <div className="flex gap-4 justify-items-center">
                <select
                  value={typeof center === "string" ? center : center.id}
                  onChange={(e) =>
                    updateOsteoCenter(index, "id", e.target.value)
                  }
                  className="block w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Sélectionnez un centre vétérinaire</option>
                  {osteoCenters.map((osteoCenter) => (
                    <option key={osteoCenter.id} value={osteoCenter.id}>
                      {osteoCenter.name} à {osteoCenter.city}
                    </option>
                  ))}
                  <option value="other">Autre</option>
                </select>

                {/* Bouton pour supprimer le centre */}
                <button
                  type="button"
                  onClick={() => removeOsteoCenter(index)}
                  className="mt-2 text-red-500"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}

          {/* Bouton pour ajouter un centre */}
          <div className="flex  items-center justify-between">
            <button
              type="button"
              onClick={addOsteoCenter}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              + Associer un centre ostéopathe
            </button>

            <Dialog>
              <DialogTrigger className="mt-4 p-2 bg-green-700 hover:bg-green-600 rounded-md text-white">
                Ajouter un nouveau centre ostéopathe
              </DialogTrigger>

              <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
                <CenterForm
                  centerType="ostéopathe"
                  staffLabel="Ostéopathe"
                  initialData={{ ...formDataOsteoCenter, staff: osteos }}
                  enableSubmitBtn={true}
                  onSubmit={submitOsteoCenter}
                  isEditing={false}
                  formPatient={true}
                  // onNewCenterAdded={handleNewVetCenterAdded}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Button type="submit" className="mt-4 bg-green-700">
          {isEditing ? "Modifier le patient" : "Ajouter le patient"}
        </Button>
      </form>
    </Form>
  );
}
