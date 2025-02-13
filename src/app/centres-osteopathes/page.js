"use client";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import useOsteoCenterFilters from "./hooks/useOsteoCenters";
import EntityList from '../components/EntityList';
import api from '@/utils/apiCall';


export default function OsteoCentersPage () {
    const [osteoCenters, setOsteoCenters] = useState([]);

    const {
    searchTerm,
    setSearchTerm,
    filteredOsteoCenters,
    handleContactFilterChange,
    selectedContactFilters
    } = useOsteoCenterFilters(osteoCenters);



    const fetchOsteoCenters = async () => {
        try {
            const response = await api.get("/osteo-centers");
            setOsteoCenters(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des centres vétérinaires", error);
        }
    };

    useEffect(() => {
        fetchOsteoCenters();
    }, []);

    return (
        <EntityList
            title="Centre ostéopathe"
            data={filteredOsteoCenters}
            columns={["Nom", "Ostéopathes", "Adresse", "Téléphone", "Email", "Contact"]}
            entityType="centres-osteopathes"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            handleContactFilterChange={handleContactFilterChange}
            selectedContactFilters={selectedContactFilters}
            staffs='osteos'
            staffLabel='Ostéopathe'
            callBackend="osteo-centers"
            refreshData={fetchOsteoCenters}
            totalCenters={osteoCenters.length}
        />
    );
}