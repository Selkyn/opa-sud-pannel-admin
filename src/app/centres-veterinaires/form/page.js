// "use client";

// import React, { useEffect, useState} from "react";
// import axios from "axios";
// import CenterForm from "@/app/components/CenterForm";

// export default function addVetCenterForm() {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         adress: "",
//         city: "",
//         postal: "",
//         infos: "",
//         department: "",
//         phone: ""

//     });

//     const [vets, setVets] = useState([
//         { firstnameVet: "", lastnameVet: "", emailVet: "" }
//     ]);

//       // Gestion des changements dans le formulaire
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     }

//     const handleVetChange = (index, e) => {
//         const { name, value } = e.target;
//         const updatedVets = [...vets];
//         updatedVets[index][name] = value;
//         setVets(updatedVets);
//     };

//     // Ajouter un vétérinaire
//     const addVet = () => {
//         setVets([...vets, { firstnameVet: "", lastnameVet: "", emailVet: "" }]);
//     };

//     // Supprimer un vétérinaire
//     const removeVet = (index) => {
//         const updatedVets = [...vets];
//         updatedVets.splice(index, 1);
//         setVets(updatedVets);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         let formDataToSend = { ...formData, vets };

//         try {
//             const response = await axios.post("http://localhost:4000/vet-centers/add", formDataToSend);
//             alert("Centre vétérinaire ajouté avec succès !");

//             setFormData({
//                 name: "",
//                 email: "",
//                 adress: "",
//                 city: "",
//                 postal: "",
//                 phone: "",
//                 infos: "",
//                 department: "",

//             })
//             setVets([{ firstnameVet: "", lastnameVet: "", emailVet: "" }]); 
//         } catch (error) {
//             console.error("Erreur lors de l'ajoute du patient :", error);
//             alert("Erreur lors de l'ajout du centre vétérinaire.")
//         }
//     };


//     return (
//         <>
//         <h2 className="text-center text-3xl mt-4">Ajouter un centre Vétérinaire</h2>
//         <section className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
//             <h3 className="text-2xl font-semibold mb-6 text-gray-800">
//                 Centre vétérinaire
//             </h3>

//             <form onSubmit={handleSubmit} className="space-y-8">
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label
//                                 htmlFor= "name"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Nom du centre
//                             </label>

//                             <input
//                                 type="text"
//                                 name="name"
//                                 id="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                         </div>
//                         <div>
//                             <label
//                                 htmlFor= "email"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Email
//                             </label>

//                             <input
//                                 type="email"
//                                 name="email"
//                                 id="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange}
//                                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label
//                                 htmlFor= "adress"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Adresse
//                             </label>

//                             <input
//                                 type="text"
//                                 name="adress"
//                                 id="adress"
//                                 value={formData.adress}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                         </div>
//                         <div>
//                             <label
//                                 htmlFor= "city"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Ville
//                             </label>

//                             <input
//                                 type="text"
//                                 name="city"
//                                 id="city"
//                                 value={formData.city}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label
//                                 htmlFor= "postal"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Code postal
//                             </label>

//                             <input
//                                 type="text"
//                                 name="postal"
//                                 id="postal"
//                                 value={formData.postal}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                         </div>
//                         <div>
//                             <label
//                                 htmlFor= "department"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Département
//                             </label>

//                             <input
//                                 type="text"
//                                 name="department"
//                                 id="department"
//                                 value={formData.department}
//                                 onChange={handleInputChange}
//                                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label
//                                 htmlFor= "phone"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Téléphone
//                             </label>

//                             <input
//                                 type="text"
//                                 name="phone"
//                                 id="phone"
//                                 value={formData.phone}
//                                 onChange={handleInputChange}
//                                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <div>
//                             <label
//                                 htmlFor= "infos"
//                                 className="block text-sm font-medium text-gray-700"
//                             >
//                                 Infos
//                             </label>

//                             <textarea
//                                 type="text"
//                                 name="infos"
//                                 id="infos"
//                                 value={formData.infos}
//                                 onChange={handleInputChange}
//                                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             />
//                         </div>
//                     </div>
//                 </div>
//                     {/* Section pour les vétérinaires */}
//                     {vets.map((vet, index) => (
//                         <div key={index} className="bg-white p-6 rounded-lg shadow-md mt-6">
//                             <h3 className="text-xl font-semibold mb-4">Vétérinaire {index + 1}</h3>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label htmlFor={`lastnameVet-${index}`} className="block text-sm font-medium text-gray-700">
//                                         Nom
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="lastnameVet"
//                                         id={`lastnameVet-${index}`}
//                                         value={vet.lastnameVet}
//                                         onChange={(e) => handleVetChange(index, e)}
//                                         className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor={`firstnameVet-${index}`} className="block text-sm font-medium text-gray-700">
//                                         Prénom
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="firstnameVet"
//                                         id={`firstnameVet-${index}`}
//                                         value={vet.firstnameVet}
//                                         onChange={(e) => handleVetChange(index, e)}
//                                         className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor={`emailVet-${index}`} className="block text-sm font-medium text-gray-700">
//                                         Email
//                                     </label>
//                                     <input
//                                         type="email"
//                                         name="emailVet"
//                                         id={`emailVet-${index}`}
//                                         value={vet.emailVet}
//                                         onChange={(e) => handleVetChange(index, e)}
//                                         className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="mt-4 flex justify-end">
//                                 {index > 0 && (
//                                     <button
//                                         type="button"
//                                         onClick={() => removeVet(index)}
//                                         className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700"
//                                     >
//                                         Supprimer le vétérinaire
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     ))}

//                     <div className="mt-6 flex justify-end">
//                         <button
//                             type="button"
//                             onClick={addVet}
//                             className="bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700"
//                         >
//                             Ajouter un vétérinaire
//                         </button>
//                     </div>

//                     <div className="mt-6 flex justify-end">
//                         <button
//                             type="submit"
//                             className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                             Ajouter le centre vétérinaire
//                         </button>
//                     </div>
//             </form>
//         </section>
//         </>
//     );
// }

"use client";

import React, { useEffect, useState} from "react";
import axios from "axios";
import CenterForm from "@/app/components/CenterForm";

export default function AddVetCenterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postal: "",
        infos: "",
        department: "",
        phone: ""
    });

    const [vets, setVets] = useState([
        { firstname: "", lastname: "", email: "" }
    ]);

    // Soumission du formulaire
    const handleSubmit = async (data) => {
    // Renommer "staff" en "vets" pour correspondre au modèle attendu par l'API
        const formDataToSend = { ...data, vets: data.staff };
        delete formDataToSend.staff;

        try {
            const response = await axios.post("http://localhost:4000/vet-centers/add", formDataToSend);
            alert("Centre vétérinaire ajouté avec succès !");
            setFormData({
                name: "",
                email: "",
                address: "",
                city: "",
                postal: "",
                infos: "",
                department: "",
                phone: ""
            });
            setVets([{ firstname: "", lastname: "", email: "" }]);
        } catch (error) {
            console.error("Erreur lors de l'ajout du centre vétérinaire :", error);
            alert("Erreur lors de l'ajout du centre vétérinaire.");
        }
    };

    return (
        <CenterForm
            centerType="vétérinaire"
            staffLabel="Vétérinaire"
            initialData={{ ...formData, staff: vets }}
            // enableSubmitBtn= {true}
            onSubmit={handleSubmit}
        />
    );
}