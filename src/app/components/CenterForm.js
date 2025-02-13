// src/components/CenterForm.js
"use client";

import { Checkbox, JollyCheckboxGroup } from "@/components/ui/checkbox";
import React, { useState } from "react";

export default function CenterForm({
  centerType, // Type de centre (ex. : veterinary, osteopathy)
  staffLabel, // Label pour les membres du personnel (ex. : Veterinarian, Osteopath)
  onSubmit,
  initialData = {}, // Données initiales pour les champs du formulaire
  isEditing = false,
  specialities,
  selectedSpecialities,
  setSelectedSpecialities,
  formPatient,
  onNewCenterAdded,
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    adress: initialData.adress || "",
    city: initialData.city || "",
    postal: initialData.postal || "",
    infos: initialData.infos || "",
    department: initialData.department || "",
    phone: initialData.phone || "",
  });

  const [localSpecialities, setLocalSpecialities] = useState([]);


  const [staffList, setStaffList] = useState(
    initialData.staff?.map((staff) => ({
      id: staff.id || null,
      firstname: staff.firstname || "",
      lastname: staff.lastname || "",
      email: staff.email || "",
      phone: staff.phone || "",
    })) || [{ firstname: "", lastname: "", email: "", phone: "" }]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, specialityId) => {
    if (isEditing) {
      if (typeof setSelectedSpecialities === "function") {
        setSelectedSpecialities((prev) =>
          e.target.checked
            ? [...prev, specialityId]
            : prev.filter((id) => id !== specialityId)
        );
      }
    } else {
      // Mode création : gérer la sélection en local
      setLocalSpecialities((prev) =>
        e.target.checked
          ? [...prev, specialityId]
          : prev.filter((id) => id !== specialityId)
      );
    }
  };

  const handleStaffChange = (index, e) => {
    const { name, value } = e.target;
    const updatedStaffList = [...staffList];
    updatedStaffList[index][name] = value;
    setStaffList(updatedStaffList);
  };

  
  const addStaff = () => {
    setStaffList([
      ...staffList,
      { firstname: "", lastname: "", email: "", phone: "" },
    ]);
  };

  const removeStaff = (index) => {
    const updatedStaffList = [...staffList];
    updatedStaffList.splice(index, 1);
    setStaffList(updatedStaffList);
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   if (onSubmit) {
  //     onSubmit({ 
  //       ...formData, 
  //       staff: staffList, 
  //       specialities: isEditing ? selectedSpecialities : localSpecialities, });

  //   }
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (onSubmit) {
        try {
            const createdCenter = await onSubmit({ 
                ...formData, 
                staff: staffList,
                ...(centerType === "véterinaire" && { // 🔥 On inclut specialities que pour les vétérinaires
                  specialities: isEditing ? selectedSpecialities : localSpecialities
              })
                
            });

            if (formPatient && createdCenter && typeof onNewCenterAdded === "function") {
                onNewCenterAdded(createdCenter);
            }
        } catch (error) {
            console.error("Erreur lors de la création du centre :", error);
        }
    }
};



  return (
    <>
      <h2 className="text-center text-3xl mt-4">
        {isEditing
          ? `Modifier centre ${centerType}`
          : `Ajouter centre ${centerType}`}
      </h2>
      <section className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
        <h3 className="text-2xl font-semibold mb-6 text-gray-50">
          Centre {centerType.charAt(0).toUpperCase() + centerType.slice(1)}
        </h3>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
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
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="adress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Adresse
                </label>
                <input
                  type="text"
                  name="adress"
                  id="adress"
                  value={formData.adress || ""}
                  onChange={handleInputChange}
                  required
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
                  value={formData.city || ""}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="postal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code postal
                </label>
                <input
                  type="text"
                  name="postal"
                  id="postal"
                  value={formData.postal || ""}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Téléphone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="infos"
                  className="block text-sm font-medium text-gray-700"
                >
                  Infos
                </label>
                <input
                  type="text"
                  name="infos"
                  id="infos"
                  value={formData.infos || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* <div>
                            <label htmlFor="speciality" className="block text-sm font-medium text-gray-700">
                                Spécialités
                            </label>
                            <select
                                name="speciality"
                                id="speciality"
                                value={formData.specialities}
                                onChange={handleInputChange}
                            >
                                <option value="">Aucune</option>
                                {specialities.map((speciality) => (
                                    <option key={speciality.id} value={speciality.id}>
                                        {speciality.name}
                                    </option>
                                ))}

                            </select>
                        </div> */}
              {/* {specialities ? (
                <JollyCheckboxGroup
                  label="Spécialités"
                  value={formData.specialities || []}
                  onChange={(values) =>
                    setFormData({ ...formData, specialities: values })
                  }
                //   defaultValue={selectedSpecialities.includes(specialities.map((speciality) => (sp)}
                  
                >
                  <div className="grid grid-cols-2">
                    {specialities.map((speciality) => (
                      <Checkbox
                        // className="w-fit flex mb-2 rounded-md border border-[#e0e0e0] bg-white py-2 px-2 text-base font-medium text-[#07074D] outline-none focus:border-[#3766AB] focus:shadow-md"
                        key={speciality.id}
                        value={speciality.id}
                        isSelected={selectedSpecialities.includes(speciality.id)}
                        
                      >
                        {speciality.name}
                      </Checkbox>
                    ))}
                  </div>
                </JollyCheckboxGroup>
              ) : (
                ""
              )} */}
            </div>

            {specialities && specialities.length > 0 ? (
              <div className="mb-5">
                <h4 className="text-xl text-gray-700 mb-4">
                  Sépcialités du centre :
                </h4>
                {specialities.map((speciality) => (
                  <div key={speciality.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={speciality.id}
                      name="specialities"
                      value={speciality.id}
                      checked={isEditing ? selectedSpecialities?.includes(speciality.id) : localSpecialities.includes(speciality.id)}
                      onChange={(e) => handleCheckboxChange(e, speciality.id)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label
                      htmlFor={speciality.id}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {speciality.name}
                    </label>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Staff Section */}
            {staffList.map((staff, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md mt-6"
              >
                <h3 className="text-xl font-semibold mb-4">
                  {staffLabel} {index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor={`lastname-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      id={`lastname-${index}`}
                      value={staff.lastname || ""}
                      onChange={(e) => handleStaffChange(index, e)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`firstname-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      id={`firstname-${index}`}
                      value={staff.firstname || ""}
                      onChange={(e) => handleStaffChange(index, e)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`email-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id={`email-${index}`}
                      value={staff.email || ""}
                      onChange={(e) => handleStaffChange(index, e)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`phone-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Téléphone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id={`phone-${index}`}
                      value={staff.phone || ""}
                      onChange={(e) => handleStaffChange(index, e)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeStaff(index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
                    >
                      Enlever {staffLabel.toLowerCase()}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={addStaff}
                className="bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700"
              >
                Ajouter un {staffLabel.toLowerCase()}
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing
                ? `Modifier centre ${centerType}`
                : `Ajouter centre ${centerType}`}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
