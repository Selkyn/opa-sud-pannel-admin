"use client";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import useOsteoCenterFilters from "./hooks/useOsteoCenters";
import EntityList from '../components/EntityList';

export default function OsteoCentersPage () {
    const [osteoCenters, setOsteoCenters] = useState([]);

    const {
    searchTerm,
    setSearchTerm,
    filteredOsteoCenters
    } = useOsteoCenterFilters(osteoCenters);

    useEffect(() => {
        fetchOsteoCenters();
    }, []);

    const fetchOsteoCenters = async () => {
        try {
            const response = await axios.get("http://localhost:4000/osteo-centers");
            setOsteoCenters(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des centres vétérinaires", error);
        }
    };

    return (
        <EntityList
            title="Centre ostéopathe"
            data={filteredOsteoCenters}
            columns={["Nom", "Ostéopathes", "Adresse", "Téléphone", "Email", "Contact"]}
            entityType="centres-osteopathes"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            staffs='osteos'
            staffLabel='Ostéopathe'
            callBackend="osteo-centers"
            refreshData={fetchOsteoCenters}
        />
    );
}