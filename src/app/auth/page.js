"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";


export default function Auth() {
    const { user, login } = useAuth(); // Utilise la fonction `login` du contexte
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (user) {
          router.push("/");
        }
      }, [user, router]);

    // Fonction pour gérer les modifications dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password); // Appelle la fonction `login` du contexte
            setFormData({ email: "", password: "" }); // Réinitialise le formulaire après connexion
        } catch (error) {
            setErrorMessage(error.message); // Affiche un message d'erreur
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Connexion
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Entrez votre email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Entrez votre mot de passe"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Se connecter
                    </button>
                </form>
                {errorMessage && (
                    <p className="text-red-500 text-sm text-center mt-4">
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
}
