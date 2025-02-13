"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columnsOsteo = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => {
      return (
        <Link href={`/centres-osteopathes/${row.original.id}`}>
          <button>
            <Badge>{row.original.name}</Badge>
          </button>
        </Link>
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