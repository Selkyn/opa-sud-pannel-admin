"use client";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import useVetCenterFilters from "./hooks/useVetCenters";
import EntityList from '../components/EntityList';
import api from '@/utils/apiCall';


export default function VetCentersPage () {
    const [vetCenters, setVetCenters] = useState([]);

    const {
    searchTerm,
    setSearchTerm,
    filteredVetCenters,
    handleContactFilterChange,
    selectedContactFilters
    } = useVetCenterFilters(vetCenters);



    const fetchVetCenters = async () => {
        try {
            const response = await api.get("/vet-centers");
            const sortedVetCenters = response.data.sort((a, b) =>
                a.name.localeCompare(b.name)
        );
            setVetCenters(sortedVetCenters);
        } catch (error) {
            console.error("Erreur lors de la récupération des centres vétérinaires", error);
        }
    };
    useEffect(() => {
        fetchVetCenters();
    }, []);

    return (
        <EntityList
            title="Centre vétérinaire"
            data={filteredVetCenters}
            columns={["Nom", "Vétérinaires","Spécialité", "Adresse", "Téléphone", "Email", "Contact"]}
            entityType="centres-veterinaires"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            handleContactFilterChange={handleContactFilterChange}
            selectedContactFilters={selectedContactFilters}
            staffs='vets'
            staffLabel='Vétérinaire'
            callBackend="vet-centers"
            refreshData={fetchVetCenters}
            totalCenters={vetCenters.length}
        />
    );
}
