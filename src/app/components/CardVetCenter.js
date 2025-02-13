//src/app/components/CardVetCenter.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import api from "@/utils/apiCall";

const CardVetCenter = ({ params }) => {
  const { id } = params;
  const [vetCenter, setVetCenter] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (id) {
      fetchVetCenterDetails();
      fetchContacts();
    }
  }, [id]);

  const fetchVetCenterDetails = async () => {
    try {
      const response = await api.get(`/vet-centers/${id}`);
      setVetCenter(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du centre vétérinaire"
      );
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get("/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts");
    }
  };

  const handleContactChange = async (vetCenterId, newContactId) => {
    try {
      await api.put(`/vet-centers/${vetCenterId}/contact`, {
        contactId: newContactId,
      });
      fetchVetCenterDetails();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {vetCenter ? (
        <div className="flex flex-col gap-4">
          <div>
            <Link
              key={vetCenter.id}
              href={`/centres-veterinaires/${vetCenter.id}`}
            >
              <h3 className="text-4xl font-bold text-gray-800 mb-4">
                {vetCenter.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-gray-700 font-medium">Relation en cours :</p>
              <select
                value={vetCenter.contact ? vetCenter.contact.id : ""}
                onChange={(e) => handleContactChange(vetCenter.id, e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200"
              >
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
            </div>
            <p>
              {vetCenter.adress}, {vetCenter.city}
            </p>
            <p>Téléphone : {vetCenter.phone}</p>
            <p>Email : {vetCenter.email}</p>
            <p>Infos : {vetCenter.infos}</p>
          </div>
          <div>
            Liste des vétérinaires :
            {vetCenter.vets && vetCenter.vets.length > 0 ? (
              <ul>
                {vetCenter.vets.map((vet) => (
                  <li className="mt-8" key={vet.id}>
                    Dr {vet.firstname} {vet.lastname}
                    <ul>
                      <li>Email : {vet.email}</li>
                      <li>Téléphone: {vet.phone}</li>
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              "Aucun vétérinaire"
            )}
          </div>
          <div>
            <p>Listes des patients :</p>
            {vetCenter.Patients && vetCenter.Patients.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {vetCenter.Patients.map((patient) => (
                  <Link key={patient.id} href={`/patients/${patient.id}`}>
                    {patient.sex.name === "male" ? (
                      <button className="bg-blue-500 text-white px-2 py-2 rounded-md mb-2">
                        {patient.name}
                      </button>
                    ) : (
                      <button className="bg-pink-500 text-white px-2 py-2 rounded-md mb-2">
                        {patient.name}
                      </button>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Centre vétérinaire introuvable</p>
      )}
    </div>
  );
};

export default CardVetCenter;
