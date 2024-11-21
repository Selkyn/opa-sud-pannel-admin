// src/components/CenterForm.js
"use client";

import React, { useState } from "react";

export default function CenterForm({
    centerType,  // Type de centre (ex. : veterinary, osteopathy)
    staffLabel, // Label pour les membres du personnel (ex. : Veterinarian, Osteopath)
    onSubmit,
    enableSubmitBtn = false,                    // Fonction de soumission du formulaire
    initialData = {},            // Données initiales pour les champs du formulaire
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postal: "",
        infos: "",
        department: "",
        phone: "",
        ...initialData
    });

    const [staffList, setStaffList] = useState(initialData.staff || [
        { firstname: "", lastname: "", email: "" }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleStaffChange = (index, e) => {
        const { name, value } = e.target;
        const updatedStaffList = [...staffList];
        updatedStaffList[index][name] = value;
        setStaffList(updatedStaffList);
    };

    const addStaff = () => {
        setStaffList([...staffList, { firstname: "", lastname: "", email: "" }]);
    };

    const removeStaff = (index) => {
        const updatedStaffList = [...staffList];
        updatedStaffList.splice(index, 1);
        setStaffList(updatedStaffList);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({ ...formData, staff: staffList });
        }
    };

    return (
        <>
        <h2 className="text-center text-3xl mt-4">Ajouter centre {centerType}</h2>
        <section className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                Centre {centerType.charAt(0).toUpperCase() + centerType.slice(1)}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
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
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="adress" className="block text-sm font-medium text-gray-700">
                                Adresse
                            </label>
                            <input
                                type="text"
                                name="adress"
                                id="adress"
                                value={formData.adress}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                Ville
                            </label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="postal" className="block text-sm font-medium text-gray-700">
                                Code postal
                            </label>
                            <input
                                type="text"
                                name="postal"
                                id="postal"
                                value={formData.postal}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Téléphone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Staff Section */}
                    {staffList.map((staff, index) => (
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
                                        Remove {staffLabel.toLowerCase()}
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
                            Add {staffLabel.toLowerCase()}
                        </button>
                    </div>
                </div>
                {enableSubmitBtn && (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Submit {centerType} Center
                        </button>
                    </div>
                )}

            </form>
        </section>
        </>
    );
}
