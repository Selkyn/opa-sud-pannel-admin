"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import SearchBar from "./SearchBar";
import CheckboxFilter from "./CheckBoxFilter";
import api from "@/utils/apiCall";
import { DataTable } from "../components/data-table";
import { columnsVet } from "../centres-veterinaires/columnsVet";
import { columnsOsteo } from "../centres-osteopathes/columnsOsteo";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CardCenterList from "./CardCenterList";

export default function EntityList({
  title,
  data,
  columns,
  entityType,
  searchTerm,
  onSearchChange,
  staffs,
  staffLabel,
  callBackend,
  refreshData,
  selectedContactFilters,
  handleContactFilterChange,
  totalCenters,
}) {
  const [contacts, setContacts] = useState([]);
  const [isCardView, setIsCardView] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get("/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la liste des types de contacts"
      );
    }
  };

  const handleContactChange = async (itemId, newContactId) => {
    try {
      await api.put(`/${callBackend}/${itemId}/contact`, {
        contactId: newContactId,
      });
      if (typeof refreshData === "function") {
        refreshData();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  return (
    <div className="container mx-auto py-2 w-full">
      {/* <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2> */}
      <div className="flex justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-col items-center  mb-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
            <span className="rounded-lg bg-green-700 text-white px-2">
              {data.length} / {totalCenters}
            </span>
          </div>
          <section>
            {isCardView ? (
              <div className="flex flex-wrap justify-center gap-4">
                {data.length > 0 ? (
                  data.map((item) => (
                    <CardCenterList
                      key={item.id}
                      data={item}
                      entityType={entityType}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    Aucun patient trouvé
                  </p>
                )}
              </div>
            ) : entityType === "centres-veterinaires" ? (
              <DataTable columns={columnsVet} data={data} />
            ) : entityType === "centres-osteopathes" ? (
              <DataTable columns={columnsOsteo} data={data} />
            ) : null}
          </section>
        </div>
        <div className="w-1/8 space-y-4">
          <div className="flex items-center space-x-3 mb-8">
            <label>Table</label>
            <Switch checked={isCardView} onCheckedChange={setIsCardView} />
            <label>Cards</label>
          </div>
          <Link href={`/${entityType}/form`}>
            <Button className="bg-green-700 hover:bg-green-600">
              Ajouter {title}
            </Button>
          </Link>
          <div className="mt-4 border-2 rounded-lg px-2 pt-2 bg-gray-50">
            <h3 className="font-semibold">Filtres</h3>
            <CheckboxFilter
              title="Relations"
              options={contacts}
              selectedFilters={selectedContactFilters}
              onFilterChange={handleContactFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <CheckboxFilter
        title="Filtrer par type de contact"
        options={contacts}
        selectedFilters={selectedContactFilters}
        onFilterChange={handleContactFilterChange}
      />
      ,
      <div className="mb-6 text-center">
        <Link
          href={`/${entityType}/form`}
          className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
        >
          Ajouter {title}
        </Link>
      </div>
      {entityType === "centres-veterinaires" ? (
        <DataTable columns={columnsVet} data={data} />
      ) : entityType === "centres-osteopathes" ? (
        <DataTable columns={columnsOsteo} data={data} />
      ) : null} */
}

/* <section>
<div className="overflow-x-auto">
  <table className="table-auto w-full text-left bg-white shadow-lg rounded-lg">
    <thead className="bg-green-900 text-white">
      <tr>
        {columns.map((col) => (
          <th key={col} className="px-4 py-2">
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.length > 0 ? (
        data.map((item, index) => (
          <React.Fragment key={item.id}>
            <tr
              className={`${
                index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
              } hover:bg-gray-300 border-b`}
            >
              <td className="px-4 py-4">
                <Link href={`/${entityType}/${item.id}`}>
                  {item.name}
                </Link>
              </td>
              <td className="px-4 py-4">
                {item[staffs] && item[staffs].length > 0 ? (
                  <ul>
                    {item[staffs].map((staff) => (
                      <li key={staff.id}>
                        Dr {staff.firstname} {staff.lastname}
                      </li>
                    ))}
                  </ul>
                ) : (
                  `Aucun ${staffLabel.toLowerCase()}`
                )}
              </td>
              <td>
                <ul>
                  {item.Specialities && item.Specialities.length > 0 ? (
                    item.Specialities.map((speciality) => (
                      <li key={speciality.id}>{speciality.name}</li>
                    ))
                  ) : (
                    <p>Aucune spécialité</p>
                  )}
                </ul>
              </td>
              <td className="px-4 py-4">
                {item.adress}, {item.postal} {item.city}
              </td>
              <td className="px-4 py-4">{item.phone}</td>
              <td className="px-4 py-4">{item.email}</td>
              <td className="px-4 py-4">
                <select
                  value={item.contact ? item.contact.id : ""}
                  onChange={(e) =>
                    handleContactChange(item.id, e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr> */

{
  /* {item.patients && item.patients.length > 0 && (
                                    <tr className="bg-gray-50 border-b">
                                        <td colSpan="5" className="px-4 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {item.patients.map((patient) => (
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
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan="5" className="py-4"></td>
                                </tr> */
}
{
  /* </React.Fragment>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center py-4 text-gray-500">
            `Aucun centre ${staffLabel.toLowerCase()}`
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
</section> */
}
