"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columnsVet = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => {
      return (
        <Link href={`/centres-veterinaires/${row.original.id}`}>
          <button>
            <Badge className="bg-green-700 hover:bg-green-600">{row.original.name}</Badge>
          </button>
        </Link>
      );
    },
  },
  {
    accessorKey: "specialities",
    header: "Spécialités",
    cell: ({ row }) => {
      return (
        <ul>
          {row.original.Specialities && row.original.Specialities.length > 0 ? (
            row.original.Specialities.map((speciality) => (
              <li key={speciality.id}>{speciality.name}</li>
            ))
          ) : (
            <p>Aucune</p>
          )}
        </ul>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Ville",
    cell: ({ row }) => {
      return <p>{row.original.city}</p>;
    },
  },
  {
    accessorKey: "contact",
    header: "Relation",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.contact ? (
            <Badge variant="outline" className="bg-orange-400">{row.original.contact.name}</Badge>
          ) : (
            <Badge>Aucun</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "patients",
    header: "Patients",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.Patients && row.original.Patients.length > 0 ? (
            <p>{row.original.Patients.length}</p>
          ): (
            <p>0</p>
          )}
        </div>
      )
    }
  }
];
