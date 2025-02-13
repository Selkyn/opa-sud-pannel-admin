"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function CardCenterList({
  title,
  data,
  columns,
  entityType,
  searchTerm,
  onSearchChange,
  staffs,
  staffLabel,
  callBackend,
  refreshData,
  selectedContactFilters,
  handleContactFilterChange,
}) {
  return (
    <Link href={`/${entityType}/${data.id}`}>
      <Card className="w-72 border border-green-400 hover:bg-green-100">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>
            <div className="flex items-center justify-left space-x-3">
              <span className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-lg">
                {data.name[0].toUpperCase()}
              </span>
              <div className="flex flex-col gap-2">
                <p className="font-semibold">{data.name}</p>
                <p className="font-normal text-sm text-gray-500">{data.city}</p>
              </div>
            </div>
          </CardTitle>

          <CardDescription>
            <Badge className="bg-orange-400 hover:bg-orange-400">
              {data?.contact?.name ?? "Inconnu"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <p className="font-semibold">Patients</p>
            <Badge className="text-sm text-gray-50 bg-green-700">
              {data.Patients && data.Patients.length > 0
                ? data.Patients.length
                : "0"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
