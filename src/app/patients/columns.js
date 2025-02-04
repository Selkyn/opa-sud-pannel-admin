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
            <Badge>
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
    accessorKey: "paymentType",
    header: "Type paiement",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.payment?.paymentType
            ? row.original.payment.paymentType.name
            : " "}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentMode",
    header: "Mode paiement",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.payment?.paymentMode
            ? row.original.payment.paymentMode.name
            : " "}
        </span>
      );
    },
  },
];
