// src/app/patients/[id]/page.js

"use client"; // Indique que ce composant est rendu côté client

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/app/utils/stringUtils";
import { calculateAge } from "@/app/utils/ageUtils";
import ContactEmail from "@/app/components/ContactEmail";
import Appointment from "@/app/components/Appointment";
import Workschedule from "@/app/components/WorkSchedule";
import EventModal from "@/app/components/EventModal";
import ToggleSection from "@/app/components/ToggleSection";
import AppointmentsSection from "@/app/components/AppointmentsSection";
import EventModalDetails from "@/app/components/EventModalDetails";
import { Button } from "@nextui-org/react";
import api from "@/utils/apiCall";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, Mail, MapPin, Stethoscope } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export default function PatientDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [patient, setPatient] = useState(null); // Stocke les détails du patient
  const [loading, setLoading] = useState(true); // Gère l'état de chargement
  const [error, setError] = useState(null); // Gère les erreurs
  const [showRDV, setShowRDV] = useState(false);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [isWorkScheduleModalOpen, setWorkScheduleModalOpen] = useState(false);
  const [editingWorkSchedule, setEditingWorkSchedule] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [status, setStatus] = useState([]);
  const [amount, setAmount] = useState("");

  const firstCardRef = useRef(null);
  const [firstCardHeight, setFirstCardHeight] = useState("auto");

  useEffect(() => {
    const updateHeight = () => {
      if (firstCardRef.current) {
        setFirstCardHeight(`${firstCardRef.current.offsetHeight}px`);
      }
    };

    updateHeight(); // Met à jour dès le premier rendu
    window.addEventListener("resize", updateHeight); // Met à jour en cas de redimensionnement

    return () => window.removeEventListener("resize", updateHeight);
  }, [patient]); // Met à jour si les données du patient changent

  useEffect(() => {
    if (id) {
      fetchPatientDetails();
      fetchPaymentData();
      fetchStatus();
    }
  }, [id]);

  // const getPatientVetCenterSpecialities = (vetCenterId) => {
  //   const patientsSpecialities = patient.PatientVetCenters.map(
  //     (patientVetCenter) => {
  //       if (patientVetCenter.vetCenterId === vetCenterId) {
  //         return patientVetCenter.Specialities.map(
  //           (speciality) => speciality.name
  //         );
  //       }
  //     }
  //   );
  // };

  const fetchPatientDetails = async () => {
    try {
      const response = await api.get(`/patients/${id}`);
      setPatient(response.data);

      // Vérifier si le patient a des paiements et récupérer le montant du dernier
      if (response.data.paiements?.length > 0) {
        setAmount(response.data.paiements[0].amount || ""); // Prend le premier paiement par défaut
      }

      setLoading(false);
    } catch (err) {
      setError("Erreur lors de la récupération des détails du patient");
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await api.get("/patients/status");
      setStatus(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des Status");
    }
  };

  const fetchPaymentData = async () => {
    try {
      const [typesResponse, modesResponse, statusResponse] = await Promise.all([
        api.get("/paymentTypes"),
        api.get("/paymentModes"),
        api.get("/paymentStatus"),
      ]);
      setPaymentTypes(typesResponse.data);
      setPaymentModes(modesResponse.data);
      setPaymentStatus(statusResponse.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de paiement:",
        error
      );
    }
  };

  const handleStatusChange = async (patientId, newStatusId) => {
    try {
      await api.put(`/patients/${patientId}/status`, { statusId: newStatusId });
      fetchPatientDetails();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  // const handlePaymentTypeChange = async (newPaymentTypeId) => {
  //   try {
  //     await api.put(`/payment/${id}/edit`, { paymentTypeId: newPaymentTypeId });
  //     fetchPatientDetails();
  //   } catch (error) {
  //     console.error(
  //       "Erreur lors de la mise à jour du type de paiement:",
  //       error
  //     );
  //   }
  // };

  // const handlePaymentModeChange = async (newPaymentModeId) => {
  //   try {
  //     await api.put(`/payment/${id}/edit`, { paymentModeId: newPaymentModeId });
  //     fetchPatientDetails();
  //   } catch (error) {
  //     console.error(
  //       "Erreur lors de la mise à jour du mode de paiement:",
  //       error
  //     );
  //   }
  // };

  // const handlePaymentStatusChange = async (newPaymentStatusId) => {
  //   try {
  //     await api.put(`/payment/${id}/edit`, {
  //       paymentStatusId: newPaymentStatusId,
  //     });
  //     fetchPatientDetails();
  //   } catch (error) {
  //     console.error(
  //       "Erreur lors de la mise à jour du mode de paiement:",
  //       error
  //     );
  //   }
  // };

  // const handlePaymentDateChange = async (newDate) => {
  //   try {
  //     await api.put(`/payment/${id}/edit`, { date: newDate });
  //     fetchPatientDetails();
  //   } catch (error) {
  //     console.error(
  //       "Erreur lors de la mise à jour de la date de paiement:",
  //       error
  //     );
  //   }
  // };

  // const handlePaymentEndDateChange = async (newEndDate) => {
  //   try {
  //     await api.put(`/payment/${id}/edit`, { endDate: newEndDate });
  //     fetchPatientDetails();
  //   } catch (error) {
  //     console.error(
  //       "Erreur lors de la mise à jour de la date de paiement:",
  //       error
  //     );
  //   }
  // };

  const handlePaymentTypeChange = async (paymentId, newPaymentTypeId) => {
    try {
      await api.put(`/payment/${paymentId}/edit`, {
        paymentTypeId: newPaymentTypeId,
      });
      fetchPatientDetails();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du type de paiement:",
        error
      );
    }
  };

  const handlePaymentModeChange = async (paymentId, newPaymentModeId) => {
    try {
      await api.put(`/payment/${paymentId}/edit`, {
        paymentModeId: newPaymentModeId,
      });
      fetchPatientDetails();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du mode de paiement:",
        error
      );
    }
  };

  const handlePaymentStatusChange = async (paymentId, newPaymentStatusId) => {
    try {
      await api.put(`/payment/${paymentId}/edit`, {
        paymentStatusId: newPaymentStatusId,
      });
      fetchPatientDetails();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de paiement:",
        error
      );
    }
  };

  const handlePaymentAmountChange = async (paymentId, newAmount) => {
    try {
      await api.put(`/payment/${paymentId}/edit`, { amount: newAmount });
      fetchPatientDetails();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du montant de paiement:",
        error
      );
    }
  };

  const handlePaymentDateChange = async (paymentId, newDate) => {
    try {
      await api.put(`/payment/${paymentId}/edit`, { date: newDate });
      fetchPatientDetails();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la date de paiement:",
        error
      );
    }
  };

  const handlePaymentEndDateChange = async (paymentId, newEndDate) => {
    try {
      await api.put(`/payment/${paymentId}/edit`, { endDate: newEndDate });
      fetchPatientDetails();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la date de paiement:",
        error
      );
    }
  };

  const handleButtonClick = () => {
    if (!amount || isNaN(amount)) {
      alert("Veuillez entrer un montant valide.");
      return;
    }
    handlePaymentAmountChange(amount); // Envoie la valeur validée à la fonction de mise à jour
  };

  // const handlePaymentAmountChange = async (newAmount) => {
  //   try {
  //     await api.put(`/payment/${id}/edit`, { amount: newAmount });
  //     fetchPatientDetails();
  //   } catch (error) {
  //     console.error(
  //       "Erreur lors de la mise à jour du mode de paiement:",
  //       error
  //     );
  //   }
  // };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const age =
    patient && patient.birthYear
      ? calculateAge(patient.birthYear)
      : "Non spécifié";

  const handleDelete = async () => {
    if (confirm(`Etes-vous sûr de vouloir supprimer ${patient.name} ?`)) {
      try {
        await api.delete(`/patients/${patient.id}/delete`);

        router.push("/patients");
      } catch (error) {
        console.error("Erreur lors de la suppression du patient :", error);
      }
    }
  };

  const handleEditClick = (workSchedule) => {
    const start = new Date(workSchedule.start_time);
    const end = new Date(workSchedule.end_time);

    setEditingWorkSchedule({
      ...workSchedule,
      start_time: start.toISOString().split("T")[0], // Format ISO (YYYY-MM-DD)
      start_time_hour: start.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      end_time: end.toISOString().split("T")[0],
      end_time_hour: end.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    });

    setWorkScheduleModalOpen(true); // Ouvre le modal
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <button
        onClick={() => router.back()}
        className="bg-green-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-700"
      >
        Revenir à la page précédente
      </button> */}

      {patient ? (
        <div className="flex flex-col item-center">
          <div className="mb-6 bg-white p-6 rounded-lg shadow flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {capitalizeFirstLetter(patient.name)}
              </h1>
              <p className="text-gray-600">
                <strong>Date du premier contact :</strong>{" "}
                {new Date(patient.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="text-gray-700 font-medium">Travail en cours :</p>
                <select
                  value={patient.status ? patient.status.id : ""}
                  onChange={(e) =>
                    handleStatusChange(patient.id, e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200"
                >
                  {status.map((statu) => (
                    <option key={statu.id} value={statu.id}>
                      {statu.name}
                    </option>
                  ))}
                </select>
              </div>
              <Link href={`/map?patientId=${patient.id}`}>
                <MapPin className="w-8 h-8 text-blue-500 hover:text-blue-700 cursor-pointer" />
              </Link>
            </div>
          </div>
          <div className="flex gap-4">
            <Card
              ref={firstCardRef}
              className="flex flex-col w-3/4 min-h-[600px]"
            >
              <div className="flex">
                <div>
                  <img
                    // src="https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/432f1e70-b4e9-45ae-a674-8db19cb3b655/Labrador%20noir%20debout%20sur%20l%E2%80%99herbe_1110x800.jpg?w=3840&q=75&auto=format"
                    src="https://previews.123rf.com/images/n1kcy/n1kcy1108/n1kcy110800105/10272613-tir-vertical-d-un-chien-de-berger-allemand-noir-au-trot-vers-la-cam%C3%A9ra-avec-un-b%C3%A2ton-dans-sa-bouche.jpg"
                    alt="Photo patient"
                    className="w-[300px] h-[400px] rounded-tl-lg object-cover object-center shadow"
                  />
                </div>
                <div className="w-1/2">
                  <CardHeader>
                    <CardTitle>Patient</CardTitle>
                  </CardHeader>
                  {/* <CardDescription>
                  Deploy your new project in one-click.
                </CardDescription> */}
                  <CardContent>
                    <div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-4">
                          <p className="font-bold">Espèce :</p>
                          <p>{patient.animalType?.name || "Non spécifié"}</p>
                        </div>
                        <Separator />

                        <div className="flex gap-4">
                          <p className="font-bold">Race :</p>
                          <p>{patient.race?.name || "Non spécifié"}</p>
                        </div>
                        <Separator />

                        <div className="flex gap-4">
                          <p className="font-bold">Année :</p>
                          <p>{patient.birthYear || "Non spécifié"}</p>
                        </div>
                        <Separator />

                        <div className="flex gap-4">
                          <p className="font-bold">Âge :</p>
                          <p>{age < 1 ? "Moins de 1 an" : `${age} ans`}</p>
                        </div>
                        <Separator />

                        <div className="flex gap-4">
                          <p className="font-bold">Poids :</p>
                          <p>
                            {patient.weight
                              ? `${patient.weight} kg`
                              : "Non spécifié"}
                          </p>
                        </div>
                        <Separator />

                        <div className="flex gap-4">
                          <p className="font-bold">Pathologie :</p>
                          <p>{patient.pathology || "Non spécifié"}</p>
                        </div>
                        <Separator />

                        <div className="flex flex-col">
                          <p className="font-bold">Membres affectés :</p>
                          {patient.Limbs.length > 0 ? (
                            <ul className="list-disc ml-6 text-sm">
                              {patient.Limbs.map((limb) => (
                                <li key={limb.id}>{limb.name}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">Non spécifié</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="w-1/2">
                  <CardHeader>
                    <CardTitle>Informations supplémentaires</CardTitle>
                  </CardHeader>
                  {/* <CardDescription>
                  Deploy your new project in one-click.
                </CardDescription> */}
                  <CardContent>
                    <p>
                      Rex, un Berger Allemand de 7 ans, pèse 32 kg. Il souffre
                      d’arthrose modérée aux pattes arrière, limitant sa
                      mobilité. Suivi par un vétérinaire et un ostéopathe, il
                      reçoit des soins réguliers. Malgré cela, il reste actif et
                      joueur, surtout lors de ses promenades quotidiennes.
                    </p>
                  </CardContent>
                </div>
              </div>
              <div>
                <Separator />
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informations du client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">
                        {/* <strong>Nom du client : </strong> */}
                        {patient.client && patient.client.sex
                          ? patient.client.sex.name === "male"
                            ? "Mr"
                            : patient.client.sex.name === "female"
                            ? "Mme"
                            : "Non spécifié"
                          : "Non spécifié"}{" "}
                        {patient.client && patient.client.lastname
                          ? capitalizeFirstLetter(patient.client.lastname)
                          : "Non spécifié"}{" "}
                        {patient.client &&
                        capitalizeFirstLetter(patient.client.firstname)
                          ? patient.client.firstname
                          : "Non spécifié"}
                      </p>
                      <div className="flex gap-4 items-center">
                        <Mail className="w-5 h-5 text-green-700" />
                        <p>{patient.client?.email || "Non spécifié"}</p>
                      </div>

                      {/* Téléphone */}
                      <div className="flex gap-4 items-center">
                        <Phone className="w-5 h-5 text-green-700" />
                        <p>{patient.client?.phone || "Non spécifié"}</p>
                      </div>

                      {/* Adresse */}
                      <div className="flex gap-4 items-center">
                        <MapPin className="w-5 h-5 text-green-700" />
                        <p>
                          {patient.client?.adress &&
                          patient.client?.city &&
                          patient.client?.postal
                            ? `${patient.client.adress}, ${patient.client.postal} ${patient.client.city}`
                            : "Non spécifié"}
                        </p>
                      </div>

                      {/* Adresse Bis */}
                      <div className="flex gap-4 items-center">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <p>Code digital 4058</p>
                      </div>
                    </div>
                    <div>
                      {patient.client && patient.client.email && (
                        <ContactEmail email={patient.client.email} />
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            <Card className="w-1/4 overflow-y-auto max-h-[650px]">
              <div>
                <CardHeader>
                  <CardTitle>Centres vétérinaires</CardTitle>
                  <CardDescription>Centres actifs</CardDescription>
                </CardHeader>
                <CardContent>
                  {patient.VetCenters && patient.VetCenters.length > 0 ? (
                    patient.VetCenters.map((center) => {
                      // 🔥 Trouver l'association Patient ↔ VetCenter
                      const patientVetCenter = patient.PatientVetCenters?.find(
                        (pvc) => pvc.vetCenterId === center.id
                      );

                      // 🔥 Vérifier si le patient est bien actif dans ce centre
                      if (!patientVetCenter || !patientVetCenter.isActive) {
                        return null; // ⬅️ Évite d'afficher un centre non actif
                      }

                      // 🔥 Spécialités choisies pour ce patient dans ce VetCenter
                      const selectedSpecialities =
                        patientVetCenter?.Specialities || [];

                      // patientVetCenter.isActive && console.log("okkkk");

                      return (
                        <div
                          key={center.id}
                          className="mb-4 p-4 bg-gray-200 shadow rounded-lg"
                        >
                          <Link href={`/centres-veterinaires/${center.id}`}>
                            <p>
                              <strong>{center.name || "Non spécifié"}</strong>{" "}
                            </p>
                          </Link>

                          <div className="flex gap-4 items-center">
                            <Mail className="w-5 h-5 text-green-700" />
                            <p>{center.email || "Non spécifié"}</p>
                          </div>

                          {/* Téléphone */}
                          <div className="flex gap-4 items-center">
                            <Phone className="w-5 h-5 text-green-700" />
                            <p>{center.phone || "Non spécifié"}</p>
                          </div>

                          {/* Spécialités choisies par le patient */}
                          <div className="flex gap-4 items-center">
                            <Stethoscope className="w-5 h-5 text-green-700" />
                            <p>
                              {selectedSpecialities.length > 0
                                ? selectedSpecialities
                                    .map((s) => s.name)
                                    .join(", ")
                                : "Aucune spécialité spécifique"}
                            </p>
                          </div>

                          {/* 🔥 Toutes les spécialités du VetCenter */}
                          {/* <p>
                      <strong>Spécialités du centre :</strong>{" "}
                      {center.Specialities?.map((s) => s.name).join(", ") ||
                        "Aucune"}
                    </p> */}
                          {/* <p>
                      <strong>Vétérinaires :</strong>
                    </p>
                    {center.vets && center.vets.length > 0 ? (
                      <ul>
                        {center.vets.map((vet) => (
                          <li key={vet.id}>
                            Dr {vet.firstname} {vet.lastname}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Aucun vétérinaire</p>
                    )} */}
                        </div>
                      );
                    })
                  ) : (
                    <p>Aucun centre vétérinaire associé.</p>
                  )}
                </CardContent>
              </div>
              <Separator className="w-64 mx-auto" />
              <div>
                <CardHeader>
                  <CardTitle>Centres ostéopathes</CardTitle>
                  <CardDescription>Centres actifs</CardDescription>
                </CardHeader>
                <CardContent>
                  {patient.OsteoCenters && patient.OsteoCenters.length > 0 ? (
                    patient.OsteoCenters.map((center) => (
                      <div
                        key={center.id}
                        className="mb-4 p-4 bg-gray-200 shadow rounded-lg"
                      >
                        <p>
                          <strong>{center.name || "Non spécifié"}</strong>{" "}
                        </p>
                        <div className="flex gap-4 items-center">
                          <Mail className="w-5 h-5 text-green-700" />
                          <p>{center.email || "Non spécifié"}</p>
                        </div>

                        {/* Téléphone */}
                        <div className="flex gap-4 items-center">
                          <Phone className="w-5 h-5 text-green-700" />
                          <p>{center.phone || "Non spécifié"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Aucun centre ostéopathe associé.</p>
                  )}
                </CardContent>
              </div>
              <Separator className="w-64 mx-auto" />
              <div>
                <CardHeader>
                  <CardTitle>Centres Vétérinaire</CardTitle>
                  <CardDescription>Anciens</CardDescription>
                </CardHeader>
                <CardContent>
                  {patient.VetCenters && patient.VetCenters.length > 0 ? (
                    patient.VetCenters.map((center) => {
                      // 🔥 Trouver l'association Patient ↔ VetCenter
                      const patientVetCenter = patient.PatientVetCenters?.find(
                        (pvc) => pvc.vetCenterId === center.id
                      );

                      // 🔥 Vérifier si le patient est bien actif dans ce centre
                      if (!patientVetCenter || patientVetCenter.isActive) {
                        return null; // ⬅️ Évite d'afficher un centre non actif
                      }

                      // 🔥 Spécialités choisies pour ce patient dans ce VetCenter
                      const selectedSpecialities =
                        patientVetCenter?.Specialities || [];

                      // patientVetCenter.isActive && console.log("okkkk");

                      return (
                        <div
                          key={center.id}
                          className="mb-4 p-4 bg-white shadow rounded-lg"
                        >
                          <Link href={`/centres-veterinaires/${center.id}`}>
                            <p>
                              <strong>{center.name || "Non spécifié"}</strong>{" "}
                            </p>
                          </Link>

                          <div className="flex gap-4 items-center">
                            <Mail className="w-5 h-5 text-green-700" />
                            <p>{center.email || "Non spécifié"}</p>
                          </div>

                          {/* Téléphone */}
                          <div className="flex gap-4 items-center">
                            <Phone className="w-5 h-5 text-green-700" />
                            <p>{center.phone || "Non spécifié"}</p>
                          </div>

                          {/* 🔥 Spécialités choisies par le patient */}
                          <p>
                            <strong>Spécialités choisies :</strong>{" "}
                            {selectedSpecialities.length > 0
                              ? selectedSpecialities
                                  .map((s) => s.name)
                                  .join(", ")
                              : "Aucune spécialité spécifique"}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p>Aucun centre vétérinaire associé.</p>
                  )}
                </CardContent>
              </div>
            </Card>
          </div>
          {/* Section client */}
          {/* <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Client</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Nom du client : </strong>
                  {patient.client && patient.client.sex
                    ? patient.client.sex.name === "male"
                      ? "Mr"
                      : patient.client.sex.name === "female"
                      ? "Mme"
                      : "Non spécifié"
                    : "Non spécifié"}{" "}
                  {patient.client && patient.client.lastname
                    ? capitalizeFirstLetter(patient.client.lastname)
                    : "Non spécifié"}{" "}
                  {patient.client &&
                  capitalizeFirstLetter(patient.client.firstname)
                    ? patient.client.firstname
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Adresse mail :</strong>{" "}
                  {patient.client && patient.client.email
                    ? patient.client.email
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Téléphone :</strong>{" "}
                  {patient.client && patient.client.phone
                    ? patient.client.phone
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Adresse :</strong>{" "}
                  {patient.client &&
                  patient.client.adress &&
                  patient.client.city &&
                  patient.client.postal
                    ? patient.client.adress +
                      " " +
                      patient.client.postal +
                      " " +
                      patient.client.city
                    : "Non spécifié"}
                </p>
              </div>
              <div>
                {patient.client && patient.client.email && (
                  <ContactEmail email={patient.client.email} />
                )}
              </div>
            </div>
          </div>
          <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Patient
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Espece : </strong>{" "}
                  {patient.animalType && patient.animalType.name
                    ? patient.animalType.name
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Race : </strong>{" "}
                  {patient.race && patient.race.name
                    ? patient.race.name
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Année de naissance :</strong>{" "}
                  {patient.birthYear ? patient.birthYear : "Non spécifié"}
                </p>
                <p>
                  <strong>Age : </strong>{" "}
                  {age < 1 ? "Moins de 1 an" : age + " ans"}
                </p>
                <p>
                  <strong>Poids :</strong>{" "}
                  {patient.weight ? patient.weight + " kg" : "Non spécifié"}
                </p>
                <p>
                  <strong>Pathologie :</strong>{" "}
                  {patient.pathology ? patient.pathology : "Non spécifié"}
                </p>
                <p>
                  <strong>Membres affectés :</strong>
                </p>
                {patient.Limbs.map((limb) => (
                  <ul key={limb.id}>
                    <li>{limb.name}</li>
                  </ul>
                ))}
              </div>
            </div>
          </div> */}
          {/* <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
            <Link href={`/centres-veterinaires/${patient.vetCenterId}`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Centre vétérinaire
              </h2>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Nom du centre : </strong>{" "}
                  {patient.vetCenter && patient.vetCenter.name
                    ? patient.vetCenter.name
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Adresse mail :</strong>{" "}
                  {patient.vetCenter && patient.vetCenter.email
                    ? patient.vetCenter.email
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Téléphone :</strong>{" "}
                  {patient.vetCenter && patient.vetCenter.phone
                    ? patient.vetCenter.phone
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Vétérinaire :</strong>
                </p>
                {patient.vetCenter?.vets &&
                patient.vetCenter.vets.length > 0 ? (
                  <ul>
                    {patient.vetCenter.vets.map((vet) => (
                      <li key={vet.id}>
                        Dr {vet.firstname} {vet.lastname}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "Aucun vétérinaire"
                )}
              </div>
              <div>
                {patient.vetCenter && patient.vetCenter.email && (
                  <ContactEmail email={patient.vetCenter.email} />
                )}
              </div>
            </div>
          </div>

          <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
            <Link href={`/centres-osteopathe/${patient.vetCenterId}`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Centre ostéopathe
              </h2>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Nom du centre : </strong>{" "}
                  {patient.osteoCenter && patient.osteoCenter.name
                    ? patient.osteoCenter.name
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Adresse mail :</strong>{" "}
                  {patient.osteoCenter && patient.osteoCenter.email
                    ? patient.osteoCenter.email
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Téléphone :</strong>{" "}
                  {patient.osteoCenter && patient.osteoCenter.phone
                    ? patient.osteoCenter.phone
                    : "Non spécifié"}
                </p>
                <p>
                  <strong>Vétérinaire :</strong>
                </p>
                {patient.osteoCenter?.osteos &&
                patient.osteoCenter.osteos.length > 0 ? (
                  <ul>
                    {patient.osteoCenter.osteos.map((osteo) => (
                      <li key={osteo.id}>
                        Dr {osteo.firstname} {osteo.lastname}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "Aucun ostéopathe"
                )}
              </div>
              <div> 
                {patient.osteoCenter && patient.osteoCenter.email && (
                  <ContactEmail email={patient.osteoCenter.email} />
                )}
              </div>
            </div>
          </div>*/}
          {/* 🏥 Affichage des centres vétérinaires */}

          {/* 🌿 Affichage des centres ostéopathes */}
          {/* <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Centres ostéopathes
            </h2>

            {patient.OsteoCenters && patient.OsteoCenters.length > 0 ? (
              patient.OsteoCenters.map((center) => (
                <div
                  key={center.id}
                  className="mb-4 p-4 bg-white shadow rounded-lg"
                >
                  <p>
                    <strong>Nom du centre :</strong>{" "}
                    {center.name || "Non spécifié"}
                  </p>
                  <p>
                    <strong>Adresse mail :</strong>{" "}
                    {center.email || "Non spécifié"}
                  </p>
                  <p>
                    <strong>Téléphone :</strong>{" "}
                    {center.phone || "Non spécifié"}
                  </p>
                  <p>
                    <strong>Ostéopathes :</strong>
                  </p>
                  {center.osteos && center.osteos.length > 0 ? (
                    <ul>
                      {center.osteos.map((osteo) => (
                        <li key={osteo.id}>
                          Dr {osteo.firstname} {osteo.lastname}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun ostéopathe</p>
                  )}
                </div>
              ))
            ) : (
              <p>Aucun centre ostéopathe associé.</p>
            )}
          </div> */}

          <div className="bg-white p-4 mt-6 rounded-lg shadow">
            <AppointmentsSection
              entity={patient}
              entityAppointments={"patientAppointments"}
              participantTypeFromParams="patient"
              fetchEntity={fetchPatientDetails}
            />
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setAppointmentModalOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Ajouter un Rendez-vous
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Patient introuvable</p>
      )}

      <div className="bg-white p-4 mt-6 rounded-lg shadow">
        <h3 className="font-bold">Planning de travail</h3>
        <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Date et Heure
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Tache
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {patient.workSchedules && patient.workSchedules.length > 0 ? (
              patient.workSchedules.map((workSchedule) => (
                <tr key={workSchedule.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(workSchedule.start_time).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    ) ===
                    new Date(workSchedule.end_time).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    ) ? (
                      // Si les dates sont identiques
                      <>
                        {new Date(workSchedule.start_time).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(workSchedule.start_time).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        à{" "}
                        {new Date(workSchedule.end_time).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </>
                    ) : (
                      // Si les dates sont différentes
                      <>
                        {new Date(workSchedule.start_time).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(workSchedule.start_time).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        au <br></br>{" "}
                        {new Date(workSchedule.end_time).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(workSchedule.end_time).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {workSchedule.task?.name || "Non spécifié"}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEditClick(workSchedule)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  Aucune tache de travail trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center gap-4 mt-8">
          {/* Bouton */}
          <button
            onClick={() => setWorkScheduleModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-colors"
          >
            Ajouter un Planning de Travail
          </button>

          {/* Sélection avec label */}
          {/* <div className="flex items-center gap-2">
            <p className="text-gray-700 font-medium">Travail en cours :</p>
            <select
              value={patient.status ? patient.status.id : ""}
              onChange={(e) => handleStatusChange(patient.id, e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200"
            >
              {status.map((statu) => (
                <option key={statu.id} value={statu.id}>
                  {statu.name}
                </option>
              ))}
            </select>
          </div> */}
        </div>
      </div>

      <EventModalDetails
        isOpen={isAppointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        title="Prendre un Rendez-vous"
      >
        <Appointment
          participantIdFromParams={id}
          participantTypeFromParams="patient"
          fetchEntity={fetchPatientDetails}
        />
      </EventModalDetails>

      {/* Modal pour WorkSchedule */}
      <EventModalDetails
        isOpen={isWorkScheduleModalOpen}
        onClose={() => {
          setWorkScheduleModalOpen(false);
          setEditingWorkSchedule(null); // Réinitialise les données en mode édition
        }}
        title={
          editingWorkSchedule
            ? "Modifier une tâche de travail"
            : "Ajouter un Planning de Travail"
        }
      >
        <Workschedule
          patientIdFromParams={id}
          initialData={editingWorkSchedule || {}} // Données initiales à éditer ou vide pour une nouvelle tâche
          onClose={() => setWorkScheduleModalOpen(false)}
          fetchEntity={fetchPatientDetails}
          // fetchAllEvents={fetchAllEvents} // Fonction pour recharger les données après modification
          edit={!!editingWorkSchedule} // Mode édition activé si `editingWorkSchedule` n'est pas null
        />
      </EventModalDetails>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm mt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Paiements</h2>

        {patient.payments && patient.payments.length > 0 ? (
          patient.payments.map((payment, index) => (
            <div
              key={payment.id}
              className="mb-4 p-4 bg-gray-200 shadow rounded-md"
            >
              <h3 className="text-lg font-semibold">Paiement {index + 1}</h3>

              <div className="flex gap-4">
                {/* Statut de paiement */}
                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    value={payment.paymentStatus?.id || ""}
                    onChange={(e) =>
                      handlePaymentStatusChange(payment.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {paymentStatus.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type de paiement */}
                <div>
                  <label className="block mb-2">Type</label>
                  <select
                    value={payment.paymentType?.id || ""}
                    onChange={(e) =>
                      handlePaymentTypeChange(payment.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {paymentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode de paiement */}
                <div>
                  <label className="block mb-2">Mode</label>
                  <select
                    value={payment.paymentMode?.id || ""}
                    onChange={(e) =>
                      handlePaymentModeChange(payment.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {paymentModes.map((mode) => (
                      <option key={mode.id} value={mode.id}>
                        {mode.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date de paiement */}
                <div>
                  <label className="block mb-2">Date</label>
                  <input
                    type="date"
                    value={payment.date?.split("T")[0] || ""}
                    onChange={(e) =>
                      handlePaymentDateChange(payment.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </div>

                {/* Date de fin paiement */}
                <div>
                  <label className="block mb-2">Fin</label>
                  <input
                    type="date"
                    value={payment.endDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      handlePaymentEndDateChange(payment.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </div>

                {/* Montant */}
                <div>
                  <label className="block mb-2">Montant (€)</label>
                  <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) =>
                      handlePaymentAmountChange(payment.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun paiement enregistré</p>
        )}
      </div>
      <div>
        <Link href={`/patients/${patient.id}/edit`}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
            Modifier
          </button>
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Supprimer
        </button>
        {/* <Link href={`/map?patientId=${patient.id}`}>
        <MapPin className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer" />

        </Link> */}
      </div>
    </div>
  );
}
