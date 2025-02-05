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

export default function CardPatientList({ patient }) {
  return (
    <Link href={`/patients/${patient.id}`}>
      <Card
        className={`w-72 border ${
          patient.sex.name === "male"
            ? "border-blue-400 hover:bg-blue-100"
            : "border-pink-400 hover:bg-pink-100"
        } `}
      >
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>
            <div className="flex items-center justify-left space-x-3">
              <span
                className={`w-12 h-12 flex items-center justify-center rounded-full ${
                  patient.sex.name === "male" ? "bg-blue-400" : "bg-pink-400"
                } text-white font-bold text-lg`}
              >
                {patient.name[0].toUpperCase()}
              </span>
              <div className="flex flex-col gap-2">
                <p className="font-semibold">{patient.name}</p>
                <p className="font-normal text-sm text-gray-500">
                  {patient.client && patient.client.sex
                    ? patient.client.sex.name === "male"
                      ? "Mr"
                      : patient.client.sex.name === "female"
                      ? "Mme"
                      : "Non spécifié"
                    : "Non spécifié"}{" "}
                  {patient.client
                    ? `${patient.client.lastname} ${patient.client.firstname}`
                    : "Client inconnu"}
                </p>
              </div>
            </div>
          </CardTitle>

          <CardDescription>
            <Badge className="bg-orange-400 hover:bg-orange-400">
              {patient?.status?.name ?? "Inconnu"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <p className="font-semibold">Pathologie</p>
            <p className="text-sm text-gray-500">
              {patient.pathology ? patient.pathology : "Inconnu"}
            </p>
          </div>

          <div className="mt-2">
            <p className="font-semibold">Paiement</p>
            {patient.payments?.length > 0 ? (
              patient.payments.map((payment) => (
                <p key={payment.id} className="text-sm text-gray-500">
                  {payment.paymentStatus.name},{" "}
                  {payment.paymentMode.name !== "Non spécifié"
                    ? payment.paymentMode.name
                    : ""}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun paiement enregistré</p>
            )}
          </div>
        </CardContent>
        {/* <CardFooter> */}
        {/* <Link href={`/patients/${patient.id}`}>
                        {patient.sex.name === "male" ? (
                          <button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">
                            Voir
                          </button>
                        ) : (
                          <button className="bg-pink-500 text-white px-2 py-1 rounded-md mr-2">
                            Voir
                          </button>
                        )}
                      </Link> */}
        {/* </CardFooter> */}
      </Card>
    </Link>
  );
}
