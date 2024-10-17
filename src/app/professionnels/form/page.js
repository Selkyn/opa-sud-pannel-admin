"use client";

import React, { useEffect, useState} from "react";
import axios from "axios";

export default function addProfessionalForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        adress: "",
        city: "",
        postal: "",
        infos: "",
        department: ""
    });

    const [sexes, setSexes] = useState([]);

      // Gestion des changements dans le formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formDataToSend = { ...formData };

        try {
            const response = await axios.post("http://localhost:4000/professionals/add", formDataToSend);
            alert("Centre vétérinaire ajouté avec succès !");

            setFormData({
                name: "",
                email: "",
                adress: "",
                city: "",
                postal: "",
                phone: "",
                infos: "",
                department: ""
            })
        } catch (error) {
            console.error("Erreur lors de l'ajoute du patient :", error);
            alert("Erreur lors de l'ajout du centre vétérinaire.")
        }
    };

    return (
        <>
        <h2 className="text-center text-3xl mt-4">Ajouter un centre Vétérinaire</h2>
        <section className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                Centre vétérinaire
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                htmlFor= "name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nom du centre
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
                                htmlFor= "email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                htmlFor= "adress"
                                className="block text-sm font-medium text-gray-700"
                            >
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
                            <label
                                htmlFor= "city"
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
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                htmlFor= "postal"
                                className="block text-sm font-medium text-gray-700"
                            >
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
                            <label
                                htmlFor= "department"
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
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                htmlFor= "phone"
                                className="block text-sm font-medium text-gray-700"
                            >
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

                    <div>
                        <div>
                            <label
                                htmlFor= "infos"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Infos
                            </label>

                            <textarea
                                type="text"
                                name="infos"
                                id="infos"
                                value={formData.infos}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ajouter le centre vétérinaire
          </button>
        </div>
            </form>
        </section>
        </>
    );
}