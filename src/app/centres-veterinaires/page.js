// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import axios from 'axios';
// import { capitalizeFirstLetter } from '../utils/stringUtils';
// import SearchBar from '../components/SearchBar';
// import useVetCenterFilters from './hooks/useVetCenters';

// export default function VetCentersPage() {
//     const [vetCenters, setVetCenters] = useState([]);

//     const {
//         searchTerm,
//         setSearchTerm,
//         filteredVetCenters
//       } = useVetCenterFilters(vetCenters);
    
//       useEffect(() => {
//         fetchVetCenters();
//       }, []);
    
//       const fetchVetCenters = async () => {
//         try {
//           const response = await axios.get("http://localhost:4000/vet-centers");
//           setVetCenters(response.data);
//         } catch (error) {
//           console.error("Erreur lors de la récupération des centres vétérinaires", error);
//         }
//       };


//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Centre vétérinaire</h2>

//             <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm}/>

        
//             <div className="mb-6 text-center">
//                 <Link href="/centres-veterinaires/form" className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
//                     Ajouter un centre vétérinaire
//                 </Link>
//             </div>

//             <section>
//     <div className="overflow-x-auto">
//         <table className="table-auto w-full text-left bg-white shadow-lg rounded-lg">
//             <thead className="bg-green-900 text-white">
//                 <tr>
//                     <th className="px-4 py-2">Centre vétérinaire</th>
//                     <th className="px-4 py-2">Vétérinaires</th>
//                     <th className="px-4 py-2">Adresse</th>
//                     <th className="px-4 py-2">Téléphone</th>
//                     <th className="px-4 py-2">Email</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {filteredVetCenters.length > 0 ? (
//                     filteredVetCenters.map((vetCenter, index) => (
//                         <React.Fragment key={vetCenter.id}>
//                             <tr 
//                                 className={`${
//                                     index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
//                                 } hover:bg-gray-300 border-b`}
//                             >
//                                 <td className="px-4 py-4">
//                                     <Link href={`/centres-veterinaires/${vetCenter.id}`}>
//                                     {capitalizeFirstLetter(vetCenter.name)}
//                                     </Link>
//                                 </td>
//                                 <td className="px-4 py-4">
//                                     {vetCenter.vets && vetCenter.vets.length > 0 ? (
//                                         <ul>
//                                             {vetCenter.vets.map((vet) => (
//                                                 <li key={vet.id}>
//                                                     Dr {capitalizeFirstLetter(vet.firstname)} {capitalizeFirstLetter(vet.lastname)}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     ) : (
//                                         "Aucun vétérinaire"
//                                     )}
//                                 </td>
//                                 <td className="px-4 py-4">{vetCenter.adress}, {vetCenter.postal} {capitalizeFirstLetter(vetCenter.city)}</td>
//                                 <td className="px-4 py-4">{vetCenter.phone}</td>
//                                 <td className="px-4 py-4">{vetCenter.email}</td>
//                             </tr>
//                             {vetCenter.patients && vetCenter.patients.length > 0 && (
//                                 <tr className="bg-gray-50 border-b">
//                                     <td colSpan="5" className="px-4 py-4">
//                                         <div className="flex flex-wrap gap-2">
//                                             {vetCenter.patients.map((patient) => (
//                                                 <Link key={patient.id} href={`/patients/${patient.id}`}>
//                                                     {patient.sex.name === "male" ? (
//                                                         <button className="bg-blue-500 text-white px-2 py-2 rounded-md mb-2">
//                                                             {patient.name}
//                                                         </button>
//                                                     ) : (
//                                                         <button className="bg-pink-500 text-white px-2 py-2 rounded-md mb-2">
//                                                             {patient.name}
//                                                         </button>
//                                                     )}
//                                                 </Link>
//                                             ))}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                             <tr>
//                                 <td colSpan="5" className="py-4"></td>
//                             </tr>
//                         </React.Fragment>
//                     ))
//                 ) : (
//                     <tr>
//                         <td colSpan="5" className="text-center py-4 text-gray-500">Aucun centre vétérinaire trouvé</td>
//                     </tr>
//                 )}
//             </tbody>
//         </table>
//     </div>
// </section>

//         </div>
//     );
// }

"use client";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import useVetCenterFilters from "./hooks/useVetCenters";
import EntityList from '../components/EntityList';

export default function VetCentersPage () {
    const [vetCenters, setVetCenters] = useState([]);

    const {
    searchTerm,
    setSearchTerm,
    filteredVetCenters,
    handleContactFilterChange,
    selectedContactFilters
    } = useVetCenterFilters(vetCenters);

    useEffect(() => {
        fetchVetCenters();
    }, []);

    const fetchVetCenters = async () => {
        try {
            const response = await axios.get("http://localhost:4000/vet-centers");
            setVetCenters(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des centres vétérinaires", error);
        }
    };

    return (
        <EntityList
            title="Centre vétérinaire"
            data={filteredVetCenters}
            columns={["Nom", "Vétérinaires", "Adresse", "Téléphone", "Email", "Contact"]}
            entityType="centres-veterinaires"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            handleContactFilterChange={handleContactFilterChange}
            selectedContactFilters={selectedContactFilters}
            staffs='vets'
            staffLabel='Vétérinaire'
            callBackend="vet-centers"
            refreshData={fetchVetCenters}
        />
    );
}
