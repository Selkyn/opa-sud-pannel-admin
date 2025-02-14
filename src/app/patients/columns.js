"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columns = [
  {
    accessorKey: "name",
    header: "Patient",
    cell: ({ row }) => {
      return (
        <Link href={`/patients/${row.original.id}`}>
          <button>
            <Badge
              className={`${
                row.original.sex.name === "male"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-pink-400 hover:bg-pink-600"
              }`}
            >
              {row.original.name}
            </Badge>
          </button>
        </Link>
      );
    },
  },

  {
    header: "Client",
    accessorKey: "client",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.client?.sex?.name
            ? row.original.client.sex.name === "male"
              ? "Mr"
              : row.original.client.sex.name === "female"
              ? "Mme"
              : "Non spécifié"
            : "Non spécifié"}{" "}
          {row.original.client
            ? `${row.original.client.firstname || "?"} ${
                row.original.client.lastname || "?"
              }`
            : "Client inconnu"}
        </span>
      );
    },
  },
  {
    header: "Race",
    accessorKey: "race",
    cell: ({ row }) => {
      const { animalType, race } = row.original;
  
      return (
        <p>
          {animalType?.name === "Chien"
            ? race?.name || animalType?.name // Si race existe, on l'affiche, sinon on affiche "Chien"
            : animalType?.name || "Inconnu" // Si l'animal n'est pas un chien, on affiche son type ou "Inconnu"
          }
        </p>
      );
    },
  },
  

  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="bg-orange-400">
          {row.original.status?.name || "Non disponible"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pathology",
    header: "Pathologie",
  },
  {
    accessorKey: "paymentStatus",
    header: "Status paiement",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.payments?.length > 0 ? (
            row.original.payments.map((payment) => (
              <span key={payment.id} className="block text-sm text-gray-700">
                {payment.paymentStatus ? payment.paymentStatus.name : "Non spécifié"}
              </span>
            ))
          ) : (
            <span className="text-gray-500">Aucun paiement</span>
          )}
        </div>
      );
    },
  },
  
  {
    accessorKey: "paymentMode",
    header: "Mode paiement",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.payments?.length > 0 ? (
            row.original.payments.map((payment) => (
              <span key={payment.id} className="block text-sm text-gray-700">
                {payment.paymentMode ? payment.paymentMode.name : "Non spécifié"}
              </span>
            ))
          ) : (
            <span className="text-gray-500">Aucun paiement</span>
          )}
        </div>
      );
    },
  },
];
