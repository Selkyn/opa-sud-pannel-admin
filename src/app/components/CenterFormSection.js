"use client";

import React, { useState, useEffect } from "react";

export default function CenterFormSection({
  formData,
  onInputChange, // Fonction pour synchroniser les changements avec le parent
  centerLabel,
  centerType,
  enableStaff = false,
  staffLabel = "Membre",
  onStaffListChange,
}) {
  const [localData, setLocalData] = useState(formData);
  const [staffList, setStaffList] = useState([
    { firstname: "", lastname: "", email: "", phone: "" }
  ]);

  // Synchroniser localData avec formData au montage ou si formData change de manière significative
  useEffect(() => {
    setLocalData(formData);
  }, [formData]);
  

  // Mise à jour du staffList vers le parent
  useEffect(() => {
    if (onStaffListChange) {
      onStaffListChange(staffList);
    }
  }, [staffList]);

  // Mise à jour des données locales et propagation vers le parent
  const handleLocalInputChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prevData) => ({ ...prevData, [name]: value }));

    if (onInputChange) {
      onInputChange(e);
    }
  };


  const handleStaffChange = (index, e) => {
    const { name, value } = e.target;
    const updatedStaffList = [...staffList];
    updatedStaffList[index][name] = value;
    setStaffList(updatedStaffList);
  };

  const addStaff = () => {
    const updatedStaffList = [...staffList, { firstname: "", lastname: "", email: "", phone: "" }];
    setStaffList(updatedStaffList);
    if (onStaffListChange) onStaffListChange(updatedStaffList); // Transmettre les modifications au parent
  };

  const removeStaff = (index) => {
    const updatedStaffList = [...staffList];
    updatedStaffList.splice(index, 1);
    setStaffList(updatedStaffList);
  };

  

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{centerLabel}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label htmlFor={`name${centerType}`} className="block text-sm font-medium text-gray-700">
      Nom
    </label>
    <input
      type="text"
      name={`name${centerType}`}
      id={`name${centerType}`}
      value={localData[`name${centerType}`] || ''}
      onChange={handleLocalInputChange}
      required
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>

  <div>
    <label htmlFor={`email${centerType}`} className="block text-sm font-medium text-gray-700">
      Email
    </label>
    <input
      type="email"
      name={`email${centerType}`}
      id={`email${centerType}`}
      value={localData[`email${centerType}`] || ''}
      onChange={handleLocalInputChange}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label htmlFor={`adress${centerType}`} className="block text-sm font-medium text-gray-700">
      Adresse
    </label>
    <input
      type="text"
      name={`adress${centerType}`}
      id={`adress${centerType}`}
      value={localData[`adress${centerType}`] || ''}
      onChange={handleLocalInputChange}
      required
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>

  <div>
    <label htmlFor={`city${centerType}`} className="block text-sm font-medium text-gray-700">
      Ville
    </label>
    <input
      type="text"
      name={`city${centerType}`}
      id={`city${centerType}`}
      value={localData[`city${centerType}`] || ''}
      onChange={handleLocalInputChange}
      required
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>

  <div>
    <label htmlFor={`postal${centerType}`} className="block text-sm font-medium text-gray-700">
      Code postal
    </label>
    <input
      type="text"
      name={`postal${centerType}`}
      id={`postal${centerType}`}
      value={localData[`postal${centerType}`] || ''}
      onChange={handleLocalInputChange}
      required
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>

  <div>
    <label htmlFor={`infos${centerType}`} className="block text-sm font-medium text-gray-700">
      infos
    </label>
    <input
      type="text"
      name={`infos${centerType}`}
      id={`infos${centerType}`}
      value={localData[`infos${centerType}`] || ''}
      onChange={handleLocalInputChange}
      required
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
</div>


      {/* Staff Section */}
      {enableStaff && staffList.map((staff, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold mb-4">{staffLabel} {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor={`lastname-${index}`} className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                name="lastname"
                id={`lastname-${index}`}
                value={staff.lastname}
                onChange={(e) => handleStaffChange(index, e)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor={`firstname-${index}`} className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                name="firstname"
                id={`firstname-${index}`}
                value={staff.firstname}
                onChange={(e) => handleStaffChange(index, e)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor={`email-${index}`} className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id={`email-${index}`}
                value={staff.email}
                onChange={(e) => handleStaffChange(index, e)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor={`phone-${index}`} className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="text"
                name="phone"
                id={`phone-${index}`}
                value={staff.phone}
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
                Supprimer {staffLabel.toLowerCase()}
              </button>
            )}
          </div>
        </div>
      ))}

      {enableStaff && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={addStaff}
            className="bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700"
          >
            Ajouter {staffLabel.toLowerCase()}
          </button>
        </div>
      )}
    </div>
  );
}
